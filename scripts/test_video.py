import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

tests = [
    ('/api/lectures', 'Lectures API'),
    ('/lectindex', 'Video Hub Page'),
    ('/api/search?q=DAA&limit=3', 'Search DAA'),
    ('/api/search?q=AH+Tutorials&limit=3', 'Search AH Tutorials'),
    ('/api/search?q=MultiAtoms+Physics&limit=3', 'Search MultiAtoms Physics')
]

for path, desc in tests:
    url = 'http://localhost:3000' + path
    try:
        with urllib.request.urlopen(url) as resp:
            data = resp.read()
            print(f"PASS: {desc:24} -> [{resp.status}] ({len(data)} bytes)")
            if 'api' in path:
                parsed = json.loads(data.decode('utf-8'))
                if 'courses' in parsed:
                    print(f"      Courses loaded: {len(parsed['courses'])}")
                elif 'results' in parsed and parsed.get('results'):
                    print(f"      Matches: {parsed['count']}, top: {parsed['results'][0]['title']}")
    except Exception as e:
        print(f"FAIL: {desc:24} -> Error: {e}")
