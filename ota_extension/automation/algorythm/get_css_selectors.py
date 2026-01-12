import csv
import requests
from bs4 import BeautifulSoup
import sys
import re
from urllib.parse import urljoin

# --- KONFIGURATION ---
INPUT_FILE = "results_links.csv"
OUTPUT_FILE = "results_css_selectors.csv"

# Elemente, die in remove-Liste müssen
REMOVE_TAGS = ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'meta', 'iframe', 'svg', 'aside']
REMOVE_CLASSES = ['cookie', 'popup', 'modal', 'sidebar', 'menu', 'navigation', 'advert', 'promo', 'social', 'share']

# Keywords für PDF-Suche
KEYWORDS_HEADLINES = {
    "privacy": [
        "datenschutz", "datenschutzerklärung", "datenschutzinfo", "privacy", 
        "privacy policy", "data protection", "privatsphäre", "cookie-richtlinie", "cookies",
        "herunterladen", "download", "pdf"
    ],
    "tos": [
        "agb", "allgemeine geschäftsbedingungen", "nutzungsbedingungen", 
        "terms", "terms of service", "user agreement", "rechtliche hinweise", "impressum",
        "lieferbedingungen", "verkaufsbedingungen", "herunterladen", "download", "pdf"
    ]
}

KEYWORDS_CONTENT = {
    "privacy": [
        "dsgvo", "gdpr", "art. 13", "art. 14", "verantwortlicher", "personenbezogene daten",
        "rechtsgrundlage", "einwilligung", "berechtigtes interesse", "empfänger", "speicherdauer",
        "betroffenenrechte", "auskunft", "löschung", "beschwerderecht", "datenschutzbeauftragter",
        "tracking", "webanalyse", "google analytics", "cookies"
    ],
    "tos": [
        "geltungsbereich", "vertragsschluss", "leistungen", "nutzung", "pflichten", "haftung",
        "gewährleistung", "laufzeit", "kündigung", "änderungen dieser bedingungen",
        "schlussbestimmungen", "anwendbares recht", "gerichtsstand", "salvatorische klausel",
        "preise", "zahlungsbedingungen", "widerrufsrecht", "lieferung", "retoure"
    ]
}

# --- HELPER: CSS Selektor generieren ---
def generate_css_selector(element, relative_to=None):
    if not element or element.name == 'body': return "body"

    if element.has_attr('id'):
        ele_id = element['id']
        if isinstance(ele_id, list): ele_id = ele_id[0]
        if " " not in ele_id and not any(x in ele_id.lower() for x in REMOVE_CLASSES):
            return f"{element.name}#{ele_id}"

    if element.has_attr('class'):
        classes = element['class']
        good_classes = [c for c in classes if c not in ["row", "container", "clearfix", "wrapper", "content", "col-md-12", "text-body"] 
                        and not any(x in c.lower() for x in REMOVE_CLASSES)]
        if good_classes:
            return f"{element.name}.{good_classes[0]}"

    if element.name in ['main', 'article']: return element.name

    parent = element.find_parent()
    if parent:
        if relative_to and parent == relative_to: return f"> {element.name}"
        parent_sel = generate_css_selector(parent, relative_to)
        if parent_sel == "body" and element.name == "body": return "body"
        return f"{parent_sel} > {element.name}".strip()
    
    return element.name

def find_remove_selectors(container):
    remove_list = []
    for tag_name in REMOVE_TAGS:
        for junk in container.find_all(tag_name):
            sel = generate_css_selector(junk)
            if sel not in remove_list: remove_list.append(sel)
    
    regex = re.compile("|".join(REMOVE_CLASSES), re.I)
    for junk in container.find_all(attrs={"id": regex}):
        sel = generate_css_selector(junk)
        if sel not in remove_list: remove_list.append(sel)
    for junk in container.find_all(attrs={"class": regex}):
        sel = generate_css_selector(junk)
        if sel not in remove_list: remove_list.append(sel)
            
    return remove_list

# --- HELPER: PDF Suche auf Wrapper-Page ---
def find_pdf_in_wrapper(soup, base_url, doc_type):
    """
    Sucht aggressiv nach einem PDF Link.
    """

    # ignoriert Groß-/Kleinschreibung, pdf nicht nur am Ende
    pdf_links = soup.find_all('a', href=re.compile(r'\.pdf', re.I))
    
    keywords = KEYWORDS_HEADLINES.get(doc_type, [])
    
    # bevorzuge Links mit keywords im text
    candidates = []

    for link in pdf_links:
        href = link.get('href', '')
        text = link.get_text(" ", strip=True).lower()
        href_lower = href.lower()
        title = link.get('title', '').lower()
        
        # Scoring System für Relevanz
        score = 0
        
        # 1. Keywords im sichtbaren Text? (Sehr stark)
        if any(kw in text for kw in keywords):
            score += 3
            
        # 2. Keywords im Dateinamen/URL?
        if any(kw in href_lower for kw in keywords):
            score += 2
            
        # 3. Keywords im Title-Attribut?
        if any(kw in title for kw in keywords):
            score += 1
            
        if score > 0:
            full_url = urljoin(base_url, href)
            candidates.append((score, full_url))
            
    # Auswahl: Kandidat mit höchstem Score
    candidates.sort(key=lambda x: x[0], reverse=True)
    
    if candidates:
        return candidates[0][1] # URL zurückgeben
            
    return None

# --- CORE: Analyse ---
def find_smart_selector(url, doc_type):
    if not url or "http" not in url:
        return "", [], None

    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return "", [], None

        # 1. CHECK: Ist URL direkt PDF?
        content_type = response.headers.get('Content-Type', '').lower()
        if 'application/pdf' in content_type or url.lower().strip().endswith('.pdf'):
            return "::PDF::", [], None

        soup = BeautifulSoup(response.text, "lxml")
        
        # 2. PDF SCAN (IMMER ausführen)

        found_pdf = find_pdf_in_wrapper(soup, url, doc_type)
        if found_pdf:
            # relevantes PDF gefunden -> abbruch (PDF ergibt den cleansten text)
            return "::PDF::", [], found_pdf

        # 3. HTML CONTENT EXTRACTION (Fallback, falls kein PDF)
        current_element = soup.body
        if not current_element: return "", [], None

        total_text_len = len(current_element.get_text(strip=True))
        if total_text_len < 100: return "body", [], None

        # Drill Down
        while True:
            best_child = None
            best_child_len = 0
            candidates = [child for child in current_element.find_all(recursive=False) 
                          if child.name not in REMOVE_TAGS]
            
            for child in candidates:
                child_str = str(child).lower()
                if any(x in child_str for x in REMOVE_CLASSES) and len(child_str) < 500:
                    continue
                child_text_len = len(child.get_text(strip=True))
                if child_text_len > best_child_len:
                    best_child_len = child_text_len
                    best_child = child
            
            if best_child and (best_child_len / total_text_len > 0.70) and best_child_len > 200:
                current_element = best_child
                total_text_len = best_child_len 
            else:
                break
            
        # Header Walk Up
        temp_element = current_element
        headline_keywords = KEYWORDS_HEADLINES["privacy"] + KEYWORDS_HEADLINES["tos"]
        levels_up = 0
        while temp_element and temp_element.name != 'body' and levels_up < 4:
            parent = temp_element.find_parent()
            if not parent: break
            found_header = False
            for prev in temp_element.find_previous_siblings():
                if prev.name in ['h1', 'h2', 'h3']:
                    if any(kw in prev.get_text(strip=True).lower() for kw in headline_keywords):
                        current_element = parent
                        found_header = True
                        break 
                if len(prev.get_text(strip=True)) > 200: break 
            if found_header: break 
            temp_element = parent
            levels_up += 1

        final_selector = generate_css_selector(current_element)
        remove_selectors = find_remove_selectors(current_element)
        return final_selector, remove_selectors, None

    except Exception as e:
        print(f"Fehler bei {url}: {e}")
        return "", [], None

# --- MAIN ---
try:
    rows = []
    with open(INPUT_FILE, "r", encoding="utf-8") as infile:
        reader = csv.DictReader(infile, delimiter=";")
        rows = list(reader)
        fieldnames = reader.fieldnames
        
    print(f"Lade {len(rows)} Zeilen aus {INPUT_FILE}...")
    updated_rows = []

    for row in rows:
        print(f"\n--- Analysiere: {row.get('Website', 'Unknown')} ---")
        
        # Privacy
        p_sel, p_rem, p_new = find_smart_selector(row["Privacy_Link"], "privacy") 
        if p_new:
            print(f"   Privacy: PDF gefunden -> {p_new}")
            row["Privacy_Link"] = p_new
        row["Privacy_Selector"] = p_sel
        row["Privacy_Remove"] = ", ".join(p_rem)

        # ToS
        t_sel, t_rem, t_new = find_smart_selector(row["ToS_Link"], "tos")
        if t_new:
            print(f"   ToS: PDF gefunden -> {t_new}")
            row["ToS_Link"] = t_new
        row["ToS_Selector"] = t_sel
        row["ToS_Remove"] = ", ".join(t_rem)
        
        updated_rows.append(row)

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as outfile:
        new_fieldnames = list(fieldnames)
        for col in ["Privacy_Selector", "Privacy_Remove", "ToS_Selector", "ToS_Remove"]:
            if col not in new_fieldnames: new_fieldnames.append(col)
        
        writer = csv.DictWriter(outfile, fieldnames=new_fieldnames, delimiter=";")
        writer.writeheader()
        writer.writerows(updated_rows)

    print("-" * 30)
    print(f"Fertig! Ergebnisse in: {OUTPUT_FILE}")

except FileNotFoundError:
    print(f"Fehler: {INPUT_FILE} fehlt")