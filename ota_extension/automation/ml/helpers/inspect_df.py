# Sort candidates and print top N results
# Sorting is naive (not ML) and just for diagnosis
def inspect_top_candidates(df, n=3):

    # We want high text length, low link density.
    # A tag name that indicates main content is probably a good indicator and gives a bonus
    # Formula: Length * (1 - LinkDensity) + (TagBonus * 100)
    
    # Copy df to avoid warnings
    scored_df = df.copy()
    
    # Calculate a rough score
    # (1 - link_density) -> 0% links = 1.0 | 100% links = 0.0
    scored_df['rough_score'] = (
        scored_df['text_length'] * (1 - scored_df['link_density']) + 
        (scored_df['tag_score'] * 200) # Give a big bonus for class="content"
    )
    
    # Sort by score and show the first n results
    top_candidates = scored_df.sort_values(by='rough_score', ascending=False).head(n)
    
    print(f"\n--- TOP {n} KANDIDATEN ---\n")
    
    # Display results
    for rank, (index, row) in enumerate(top_candidates.iterrows(), 1):
        node = row['bs4_node']
        
        # Get a snippet of text as an example of the content
        preview_text = node.get_text(" ", strip=True)[:200]
        
        # Get class/id
        class_name = ".".join(node.get("class", []))
        id_name = node.get("id", "")
        tag_desc = f"{node.name}"
        if id_name: tag_desc += f"#{id_name}"
        if class_name: tag_desc += f".{class_name}"
        
        print(f"RANK {rank}: <{tag_desc}>")
        print(f"   Features: Length={row['text_length']}, LinkDensity={row['link_density']:.2f}, TagScore={row['tag_score']}")
        print(f"   Preview: \"{preview_text}...\"")
        print("-" * 60)