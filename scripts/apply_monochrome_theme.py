import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
public_dir = r'd:\Github projects\aktu-notes-store\public'

# 1. Update under.html
under_path = os.path.join(public_dir, 'under.html')
with open(under_path, 'r', encoding='utf-8', errors='ignore') as f:
    under_html = f.read()

# Replace :root in under.html
under_html = re.sub(
    r':root\s*\{[\s\S]*?--card-glow:[^;]+;\s*\}',
    """:root {
      --bg-main: #000000;
      --bg-card: #121214;
      --border-card: rgba(255, 255, 255, 0.12);
      --border-hover: rgba(255, 255, 255, 0.35);
      --accent-cyan: #ffffff;
      --accent-glow: rgba(255, 255, 255, 0.15);
      --text-muted: #a1a1aa;
      --text-main: #fafafa;
      --card-glow: 0 4px 14px rgba(0, 0, 0, 0.6);
    }""",
    under_html
)

# Disable matrix canvas in under.html
under_html = under_html.replace('canvas#matrixCanvas {', 'canvas#matrixCanvas { display: none !important;')
under_html = under_html.replace("body::before {", "body::before { display: none !important;")

# Classic typography for h1 in under.html
under_html = re.sub(
    r'h1\s*\{[\s\S]*?line-height:\s*1\.25;\s*\}',
    """h1 {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: clamp(1.6rem, 4.5vw, 2.5rem);
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #ffffff;
      background: none;
      -webkit-text-fill-color: #ffffff;
      margin-bottom: 8px;
      line-height: 1.25;
    }""",
    under_html
)

# Replace active sem tab in under.html
under_html = re.sub(
    r'\.sem-tab-btn\.active\s*\{[\s\S]*?\}',
    """.sem-tab-btn.active {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      font-weight: 600;
    }""",
    under_html
)

# Replace active session chip in under.html
under_html = re.sub(
    r'\.session-chip\.active\s*\{[\s\S]*?\}',
    """.session-chip.active {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      font-weight: 600;
    }""",
    under_html
)

# Paper download button in under.html
under_html = re.sub(
    r'\.paper-download-btn\s*\{[\s\S]*?\}',
    """.paper-download-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      background: #ffffff;
      color: #000000;
      border: 1px solid #ffffff;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .paper-download-btn:hover {
      background: #e4e4e7;
      color: #000000;
    }""",
    under_html
)

# Replace Home Button in under.html
under_html = re.sub(
    r'#gwcHomeBtn\s*\{[\s\S]*?#gwcHomeBtn:hover\s*\{[\s\S]*?\}',
    """#gwcHomeBtn {
      position: fixed;
      top: 14px;
      left: 14px;
      z-index: 9999;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      background: #121214;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-weight: 600;
      font-size: 13px;
      line-height: 1;
      text-decoration: none;
      transition: 0.2s ease;
    }
    #gwcHomeBtn:hover {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      transform: translateY(-1px);
    }""",
    under_html
)

# Disable right-click blocking
under_html = under_html.replace("event.preventDefault()", "/* contextmenu enabled */")

with open(under_path, 'w', encoding='utf-8') as f:
    f.write(under_html)
print("Updated under.html with Classic Black & White UI")


# 2. Update viewer.html
viewer_path = os.path.join(public_dir, 'viewer.html')
with open(viewer_path, 'r', encoding='utf-8', errors='ignore') as f:
    v_html = f.read()

v_html = re.sub(
    r':root\s*\{[\s\S]*?--text-muted:[^;]+;\s*\}',
    """:root {
      --bg-dark: #000000;
      --bar-bg: #121214;
      --border-cyan: rgba(255, 255, 255, 0.14);
      --accent-cyan: #ffffff;
      --text-main: #fafafa;
      --text-muted: #a1a1aa;
    }""",
    v_html
)

v_html = re.sub(
    r'\.btn-download\s*\{[\s\S]*?\.btn-download:hover\s*\{[\s\S]*?\}',
    """.btn-download {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 6px;
      background: #ffffff;
      border: 1px solid #ffffff;
      color: #000000;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-download:hover {
      background: #e4e4e7;
    }""",
    v_html
)

v_html = re.sub(
    r'\.btn-back\s*\{[\s\S]*?\.btn-back:hover\s*\{[\s\S]*?\}',
    """.btn-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 6px;
      background: #18181b;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      font-size: 12.5px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-back:hover {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
    }""",
    v_html
)

# Disable right-click blocking
v_html = v_html.replace("event.preventDefault()", "/* contextmenu enabled */")

with open(viewer_path, 'w', encoding='utf-8') as f:
    f.write(v_html)
print("Updated viewer.html with Classic Black & White UI")


# 3. Update api-docs.html
api_path = os.path.join(public_dir, 'api-docs.html')
with open(api_path, 'r', encoding='utf-8', errors='ignore') as f:
    api_html = f.read()

api_html = re.sub(
    r':root\s*\{[\s\S]*?--font-mono:[^;]+;\s*\}',
    """:root {
      --bg: #000000;
      --card-bg: #121214;
      --accent: #ffffff;
      --accent2: #e4e4e7;
      --border: rgba(255, 255, 255, 0.12);
      --text: #fafafa;
      --muted: #a1a1aa;
      --font-head: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-body: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }""",
    api_html
)

# Button styling in api-docs.html
api_html = re.sub(
    r'\.btn-back\s*\{[\s\S]*?\.btn-back:hover\s*\{[\s\S]*?\}',
    """.btn-back {
      padding: 8px 16px;
      border-radius: 6px;
      background: #ffffff;
      border: 1px solid #ffffff;
      color: #000000;
      font-weight: 600;
      text-decoration: none;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .btn-back:hover {
      background: #e4e4e7;
    }""",
    api_html
)

api_html = re.sub(
    r'\.btn-try\s*\{[\s\S]*?\.btn-try:hover\s*\{[\s\S]*?\}',
    """.btn-try {
      padding: 6px 14px;
      background: #ffffff;
      border: 1px solid #ffffff;
      color: #000000;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-try:hover {
      background: #e4e4e7;
    }""",
    api_html
)

with open(api_path, 'w', encoding='utf-8') as f:
    f.write(api_html)
print("Updated api-docs.html with Classic Black & White UI")

# 4. Remove right-click blocking across ALL html files
for fname in os.listdir(public_dir):
    if not fname.endswith('.html'): continue
    fp = os.path.join(public_dir, fname)
    with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    c = c.replace("event.preventDefault()", "/* contextmenu enabled */")
    c = c.replace("e.preventDefault()", "/* contextmenu enabled */")
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print("Monochrome transformation completed across all pages!")
