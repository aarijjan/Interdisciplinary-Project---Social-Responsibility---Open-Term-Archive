import os
import sys
import json
import re
import time
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import pandas as pd

# --- Import helpers ---
import helpers.crawler as crawler
import helpers.analyse_with_model as model

# --- Config ---
script_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(script_dir, "declarations")
os.makedirs(output_dir, exist_ok=True)

# Take the winning node from the ML classifier and build a css selector with it
def generate_robust_selector(node):
    # By ID
    if node.get("id"):
        return f"#{node.get('id')}"

    # By Class
    if node.get("class"):
        # Filter out generic layout classes that might change or exist multiple times
        ignored_classes = ["row", "container", "wrapper", "col", "col-12", "content-wrapper"]
        
        valid_classes = [c for c in node.get("class") if c not in ignored_classes]
        
        if valid_classes:
            # Pick the longest class name (hopefully the most specific)
            best_class = max(valid_classes, key=len)
            return f".{best_class}"

    #Fallback: Parent ID + Child Tag ("#layout > div")
    parent = node.find_parent()
    if parent and parent.get("id"):
        return f"#{parent.get('id')} > {node.name}"

    #Last Resort: Just the tag name
    return node.name

def sanitize_filename(name):
    # Clean string for filesystem
    clean = re.sub(r'[\\/*?:"<>|]', "_", name)
    return clean.replace(" ", "_")

# --- Main Loop ---

def run():

    if __name__ == "__main__":
        print(f"--- Privacy/ToS Crawler & CSS-Selector Extractor (ML) ---")
    
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

        # Ergebnis für spätere Verarbeitung zwischenspeichern
        url_result = {
            "name": name,
            "terms": {}
        }
        

        # Analysiere jedes Dokument einzeln
        for doc_type, doc_url in links.items():

            # URL auf pdf Endung prüfen
            # urlparse kann bspw. ".../agb.pdf?version=1"  trotz query parameter erkennen
            path = urlparse(doc_url).path.lower()
            
            if path.endswith(".pdf"):
                print(f"  ...PDF erkannt: {doc_type}")
                print(f"     -> Speichere URL, überspringe Analyse.")
                
                # Als pdf declaration abspeichern
                url_result["terms"][doc_type] = {
                    "fetch": doc_url
                }
                # Überspringe den ML-Classifier
                continue

            print(f"  ...Analysiere {doc_type}: {doc_url}")
            
            # fetch und clean der url
            soup = crawler.fetch_and_clean(doc_url)
            if not soup: 
                continue

            # Feature Extract mit dem trainierten Modell durchführen
            df = model.extract_score_candidates(soup)
            
            if df.empty:
                print("    ! Keine Kandidaten gefunden.")
                continue

            # CSS selector mit dem höchsten Score auswählen
            sort_col = 'ml_score' if 'ml_score' in df.columns else 'rough_score'
            
            try:
                # Absteigend sortieren und erste Reihe auswählen
                winner_row = df.sort_values(by=sort_col, ascending=False).iloc[0]
                winner_node = winner_row['bs4_node']
                score = winner_row[sort_col]
                
                # Aus dem ersten Hit den Selector generieren
                selector = generate_robust_selector(winner_node)
                
                print(f"    -> Höchster Rang: <{winner_node.name}> (Score: {score:.2f})")
                print(f"    -> Selector: {selector}")
                
                # Am Ende dem Ergebnis hinzufügen
                url_result["terms"][doc_type] = {
                    "fetch": doc_url,
                    "select": selector
                }
            except Exception as e:
                print(f"    ! Fehler bei der Auswahl des Gewinners: {e}")

        # Das ganze als Declaration abspeicern
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
        
        final_output.append(url_result)

        # Sleeptime um Anfragen/Zeit gering zu halten
        time.sleep(1)

    print(f"\nAnalyse abgeschlossen. Ergebnisse abgelegt in {output_dir}")

if __name__ == "__main__":
    run()