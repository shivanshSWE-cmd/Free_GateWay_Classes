import urllib.request
import os

raw_dir = r'd:\Github projects\aktu-notes-store\raw_data'

# Download viewer.html
v_url = 'https://getwayclassesnotes.netlify.app/viewer.html'
v_path = os.path.join(raw_dir, 'viewer.html')
req = urllib.request.Request(v_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp, open(v_path, 'wb') as f:
    f.write(resp.read())

print("viewer.html saved, size:", os.path.getsize(v_path))

# Download worker
w_url = 'https://getwayclassesnotes.netlify.app/js/pdf.worker.min.js'
w_path = os.path.join(raw_dir, 'pdf.worker.min.js')
if not os.path.exists(w_path):
    with urllib.request.urlopen(w_url) as resp, open(w_path, 'wb') as f:
        f.write(resp.read())
    print("pdf.worker.min.js saved, size:", os.path.getsize(w_path))

with open(v_path, 'r', encoding='utf-8') as f:
    v_text = f.read()

# Let's inspect where viewer.html fetches the PDF from!
for line in v_text.split('\n'):
    if any(k in line for k in ['fetch', 'proxy', 'http', 'api', 'aktu', 'download', 'pdfUrl']):
        if len(line.strip()) < 150:
            print("VIEWER:", line.strip())
