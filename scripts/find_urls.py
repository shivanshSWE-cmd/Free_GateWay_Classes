import re

with open(r'd:\Github projects\aktu-notes-store\raw_data\under.html', 'r', encoding='utf-8') as f:
    u_text = f.read()

with open(r'd:\Github projects\aktu-notes-store\raw_data\viewer.html', 'r', encoding='utf-8') as f:
    v_text = f.read()

urls = set(re.findall(r'https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s"\'<>]*', u_text + v_text))
for u in sorted(urls):
    if not any(k in u for k in ['schema.org', 'google', 'cloudflare', 'w3.org', 'flaticon', 'ibb.co', 'telegram', 'instagram', 'hitwebcounter']):
        print(u)
