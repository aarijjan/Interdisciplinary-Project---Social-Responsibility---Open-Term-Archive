import os
import sys
import json
import re
import time
import requests
from urllib.parse import urljoin, urlparse
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from google import genai

# --- CONFIG ---

# Load API key and supply it to the llm library
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

client = genai.Client(api_key=api_key)

# which models to consider when connecting via the api
# examples: ["gemini-3-pro", "gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"]
model_priorities = ["gemini-3-pro", "gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"]

# Keywords for URL Crawler
keywords_privacy = [
    "datenschutz", "privacy policy", "privacy statement", 
    "privacy notice", "data protection", "privatsphäre", 
    "datenschutzerklärung"
]

keywords_tos = [
    "allgemeine geschäftsbedingungen", "agb", "terms of service", 
    "terms of use", "terms and conditions", "nutzungsbedingungen", 
    "user agreement"
]

# Set up system prompt for the llm
system_prompt = """
You are an expert in web scraping and CSS selector stability, specifically for the Open Terms Archive. 
Your goal is to analyse HTML content and identify the most robust CSS selectors to extract the main body of text (Terms of Service, Privacy Policy, etc.) while excluding headers, footers, and ads.

Adhere strictly to the following 'Choosing Selectors' guidelines:

1. **Simplicity & Durability**: 
   - Prefer simple selectors. Avoid deep nesting (e.g., `main > div > div > .text`).
   - Avoid pseudo-classes like `:nth-child(2)` as they are brittle.
   - Reliance on the structure of surrounding content makes selectors fragile; avoid it.

2. **Semantic Naming**:
   - Prioritize semantic IDs and class names (e.g., `#legal-content`, `.terms-body`, `[role="main"]`).
   - **STRICTLY AVOID** random, alphanumeric, or generated class names (e.g., `.css-1a2b3c`, `.sc-xyz123`, `._3zdf8p`). These change on every deployment.

3. **Specificity**:
   - Use high-specificity selectors to avoid accidentally selecting navigation or sidebars (e.g., `#main-article` is better than `.content`).

4. **Strategy**:
   - **Select**: Choose the container that holds the legal text. If the text is split, return a list of selectors.
   - **Remove**: Identify elements *inside* the selection that should be ignored (share buttons, internal ads, popups).
   - **Start Wide**: It is better to select a slightly larger container and `remove` specific junk than to write an overly specific, fragile selector that might miss new paragraphs.

Output your answer in strict JSON format with only the following structure:
{
    "select": "string or array of strings (the CSS selector for the main content)",
    "remove": "string or array of strings (optional, elements to exclude like sidebars/ads)"
}
"""
# --- FUNCTIONS ---

# Check which models are available on the api and use the best one
def get_model():
    try:
        # Get all models currently available
        all_models = list(client.models.list())

        # We filter for models that support text generation
        usable_models = [
                m.name.replace("models/", "") 
                for m in all_models 
                if "generateContent" in m.supported_actions
            ]

        # Check for exact match with a generator expression, checks one by one and terminates on the first match, default value after comma
        for preferred in model_priorities:
                match = next((name for name in usable_models if preferred in name), None)
                if match:
                    print(f"  --> LLM gefunden. Nutze: {match}")
                    return match

        # Fallback: Just take the first valid Gemini model found
        fallback = next((name for name in usable_models if "gemini" in name), "gemini-2.0-flash")
        print(f"  * Fallback LLM ausgewählt: {fallback}")
        return fallback

    except Exception as e:
        print(f"  ! Fehler beim Abruf verfügbarer LLMs: {e}")
        print("  ! Probiere: gemini-2.0-flash")
        return "gemini-2.0-flash"

# Check a supplied text for our keywords defined above
def check_keywords(text, keyword_list):
    for kw in keyword_list:
        if re.search(rf"\b{re.escape(kw)}\b", text):
            return True
    return False

# Fetch an URL and return a cleaned bs4 soup without script/svg etc.
def fetch_and_clean(url):
    try:
        # Set user agent to avoid being shut out as a bot
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Remove extraneous shit to save tokens and reduce noise
        # e.g. scripts, styles, svgs, meta tags, etc.
        for tag in soup(["script", "style", "svg", "meta", "noscript", "link"]):
            tag.decompose()

        # Return the cleaned html
        return str(soup)

    except Exception as e:
        print(f"Error bei Zugriff  auf Seite {url}: {e}")
        return None

# Tries 3 ways to extract a site name from the page and/or url
def extract_site_name(soup, url):

    # Get the domain base
    domain = urlparse(url).netloc
    if domain.startswith("www."):
        domain = domain[4:]
    domain_base = domain.split('.')[0].lower()

    # 2. Gather candidates
    candidates = []

    # Try to find an open graph site name (good when defined)
    og = soup.find("meta", property="og:site_name")
    if og and og.get("content"):
        candidates.append(og["content"].strip())

    # Try to find a schema.org name (sometimes defined)
    meta_name = soup.find("meta", itemprop="name")
    if meta_name and meta_name.get("content"):
        candidates.append(meta_name["content"].strip())

    # Go by title tag and split by separators as fallback
    if soup.title and soup.title.string:
        title_raw = soup.title.string
        # Split by common separators: | - : · —
        segments = re.split(r'[|\-—:·]', title_raw)
        for s in segments:
            candidates.append(s.strip())

    # Score candidates against a rubric/each other
    # We want the name that contains the domain_base AND is the shortest non-generic string.
    best_fit = domain.capitalize() # Default fallback
    best_score = -100

    # Terms to ignore (common start pages)
    blocklist = ["startseite", "home", "homepage", "willkommen", "index", "log in", "sign up", "welcome"]

    for cand in candidates:
        if not cand: continue
        
        cand_lower = cand.lower()
        
        # Skip generic terms
        if cand_lower in blocklist:
            continue
            
        # initialize score
        score = 0
        
        # Criteria 1: Exact or partial match with domain
        if domain_base in cand_lower:
            score += 50
        
        # Criteria 2: Length (penalty)
        score -= len(cand)
        
        # Keep score and save the current favourite        
        if score > best_score:
            best_score = score
            best_fit = cand

    return best_fit

# Finds site name, tos & privacy links on webpages and return target URLs
def find_links(base_url):
    print(f"  Suche nach links")
    
    # We fetch the raw HTML of the page we want to look at
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'}
        response = requests.get(base_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, "html.parser")
    except Exception as e:
        print(f"  ! Seite nicht verfügbar: {e}")
        return None, None # Return double None to explicitly signal the fetch failed

    # Extract site name
    site_name = extract_site_name(soup, base_url)
    print(f"    -> Extrahierter Name: {site_name}")

    found_links = {}
    all_links = soup.find_all("a", href=True)

    for link in all_links:
        link_text = link.get_text(strip=True).lower()
        href = link.get("href")
        
        # Resolve relative URLs (/privacy -> https://page.com/privacy)
        full_url = urljoin(base_url, href)

        # Check for privacy policies and add results to our map
        if "Privacy Policy" not in found_links and check_keywords(link_text, keywords_privacy):
            print(f"    -> Treffer für Privacy Policy: {link_text} -> {full_url}")
            found_links["Privacy Policy"] = full_url

        # Check for ToS and add results to our map
        if "Terms of Service" not in found_links and check_keywords(link_text, keywords_tos):
            print(f"    -> Treffer für ToS:     {link_text} -> {full_url}")
            found_links["Terms of Service"] = full_url

        # If map contains more than 2 key, something went wrong
        if len(found_links) >= 2:
            break
            
    return site_name, found_links

# Uses the fetched URLS and sends them to the to the LLM for selector extraction
# Retries 3 times if it runs into a rate limit
def analyse_selectors(url, doc_type, model_name):
    print(f"  ...Analysiere {doc_type}: {url}")
    
    html_content = fetch_and_clean(url)
    if not html_content:
        return None

    # Retry settings
    max_retries = 3
    base_delay = 2  # Start with 2 seconds wait

    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=model_name,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json"
                ),
                contents=f"Analyse this {doc_type} page and extract selectors:\n\n{html_content}",
            )
            return json.loads(response.text)

        except Exception as e:
            error_msg = str(e)
            
            # Check for 429 (Resource Exhausted)
            # And set up an Exponential backoff: 2s, 4s, 8s
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                if attempt < max_retries - 1:
                    wait_time = base_delay * (2 ** attempt) 
                    print(f"    ! Rate Limit erreicht? Warte {wait_time}s ...")
                    time.sleep(wait_time)
                    continue
                else:
                    print(f"    ! Fehlgeschlagen nach {max_retries} Versuchen. Rate Limit erreicht?")
                    return None
            else:
                print(f"    ! LLM Fehler auf {url}: {e}")
                return None

# Converts name of a service into a safe filename
def sanitize_filename(name):
    # Replace unsafe characters with underscores
    clean_name = re.sub(r'[\\/*?:"<>|]', "_", name)
    # Remove whitespace and replace with underscores
    clean_name = clean_name.replace(" ", "_")
    return clean_name

# --- MAIN ---

if __name__ == "__main__":
    print(f"--- Privacy/ToS Crawler & CSS-Selector Extractor (LLM) ---")

# Determine script location and create output directory
script_dir = os.path.dirname(os.path.abspath(__file__))

output_dir = os.path.join(script_dir, "declarations")
os.makedirs(output_dir, exist_ok=True)
print(f"Ergebnisse werden im Verzeichnis {output_dir} abelegt.")

# Choose best available LLM
print("Suche nach verfügbaren LLMs...")
model_name = get_model()

# 1. Dateinamen bestimmen
# sys.argv = Liste der Argumente
# Index 0 = Name des Skripts, Index 1 = Erstes Argument (falls vorhanden)
if len(sys.argv) > 1:
    dateiname = sys.argv[1]
    print(f"Dateipfad erkannt. Nutze Datei: {dateiname}")
else:
    # Fallback, wenn beim Starten nichts angegeben wurde
    dateiname = os.path.join(script_dir, "urls.txt")
    print(f"Kein Argument. Nutze Default: {dateiname}")

# 2. Datei einlesen
try:
    # 'with open' öffnet Datei und schließt sie automatisch wieder, wenn Block vorbei
    with open(dateiname, "r", encoding="utf-8") as file:
        
        # List Comprehension (Kurzform für eine Schleife):
        # - line.strip(): Entfernt Zeilenumbrüche (\n) und Leerzeichen am Anfang/Ende
        # - if line.strip(): leere Zeilen ignorieren
        url_liste = [line.strip() for line in file if line.strip()]

    print(f"Erfolgreich eingelesen: {len(url_liste)} URLs.")
except FileNotFoundError:
    # falls Datei nicht existiert
    print(f"Fehler: Die Datei '{dateiname}' wurde nicht gefunden!")
    sys.exit(1) # Beendet Programm sauber mit Fehlercode
    

# durch jede URL in Liste iterieren

final_output = []

for raw_url in url_liste:
    
    # whitespace entfernen
    url = raw_url.strip()
    # checken ob http oder https am anfang steht
    # falls nicht, https davor kleben
    if not url.startswith("http"):
        url = f"https://{url}"
    
    print(f"\n--- Bearbeite: {url} ---")

    # Seite nach Namen und Links zu potentiellen ToS/Privacy Policies durchsuchen
    name, links = find_links(url)

    # Wenn die Seite nicht gefunden wurde/nicht geladen werden konnte, überspringen wir die aktuelle Seite
    if name is None:
        print("  ! Überspringe: Seite konnte nicht geladen werden")

    # Wenn die Seite geladen wurde aber keine links gefunden wurden, überspringe die aktuelle Seite
    if not links:
        print("  ! Überspringe. Keine Links mit Keywords gefunden.")
        continue

    # Ergebnis für spätere Verarbeitung zwischenspeichern
    url_result = {
        "name": name,
        "terms": {}
    }

    # jedes Dokument einzeln an LLM verschicken und Ergebnis formatieren
    for doc_type, doc_url in links.items():
        llm_result = analyse_selectors(doc_url, doc_type, model_name)

        # vorgegebene Felder befüllen
        if llm_result:
            # print(llm_result)
            term_data = {
                    "fetch": doc_url,
                    "select": llm_result.get("select"),
                }

            # remove nur hinzunehmen wenn tatsächlich etwas zu entfernen ist (leere listen und strings sind falsy in python)
            remove_value = llm_result.get("remove")
            if remove_value:
                term_data["remove"] = remove_value

            # Und am Ende zum Ergebnis hinzufügen
            url_result["terms"][doc_type] = term_data

    if url_result["terms"]:
        safe_name = sanitize_filename(name)
        filename = f"{safe_name}.json"
        file_path = os.path.join(output_dir, filename)

        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(url_result, f, indent=2)
            print(f"    -> Declaration gespeichert unter: declarations/{filename}")
        except Exception as e:
            print(f"    ! Fehler beim Speichern der Datei {filename}: {e}")

    # Ergebnis für diese URL ausgeben
    print("Generierte Declaration:")
    print(json.dumps(url_result, indent=2))
    # Ergebnis an Sammlung übergeben
    final_output.append(url_result)

    # Kurze Pause aus Höflichkeit
    time.sleep(1)

print(f"Analyse abgeschlossen. Ergebnisse abgelegt in {output_dir}")
