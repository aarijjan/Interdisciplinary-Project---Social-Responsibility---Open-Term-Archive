from bs4 import BeautifulSoup, Tag
import re
import pandas as pd

# --- Config ---

# Target tags, main content is probably in one of these
targets = ['div', 'section', 'article', 'main', 'td']

# Keywords for scoring of class/id names, compile once to save on translation every time it's used, from raw string and ignore case
positives = re.compile(r"article|body|content|main|entry|post|story|text", re.I)
negatives = re.compile(r"nav|sidebar|footer|menu|combx|comment|hidden|header|ad-", re.I)

# --- Helpers ---

# Analyzes text to link ratio of a DOM node
# Long text with few links -> probably main content
# Short text with lots of links -> probably navigation
def get_text_density(node: Tag):

    # Get all text within a node (stripping whitespace)
    clean_text = node.get_text(separator=" ", strip=True)
    text_len = len(clean_text)

    # Calculate how much of that text is actually inside hyperlinks
    link_text = ""
    links = node.find_all("a")
    for link in links:
        link_text += link.get_text(strip=True)
    link_len = len(link_text)

    # From that calculate 'link density' 
    # 1.0 -> all text is links
    # 0.0 -> no links at all
    if text_len == 0:
        link_density = 1.0 # Empty nodes don't have high link density, we treat them as such to favour non-empty ones
        text_density = 0.0
    else:
        link_density = link_len / text_len

    # Extract Text density as a feature by counting all descendant tags
    num_tags = len(node.find_all(True))
    # divide text length by number of tags that text is contained in but don't divide by zero 
    text_density = text_len / max(1, num_tags)

    # Return a dictionary of the metrics
    return {
        "text_length": text_len,
        "link_count": len(links),
        "link_density": link_density,
        "text_density": text_density
    }


# Analyzes the position of the node in the DOM.
# Main content is probably neither at the top nor bottom of the DOM and contains some paragraphs for structuring
def get_structure(node: Tag):

    # Use <p> tags as a signal for main content, readable text is probably structured with paragraphs
    p_tags = len(node.find_all("p", recursive=False)) 
    

    # Root elements (depth 0-2) are probably wrappers (<html>, <body>)
    # Deep elements (depth 20+) are probably design elements/widgets
    depth = len(list(node.parents))

    # One-hot encoding for tag types that strongly imply main content
    is_article = 1 if node.name == 'article' else 0
    is_main = 1 if node.name == 'main' else 0

    return {
        "p_tag_count": p_tags,
        "dom_depth": depth,
        "tag_article": is_article,
        "tag_main": is_main
    }

# Analyzes the ID and Class name of a node to use as a hint in scoring
def get_tag_score(node: Tag):

    # Get list of classes for the node and convert them into one string, if none fallback is an empty array
    css_classes = " ".join(node.get("class", []))
    # Elements can only have one id, if none fallback is an empty string
    element_id = node.get("id", "")

    # Combine them to check in one flow
    comb_string = f"{css_classes} {element_id}"

    score = 0
    # Raise score if node class/id contains keywords likely to be main content
    if positives.search(comb_string):
        score += 5
    # Penalize score if node class/id contains keywords likely to be clutter
    if negatives.search(comb_string):
        score -= 5

    return {"tag_score": score}

# --- Extraction ---

# Parse raw html into machine readable dataframe with scored features
def extract_score_candidates(soup):

    # set up our candidates list
    candidates_data = []
    
    # Iterate over target tags
    # ignoring fragments like <span> b/c we want to find the wrapper for the whole content at once
    nodes = soup.find_all(targets)
    
    for i, node in enumerate(nodes):

        # Calculate the feature sets
        f_density = get_text_density(node)
        
        # Exit early if node has almost no text (unlikely to be main content)
        if f_density['text_length'] < 25:
            continue
            
        f_structure = get_structure(node)
        f_tag = get_tag_score(node)
        
        # Merge feature sets into a single dictionary, ** unpacks the dictionaries instead of nesting them
        features = {**f_density, **f_structure, **f_tag}
        
        # We save the actual node we looked at to extract the css selector from after classification
        features['bs4_node'] = node 
        
        candidates_data.append(features)
        
    # Return as pandas dataframe for classifier training
    return pd.DataFrame(candidates_data)