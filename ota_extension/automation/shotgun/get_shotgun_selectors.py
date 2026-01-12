import csv
import requests
from bs4 import BeautifulSoup
import sys
import re
from urllib.parse import urljoin

# --- KONFIGURATION ---
INPUT_FILE = "results_links.csv"
OUTPUT_FILE = "results_css_selectors.csv"

# Elemente für remove-Liste
REMOVE_TAGS = ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'meta', 'iframe', 'svg', 'aside']
REMOVE_CLASSES = ['cookie', 'popup', 'modal', 'sidebar', 'menu', 'navigation', 'advert', 'promo', 'social', 'share']

# --- DIE SHOTGUN LISTE ---
# TODO: Liste priorisieren
# Strategie: Von spezifisch (IDs) zu generisch (Tags)
# Die Liste wird von oben nach unten abgearbeitet. Der erste Treffer gewinnt
SHOTGUN_PRIORITY_LIST = [
    # 1. Top-Performer (Häufigkeit >= 3)
    "#main-content",            # 7 Treffer 
    "article.container",        # 4 Treffer (robust, da Tag + Klasse)
    "#content-wrapper",         # 3 Treffer
    ".article-body",            # 3 Treffer
    ".textLayer",               # 3 Treffer (oft PDF.js Viewer im Browser, wird wahrscheinlich nicht gefunden aber kostet ja nix ;))
    
    # 2. Spezifische IDs und Klassen (Häufigkeit 2)
    "#content",                 
    "#s1-main-content",         
    ".articlebody",             
    ".pagecontent",             
    ".c-article-pagetext",      
    ".help-service-content",    
    
    # 3. Häufigkeit 1-2
    ".textcontent",
    ".contentpage",
    ".detail_inlay",
    ".wrapper-article",
    ".cf-singlepage-legal",     
    "#fragen-und-antworten",  
    
    # 4. HTML5 Standards 
    "main",                     # standard-tag
    "article",                  # oft text-container
    '[role="main"]',            # accessibility standard  
    
    # 5. Fallbacks (risiko, wahrscheinlich zu viel Inhalt)
    ".container",               # 3 Treffer, aber sehr generisch (evtl. header mit drin)
    ".content",                 
    ".main",
    ".article",
    "div.container",
    "div.wrapper"
]

# Keywords für PDF-Suche 
KEYWORDS_HEADLINES = {
    "privacy": ["datenschutz", "privacy", "download", "pdf"],
    "tos": ["agb", "terms", "download", "pdf"]
}

# --- HELPER: CSS Selektor generieren ---
# nur noch für die Remove-Liste benötigt
def generate_css_selector(element):
    if not element or element.name == 'body': return "body"
    if element.has_attr('id'): return f"{element.name}#{element['id']}"
    if element.has_attr('class'): return f"{element.name}.{element['class'][0]}"
    return element.name

# --- HELPER: Remove-Selektoren finden ---
# Sucht Müll INNERHALB des gefundenen Shotgun-Treffers
def find_remove_selectors(container):
    remove_list = []
    # 1. Tags
    for tag_name in REMOVE_TAGS:
        for junk in container.find_all(tag_name):
            sel = generate_css_selector(junk)
            if sel not in remove_list: remove_list.append(sel)
    # 2. Klassen/IDs
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
    pdf_links = soup.find_all('a', href=re.compile(r'\.pdf', re.I))
    keywords = KEYWORDS_HEADLINES.get(doc_type, [])
    candidates = []

    for link in pdf_links:
        href = link.get('href', '')
        text = link.get_text(" ", strip=True).lower()
        
        score = 0
        if any(kw in text for kw in keywords): score += 3
        if any(kw in href.lower() for kw in keywords): score += 2
        
        if score > 0:
            full_url = urljoin(base_url, href)
            candidates.append((score, full_url))
            
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1] if candidates else None

# --- CORE: SHOTGUN METHODE ---
def find_shotgun_selector(url, doc_type):
    if not url or "http" not in url:
        return "", [], None

    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return "", [], None

        # 1. PDF Check
        content_type = response.headers.get('Content-Type', '').lower()
        if 'application/pdf' in content_type or url.lower().strip().endswith('.pdf'):
            return "::PDF::", [], None

        soup = BeautifulSoup(response.text, "lxml")
        
        # 2. PDF Wrapper Check
        # PDF ist das besser als jeder HTML Selektor
        found_pdf = find_pdf_in_wrapper(soup, url, doc_type)
        if found_pdf:
            return "::PDF::", [], found_pdf

        # 3. SHOTGUN LOGIK
        final_element = None
        final_selector_string = ""

        print(f"   -> Schieße mit der Shotgun auf: ({len(SHOTGUN_PRIORITY_LIST)} Kandidaten)...")

        for selector in SHOTGUN_PRIORITY_LIST:
            # ERSTES Element, das auf den Selektor passt
            candidate = soup.select_one(selector)
            
            if candidate:
                # ist da Text drin?
                # keine leeren main matchen
                text_len = len(candidate.get_text(strip=True))
                
                if text_len > 200: 
                    print(f"   -> TREFFER: '{selector}' (Textlänge: {text_len})")
                    final_element = candidate
                    final_selector_string = selector
                    break # erster Treffer gewinnt -> Abbruch
                else:
                    # Debug Info: Gefunden aber leer
                    # print(f"      (Ignoriere '{selector}': Zu wenig Text ({text_len}))")
                    pass

        # 4. FALLBACK
        if not final_element:
            print("   -> KEIN Treffer in Shotgun-Liste. Fallback auf 'body'")
            final_element = soup.body
            final_selector_string = "body"

        # 5. REMOVE LISTE BAUEN
        remove_selectors = find_remove_selectors(final_element)

        return final_selector_string, remove_selectors, None

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
        p_sel, p_rem, p_new = find_shotgun_selector(row["Privacy_Link"], "privacy") 
        if p_new:
            print(f"   Privacy: PDF gefunden -> {p_new}")
            row["Privacy_Link"] = p_new
        row["Privacy_Selector"] = p_sel
        row["Privacy_Remove"] = ", ".join(p_rem)

        # ToS
        t_sel, t_rem, t_new = find_shotgun_selector(row["ToS_Link"], "tos")
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