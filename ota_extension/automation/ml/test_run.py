import os
import sys
import re
from bs4 import BeautifulSoup

# --- Helper Imports ---
import helpers.crawler as crawler
import helpers.feature_analysis as fa
import helpers.inspect_df as inspect
import helpers.analyse_with_model as model

# --- Main Testing ---

script_dir = os.path.dirname(os.path.abspath(__file__))

if __name__ == "__main__":
    print(f"--- Feature Extraction Analysis ---")

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
    name, links = crawler.find_links(url)

    # Wenn die Seite nicht gefunden wurde/nicht geladen werden konnte, überspringen wir die aktuelle Seite
    if name is None:
        print("  ! Überspringe: Seite konnte nicht geladen werden")

    # Wenn die Seite geladen wurde aber keine links gefunden wurden, überspringe die aktuelle Seite
    if not links:
        print("  ! Überspringe. Keine Links mit Keywords gefunden.")
        continue
    
    for doc_type, doc_url in links.items():
        # Run our workflow fetch -> clean -> feature extraction -> diagnosis for every url that we found branching of off the target url
        print(f"  {doc_url} durchläuft workflow")
        soup = crawler.fetch_and_clean(doc_url)

        if soup is None:
            print("  ! Überspringe: Seite konnte nicht geladen werden")
            continue

        try:
            df = model.extract_score_candidates(soup)
            if not df.empty:
                inspect.inspect_top_candidates(df, n=3)
            else:
                print("  ! Keine Kandidaten gefunden.")
                    
        except Exception as e:
            print(f"  ! Fehler bei der Analyse: {e}")
    
