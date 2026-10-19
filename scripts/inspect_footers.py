import os, re, sys

sys.stdout.reconfigure(encoding='utf-8')
public_dir = r'd:\Github projects\aktu-notes-store\public'

for fname in sorted(os.listdir(public_dir)):
    if not fname.endswith('.html'): continue
    path = os.path.join(public_dir, fname)
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    footers = re.findall(r'<footer[\s\S]*?</footer>', content)
    if footers:
        print(f"=== {fname} Footer ({len(footers)}) ===")
        for ft in footers:
            print(ft[:250].strip())
            print("...")
