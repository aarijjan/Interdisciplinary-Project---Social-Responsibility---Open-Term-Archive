import os
import json
import pandas as pd
from bs4 import BeautifulSoup
import crawler
import feature_analysis as fa

# --- Config ---
declarations_dir = "../declarations"
training_data_file = "training_data.csv"

def import_data():
    # Initialize Dataset if it already exists, otherwise create a new frame
    if os.path.exists(training_data_file):
        dataset = pd.read_csv(training_data_file)
    else:
        dataset = pd.DataFrame()

    # Find all json files, ignore history files b/c they contain deprecated information
    files = [
        f for f in os.listdir(declarations_dir) #pythonic way of doing list comprehension
        if f.endswith(".json") and not f.endswith(".history.json")
    ] 
    print(f"Konvertiere {len(files)} Deklarationen zu training data.")

    for filename in files:
        filepath = os.path.join(declarations_dir, filename)
        
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Iterate through doc types (ToS, Privacy, etc.) inside the json, skip if none
        if "terms" not in data: continue
        
        for doc_type, content in data["terms"].items():
            url = content.get("fetch")
            raw_selector = content.get("select")

            if not url or not raw_selector: continue

            # Normalize "selector" to a list, later try the list of selectors
            if isinstance(raw_selector, str):
                selectors = [raw_selector]
            elif isinstance(raw_selector, list):
                selectors = raw_selector
            else:
                continue # Skip if it's some other weird type

            print(f"\nVerarbeite {filename} -> {doc_type}...")
            
            # Fetch the live page to check for changes since the declaration was made
            # Updates to declarations can be infrequent b/c of volunteer run repositories
            soup = crawler.fetch_and_clean(url)
            if not soup: 
                print("  ! Seite konnte nicht geladen werden.")
                continue

            # Try to find all "select" selectors from the file on the page one by one
            true_node = None
            for selector in selectors:
                try:
                    candidate = soup.select_one(selector)
                    if candidate:
                        true_node = candidate
                        print(f"  -> Selektor gefunden: {selector}")
                        break # Stop looking if we found it
                except Exception as e:
                    print(f"  ! Ungültiger Selektor '{selector}': {e}")
            
            # Skip if not found
            if not true_node:
                print(f"  ! Keine Treffer für Selektoren: {selectors}. Deklaration veraltet?")
                continue
            
            # Extract features for all candidates - including wrong ones for negative samples
            df = fa.extract_score_candidates(soup)
            if df.empty: continue

            # Label the training data
            # We can match them by reference since the actual node is stored in the df as 'bs4_node'
            
            labeled_count = 0
            new_rows = []

            for index, row in df.iterrows():
                candidate = row['bs4_node']
                
                # Copy features without the raw node object so we don't inflate the csv
                training_row = row.drop('bs4_node').to_dict()

                # Check if this candidate is the same object as the true_node?
                if candidate == true_node:
                    training_row['is_content'] = 1
                    labeled_count += 1
                    print("  -> Selektor wird in Trainingsdaten übernommen!")
                else:
                    training_row['is_content'] = 0
                
                new_rows.append(training_row)

            # If the positive sample is not in our candidates list, the filter in feature_analysis parsed it out.
            # In that case we skip the content of the file enirely, because we don't want negative samples without a positive to compare it to.
            if labeled_count > 0:
                dataset = pd.concat([dataset, pd.DataFrame(new_rows)], ignore_index=True)
                dataset.to_csv(training_data_file, index=False)
                print(f"  -> {len(new_rows)} Datenpunkte gespeichert.")
            else:
                print("  ! Kein positiver Kandidat enthalten. Filter justieren?  ")

if __name__ == "__main__":
    import_data()