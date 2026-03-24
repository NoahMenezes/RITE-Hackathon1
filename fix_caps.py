import os
import re

def title_case(match):
    word = match.group(0)
    # Exclude HTML/React tags
    if word in ['FAQ', 'API', 'UI', 'UX', 'HTTP', 'HTTPS', 'JSON', 'FFBE']:
        return word
    # Only if the string has multiple words or is part of regular text
    return word.capitalize()

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # regex to match sequences of ALL CAPS words
    def replace_all_caps(match):
        text = match.group(0)
        # return text converted to title case
        words = text.split()
        return ' '.join(w.capitalize() for w in words)

    # Match text between > and <
    def replace_in_tags(match):
        inner_text = match.group(1)
        # Apply title case to words that are ALL CAPS
        new_text = re.sub(r'\b[A-Z]{2,}\b', title_case, inner_text)
        return f'>{new_text}<'

    content = re.sub(r'>([^<]+)<', replace_in_tags, content)
    
    # Also fix buttons/links like "GET STARTED NOW" in JSX attributes or quotes if needed, 
    # but most text is between > and <.

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('./app'):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            fix_file(os.path.join(root, file))

