import csv
import json
import os

# --- KONFIGURATION ---

INPUT_FILENAME = "results_css_selectors.csv"
OUTPUT_FOLDER = "declarations_to_check"


# --- HELPER: CSV-String in Liste umwandeln ---
def parse_remove_string(remove_str):
    """
    Macht aus 'nav, footer, .cookie' eine Liste ['nav', 'footer', '.cookie']
    """
    if not remove_str:
        return []
    return [s.strip() for s in remove_str.split(',') if s.strip()]


# --- FUNKTION 1: JSON Struktur dynamisch bauen ---
def create_declaration(row):
    site_name = row.get("Website", "Unknown")
    
    # Temporäres Dictionary für die Terms
    terms_content = {}
    
    # -------------------------------------------------------
    # 1. PRÜFUNG: ToS
    # -------------------------------------------------------
    raw_tos_sel = row.get("ToS_Selector")
    tos_link = row.get("ToS_Link")
    
    # Nur weitermachen, wenn Link existiert
    if tos_link and raw_tos_sel:
        
        # Fall A: Es ist ein PDF (Erkannt durch Marker ::PDF::)
        if raw_tos_sel == "::PDF::":
            # WICHTIG: Kein 'select' und kein 'remove' bei PDFs!
            # Das OTA Schema verbietet leere Strings bei 'select'.
            terms_content["Terms of Service"] = {
                "fetch": tos_link
            }
            
        # Fall B: Es ist HTML Content (Valider Selektor)
        elif len(raw_tos_sel) > 1 and "TODO" not in raw_tos_sel:
            tos_remove_raw = row.get("ToS_Remove", "")
            tos_remove_list = parse_remove_string(tos_remove_raw)
            
            terms_content["Terms of Service"] = {
                "fetch": tos_link,
                "select": raw_tos_sel,
                "remove": tos_remove_list
            }

    # -------------------------------------------------------
    # 2. PRÜFUNG: Privacy
    # -------------------------------------------------------
    raw_privacy_sel = row.get("Privacy_Selector")
    privacy_link = row.get("Privacy_Link")
    
    if privacy_link and raw_privacy_sel:
        
        # Fall A: PDF
        if raw_privacy_sel == "::PDF::":
            # WICHTIG: Kein 'select' und kein 'remove' bei PDFs!
            terms_content["Privacy Policy"] = {
                "fetch": privacy_link
            }
            
        # Fall B: HTML
        elif len(raw_privacy_sel) > 1 and "TODO" not in raw_privacy_sel:
            privacy_remove_raw = row.get("Privacy_Remove", "")
            privacy_remove_list = parse_remove_string(privacy_remove_raw)
            
            terms_content["Privacy Policy"] = {
                "fetch": privacy_link,
                "select": raw_privacy_sel,
                "remove": privacy_remove_list
            }
    
    # -------------------------------------------------------
    # 3. ENTSCHEIDUNG: War irgendwas dabei?
    # -------------------------------------------------------
    if not terms_content:
        return None

    # Wenn wir hier sind, haben wir mindestens einen Eintrag
    declaration = {
      "name": site_name,
      "terms": terms_content
    }
    
    return declaration


# --- FUNKTION 2: Speichern ---
def save_json(data):
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    
    # 1. Basis-Bereinigung des Namens
    clean_name = data["name"]
    for prefix in ["https://", "http://", "www."]:
        clean_name = clean_name.replace(prefix, "")
    
    clean_name = clean_name.strip("/")
    
    # 2. TLD entfernen
    if "." in clean_name:
        clean_name = clean_name.rsplit(".", 1)[0]
    
    # 3. Erster Buchstabe groß
    clean_name = clean_name.capitalize()
    
    filepath = os.path.join(OUTPUT_FOLDER, f"{clean_name}.json")
    
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"OK: {filepath}")
    except Exception as e:
        print(f"FEHLER bei {filepath}: {e}")


# --- HAUPTPROGRAMM ---

try:
    print(f"Lese Datei: {INPUT_FILENAME}")
    
    with open(INPUT_FILENAME, "r", encoding="utf-8") as infile:
        reader = csv.DictReader(infile, delimiter=";")
        
        saved_count = 0
        skipped_count = 0
        
        for row in reader:
            decl_data = create_declaration(row)
            
            if decl_data is not None:
                save_json(decl_data)
                saved_count += 1
            else:
                skipped_count += 1
            
    print("\n" + "-"*30)
    print(f"Fertig")
    print(f"Gespeichert: {saved_count}")
    print(f"Übersprungen: {skipped_count}")

except FileNotFoundError:
    print(f"FEHLER: Die Datei '{INPUT_FILENAME}' existiert nicht")