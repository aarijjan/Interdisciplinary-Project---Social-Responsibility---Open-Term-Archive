import os
import re
import pickle
import pandas as pd
from bs4 import BeautifulSoup, Tag

# --- Config ---
targets = ['div', 'section', 'article', 'main', 'td']

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "..", "model_file", "model_contrib.pkl")
model_path = os.path.normpath(model_path)

print(model_path)



# Regex for heuristic scoring (Fallback)
positives = re.compile(r"article|body|content|main|entry|post|story|text", re.I)
negatives = re.compile(r"nav|sidebar|footer|menu|combx|comment|hidden|header|ad-", re.I)

# --- Model Load ---
# Unpickle the model if it exists

model = None

if os.path.exists(model_path):
    try:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        print(f"  [ML] Modell geladen: {model_path}")
    except Exception as e:
        print(f"  [ML] Fehler beim Laden des Models: {e}")
else:
    print("  [ML] Warnung: Kein Model gefunden. Fallback auf Heuristik.")


# --- Helpers ---

def get_text_density(node: Tag):
    clean_text = node.get_text(separator=" ", strip=True)
    text_len = len(clean_text)

    link_text = ""
    links = node.find_all("a")
    for link in links:
        link_text += link.get_text(strip=True)
    link_len = len(link_text)

    if text_len == 0:
        link_density = 1.0
        text_density = 0.0
    else:
        link_density = link_len / text_len
        num_tags = len(node.find_all(True))
        text_density = text_len / max(1, num_tags)

    return {
        "text_length": text_len,
        "link_count": len(links),
        "link_density": link_density,
        "text_density": text_density
    }

def get_structure(node: Tag):
    p_tags = len(node.find_all("p", recursive=False)) 
    depth = len(list(node.parents))
    
    is_article = 1 if node.name == 'article' else 0
    is_main = 1 if node.name == 'main' else 0

    return {
        "p_tag_count": p_tags,
        "dom_depth": depth,
        "tag_article": is_article,
        "tag_main": is_main
    }

def get_tag_score(node: Tag):
    css_classes = " ".join(node.get("class", []))
    element_id = node.get("id", "")
    comb_string = f"{css_classes} {element_id}"

    score = 0
    if positives.search(comb_string):
        score += 5
    if negatives.search(comb_string):
        score -= 5

    return {"tag_score": score}


# --- Main Extraction ---

def extract_score_candidates(soup):
    candidates_data = []
    
    # Scan the DOM like before
    nodes = soup.find_all(targets)
    
    for i, node in enumerate(nodes):
        f_density = get_text_density(node)
        
        # Skip (mostly) empty nodes
        if f_density['text_length'] < 25:
            continue
            
        f_structure = get_structure(node)
        f_tag = get_tag_score(node)
        
        # Combine all features into one dict, ** tells python to unpack the dicts
        features = {**f_density, **f_structure, **f_tag}
        
        # Store the actual node object (for later checking)
        features['bs4_node'] = node 
        
        candidates_data.append(features)
        
    # Create DataFrame
    df = pd.DataFrame(candidates_data)
    if df.empty: return df

    # If model is loaded, use that to predict main content
    
    if model:
        # In that case, drop the soup from the dataframe
        X = df.drop(columns=['bs4_node'])
        
        # Predict probabilities of main content (class 0 = junk, class 1 = content, class 1 is at index 1)
        # .predict_proba returns confidence scores
        try:
            df['ml_score'] = model.predict_proba(X)[:, 1]
            
            # Copy ML score to 'rough_score' so our inspect script can display it
            df['rough_score'] = df['ml_score']
            
        except Exception as e:
            print(f"  [ML] Vrohersage fehlgeschlagen: {e}")
            # Fallback to heuristic if columns don't match
            df['rough_score'] = (
                df['text_length'] * (1 - df['link_density']) + 
                (df['tag_score'] * 200)
            )
            
    else:
        # Fallback Heuristic
        df['rough_score'] = (
            df['text_length'] * (1 - df['link_density']) + 
            (df['tag_score'] * 200)
        )

    return df