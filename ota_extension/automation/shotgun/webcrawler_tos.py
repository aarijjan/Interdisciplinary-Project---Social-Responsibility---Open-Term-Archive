import requests
import sys
from bs4 import BeautifulSoup
import re
import csv # Neu dazu für den Export

# --- HILFSFUNKTION: Status prüfen ---
def check_status(link, headers):
    # Wenn wir gar keinen Link haben, brauchen wir nicht prüfen
    if link == "Nicht gefunden" or link is None:
        return "n/a"
    
    try:
        # Kurzer Timeout (5 sek), damit wir nicht ewig warten
        r = requests.get(link, headers=headers, timeout=5)
        return r.status_code
    except requests.exceptions.RequestException:
        return "Fehler"

# --- DEFINITION DER SUCHBEGRIFFE ---
         
# Wörter für Link-Text 
# alles klein schreiben, da mit .lower() umwandeln
keywords_privacy = [
    "datenschutz", 
    "privacy policy", 
    "privacy statement", 
    "privacy notice",
    "data protection", 
    "privatsphäre", 
    "datenschutzerklärung"
]

keywords_tos = [
    "allgemeine geschäftsbedingungen", 
    "agb",
    "terms of service", 
    "terms of use", 
    "terms and conditions", 
    "nutzungsbedingungen", 
    "user agreement"
]


# 1. Dateinamen bestimmen
# sys.argv = Liste der Argumente
# Index 0 = Name des Skripts, Index 1 = Erstes Argument (falls vorhanden)
if len(sys.argv) > 1:
    dateiname = sys.argv[1]
    print(f"Dateipfad erkannt. Nutze Datei: {dateiname}")
else:
    # Fallback, wenn beim Starten nichts angegeben wurde
    dateiname = "urls.txt"
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
    

# --- Globale Liste zum Speichern der Ergebnisse ---
results = []


# durch jede URL in Liste iterieren
for raw_url in url_liste:
    
    # whitespace entfernen
    url = raw_url.strip()
    # checken ob http oder https am anfang steht
    # falls nicht, https davor kleben
    if not url.startswith("http"):
        url = f"https://{url}"
    
    print(f"\n--- Bearbeite: {url} ---")

    # Tarnung als Browser, um Bot-Blocker zu umgehen
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Referer": "https://www.google.com/",
        "DNT": "1", # Do Not Track
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    }
    
    # Platzhalter für Ergebnisse dieses Durchlaufs
    link_privacy = "Nicht gefunden"
    link_tos = "Nicht gefunden"

    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("Status: OK (200)")
            
            html_code = response.text # HTML als Text speichern, für bf4
            
            # BS4-Objekt erstellen/Suppe kochen
            soup = BeautifulSoup(html_code, "lxml")
            
            # Temporäre Variablen für die Suche
            found_privacy = None
            found_tos = None

            all_links = soup.find_all("a")

            for link in all_links:
                link_text = link.get_text(strip=True).lower()
                href = link.get("href") # Href sicherheitshalber holen
                
                # check auf text, weiter falls z.B. bild
                if not link_text or not href:
                    continue
                
                # 1. Privacy Check
                if found_privacy is None:
                    for kw in keywords_privacy:
                        if re.search(rf"\b{re.escape(kw)}\b", link_text):
                            found_privacy = href
                            # Fix für relative Links (z.B. /datenschutz)
                            if not found_privacy.startswith("http"):
                                found_privacy = url.rstrip("/") + "/" + found_privacy.lstrip("/")
                            print(f"--> Treffer für Privacy Policy: {link_text}:   {found_privacy}")
                            break
                
                # 2. ToS Check       
                if found_tos is None:
                    for kw in keywords_tos:
                        if re.search(rf"\b{re.escape(kw)}\b", link_text):
                            found_tos = href
                            # Fix für relative Links
                            if not found_tos.startswith("http"):
                                found_tos = url.rstrip("/") + "/" + found_tos.lstrip("/")
                            print(f"--> Treffer ToS: '{link_text}'")
                            break
                    
                if found_privacy and found_tos:
                    break
            
            # Wenn wir was gefunden haben, speichern wir es in die Hauptvariablen
            if found_privacy:
                link_privacy = found_privacy
            if found_tos:
                link_tos = found_tos

            print("-" * 20)
            print(f"Ergebnis für: {raw_url}:")
            print(f"Privacy Link: {link_privacy}")
            print(f"ToS Link: {link_tos}")
            
        else:
            print(f"Fehlercode: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"Verbindungsfehler: {e}")
        
    # --- Links überprüfen ---
    print("... überprüfe Link-Status ...")
    
    status_privacy = check_status(link_privacy, headers)
    status_tos = check_status(link_tos, headers)
    
    print(f"   Status Privacy: {status_privacy}")
    print(f"   Status ToS:     {status_tos}")
        
    # --- Ergebnis an die globale Liste hängen ---
    entry = {
        "Website": raw_url,
        "Privacy_Link": link_privacy,
        "Privacy_Status": status_privacy,
        "ToS_Link": link_tos,
        "ToS_Status": status_tos
    }
    results.append(entry)

# --- in CSV speichern ---
output_filename = "results_links.csv"
try:
    with open(output_filename, "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["Website", "Privacy_Link", "Privacy_Status", "ToS_Link", "ToS_Status"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter=";")
        writer.writeheader()
        for row in results:
            writer.writerow(row)
    print(f"\nDatei gespeichert unter: {output_filename}")
except Exception as e:
    print(f"Fehler beim Speichern: {e}")
    
    
