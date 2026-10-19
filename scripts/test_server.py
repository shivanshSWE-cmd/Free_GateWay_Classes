import urllib.request
import json

base = 'http://localhost:3000'

tests = [
    ('/api/health', 'Health Check'),
    ('/api/portals', 'Portals API'),
    ('/api/notes/1year', '1st Year Notes API'),
    ('/api/notes/2ndyear', '2nd Year Notes API'),
    ('/api/lectures', 'Lectures API'),
    ('/api/pyq?sem=1&limit=3', 'PYQ Filter API'),
    ('/api/search?q=machine+learning&limit=3', 'Global Search API'),
    ('/pyq-download/18692/fa1ad34acd?code=BAS101&title=Engineering_Physics', 'PDF Proxy & Stream'),
    ('/', 'Landing Page'),
    ('/1year', '1st Year Page'),
    ('/under', 'PYQ Bank Page'),
    ('/viewer.html?id=18692&code=BAS101&title=Engineering_Physics', 'Viewer Page')
]

print("Running API and Frontend verification suite:\n" + "="*50)
for path, desc in tests:
    url = base + path
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'TestRunner/1.0'})
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            c_type = resp.headers.get('Content-Type')
            print(f"PASS: {desc:24} -> [{resp.status}] ({len(data)} bytes, {c_type})")
            if 'api' in path and 'json' in str(c_type):
                parsed = json.loads(data.decode('utf-8'))
                if 'total' in parsed:
                    print(f"      Items returned/total: {parsed.get('total')}")
                elif 'results' in parsed:
                    print(f"      Search count: {parsed.get('count')}, sample: {parsed['results'][0]['title']}")
    except Exception as e:
        print(f"FAIL: {desc:24} -> ERROR: {e}")

print("="*50 + "\nVerification complete!")
