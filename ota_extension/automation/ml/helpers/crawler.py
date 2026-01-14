import re
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

# --- CONFIGURATION ---

# keywords for link following targeting privacy policies
keywords_privacy = [
    "datenschutz", "privacy policy", "privacy statement", 
    "privacy notice", "data protection", "privatsphäre", 
    "datenschutzerklärung"
]

# keywords for link following targeting tos
keywords_tos = [
    "allgemeine geschäftsbedingungen", "agb", "terms of service", 
    "terms of use", "terms and conditions", "nutzungsbedingungen", 
    "user agreement"
]

# blocklist for common homepage titles not containing the service name
blocklist = ["startseite", "home", "homepage", "willkommen", "index", "log in", "sign up", "welcome"]

# --- HELPERS ---

# Check a supplied text for our keywords defined above
def check_keywords(text, keyword_list):
    for kw in keyword_list:
        if re.search(rf"\b{re.escape(kw)}\b", text):
            return True
    return False

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

# Get full html page content with a simple fetch
def fetch_content(url):
    try:
        # Set user agent to avoid being shut out as a bot
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response
    except Exception as e:
        print(f"  ! Fehler beim Zugriff auf {url}: {e}")
        return None

# Fetch an URL and return a cleaned bs4 soup without script/svg etc.
def fetch_and_clean(url):
    try:
        # Set user agent to avoid being shut out as a bot
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Remove tags that are likely noise.
        for noise in soup(["script", "style", "noscript", "meta", "head", "svg", "form", "link"]):
            noise.decompose()

        # Return the cleaned html as a bs4 soup object
        return soup

    except Exception as e:
        print(f"Fehler bei Zugriff {url}: {e}")
        return None

# Crawls the base url to find the service name of the site and links to tos/privacy policies
def find_links(base_url):

    print(f"  Suche nach links auf {base_url}")
    
    # We fetch the raw HTML ourselves, b/c we need base_url for name extraction
    response = fetch_content(base_url)
    if not response:
        return None, None

    soup = BeautifulSoup(response.content, "html.parser")

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