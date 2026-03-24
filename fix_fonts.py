import os
import re

size_map = {
    'text-9xl': 'text-6xl',
    'text-8xl': 'text-5xl',
    'text-7xl': 'text-4xl',
    'text-6xl': 'text-3xl',
    'text-5xl': 'text-2xl',
    'text-4xl': 'text-xl',
    'text-3xl': 'text-lg',
    'text-2xl': 'text-base',
    'text-xl': 'text-sm',
    'text-lg': 'text-sm',
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Use regex with a callback to avoid cascading replacements
    def replacer(match):
        return size_map[match.group(0)]
    
    pattern = re.compile(r'\b(?:' + '|'.join(size_map.keys()) + r')\b')
    content = pattern.sub(replacer, content)
    
    # Remove uppercase
    content = re.sub(r'\buppercase\b', '', content)
    content = re.sub(r'\btracking-(?:widest|tightest|tighter|tight|wide)\b', '', content)
    
    # Clean up double spaces in class names
    def clean_spaces(match):
        return 'className="' + ' '.join(match.group(1).split()) + '"'
    
    content = re.sub(r'className="([^"]+)"', clean_spaces, content)

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

