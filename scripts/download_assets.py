import os
import re
import urllib.request

raw_dir = r'd:\Github projects\aktu-notes-store\raw_data'
base_url = 'https://getwayclassesnotes.netlify.app/'

external_assets = set()
for fname in os.listdir(raw_dir):
    if not fname.endswith('.html'):
        continue
    with open(os.path.join(raw_dir, fname), 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()

    # Scripts
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
    # Styles
    styles = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', html)
    for s in scripts + styles:
        if not s.startswith('http') and not s.startswith('//'):
            external_assets.add(s)

print('Discovered internal assets:', external_assets)

for asset in external_assets:
    clean_asset = asset.lstrip('/')
    url = base_url + clean_asset
    out_path = os.path.join(raw_dir, os.path.basename(clean_asset))
    if not os.path.exists(out_path):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req) as resp, open(out_path, 'wb') as f:
                f.write(resp.read())
            print(f'Downloaded {clean_asset} ({os.path.getsize(out_path)} bytes)')
        except Exception as e:
            print(f'Failed to download {clean_asset}: {e}')
    else:
        print(f'Already exists: {clean_asset} ({os.path.getsize(out_path)} bytes)')
