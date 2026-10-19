import urllib.request

urls = [
    'https://getwayclassesnotes.netlify.app/viewer.html',
    'https://getwayclassesnotes.netlify.app/_redirects',
    'https://getwayclassesnotes.netlify.app/netlify.toml',
    'https://getwayclassesnotes.netlify.app/pyq-download/18692/fa1ad34acd',
    'https://getwayclassesnotes.netlify.app/.netlify/functions/pyq-download',
    'https://getwayclassesnotes.netlify.app/js/pdf.worker.min.js'
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            print(f"{url} -> status: {resp.status}, size: {len(data)}, type: {resp.headers.get('Content-Type')}")
            if 'redirects' in url or 'toml' in url or 'viewer' in url:
                print("Content:\n", data.decode('utf-8', errors='ignore')[:500])
    except Exception as e:
        print(f"{url} -> ERROR: {e}")
