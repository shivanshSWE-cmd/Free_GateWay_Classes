import re
import os

public_dir = r'd:\Github projects\aktu-notes-store\public'

# 1. Update public/index.html
index_path = os.path.join(public_dir, 'index.html')
with open(index_path, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Replace metadata
html = re.sub(r'<meta\s+name=["\']author["\']\s+content=["\'][^"\']+["\']>',
              '<meta name="author" content="Shivansh (@ShivanshSWE-cmd)">', html)

html = html.replace('https://t.me/noteswalebhaiya123', 'https://github.com/ShivanshSWE-cmd')
html = html.replace('https://instagram.com/cyber_raj1', 'https://instagram.com/Shiva._SWE')
html = html.replace('https://www.instagram.com/cyber_raj1', 'https://instagram.com/Shiva._SWE')

# Replace style block in index.html with Classic Black & White
new_styles = """  <style>
    /* ============================================================
       GATEWAY CLASSES — Classic Black & White Minimalist UI
       Clean, Simple, Professional Monochrome Theme
       ============================================================ */

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    :root {
      --bg:         #000000;
      --bg2:        #0c0c0e;
      --card-bg:    #121214;
      --card-hover: #18181b;
      --accent:     #ffffff;
      --accent2:    #e4e4e7;
      --border:     rgba(255, 255, 255, 0.12);
      --border-hover: rgba(255, 255, 255, 0.35);
      --text:       #fafafa;
      --muted:      #a1a1aa;
      --font-head:  'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-body:  'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --r-card:     12px;
      --safe-b:     env(safe-area-inset-bottom, 0px);
    }

    html {
      scroll-behavior: smooth;
      -webkit-text-size-adjust: 100%;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Disable Matrix Rain */
    #matrixCanvas {
      display: none !important;
    }

    /* ── Page Shell ──────────────────────────────── */
    .page-shell {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1140px;
      margin: 0 auto;
      padding: 16px 16px 40px;
    }

    /* ── Top Nav Bar ─────────────────────────────── */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0 20px;
      border-bottom: 1px solid var(--border);
      gap: 12px;
      margin-bottom: 20px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: #18181b;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .brand-text {
      font-family: var(--font-head);
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.5px;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .brand-text span {
      display: block;
      font-size: 0.72em;
      color: #a1a1aa;
      font-weight: 500;
      letter-spacing: 1.5px;
    }

    .nav-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: 999px;
      background: #18181b;
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    /* ── Hero ────────────────────────────────────── */
    .hero {
      text-align: center;
      padding: 24px 0 20px;
      position: relative;
    }

    .hero h1 {
      font-family: var(--font-head);
      font-size: clamp(1.8rem, 6vw, 3rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 12px;
    }

    .hero-sub {
      font-size: clamp(13px, 2.5vw, 15px);
      color: var(--muted);
      max-width: 660px;
      margin: 0 auto 16px;
      line-height: 1.6;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 6px;
    }

    .stat-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 14px;
      border-radius: 6px;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.14);
      font-size: 12px;
      color: #d4d4d8;
      font-weight: 500;
      transition: all .2s ease;
    }
    .stat-chip:hover {
      border-color: rgba(255, 255, 255, 0.35);
      color: #ffffff;
    }

    /* ── Portal Grid ─────────────────────────────── */
    .portal-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      width: 100%;
      margin: 24px 0 32px;
    }

    /* ── Portal Card ─────────────────────────────── */
    .portal-card {
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--r-card);
      padding: 18px;
      text-decoration: none;
      color: var(--text);
      transition: all .2s ease;
      position: relative;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    }

    .portal-card:hover {
      background: var(--card-hover);
      border-color: var(--border-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.7);
    }
    .portal-card:active { transform: scale(.99); }

    .card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
    }

    .card-icon {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
      background: #1c1c20;
      border: 1px solid rgba(255,255,255,.14);
    }

    .card-badge {
      font-size: 11px;
      font-weight: 500;
      padding: 3px 10px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,.14);
      background: #18181b;
      color: #d4d4d8;
      white-space: nowrap;
    }

    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-title {
      font-family: var(--font-head);
      font-size: 14.5px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.2px;
      line-height: 1.35;
      margin-bottom: 6px;
    }

    .card-desc {
      font-size: 12.5px;
      color: var(--muted);
      line-height: 1.55;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,.08);
      gap: 6px;
    }

    .card-count {
      font-size: 11.5px;
      color: #a1a1aa;
      font-weight: 500;
    }

    .card-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 12px;
      border-radius: 6px;
      background: #ffffff;
      color: #000000;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      transition: all .2s ease;
    }
    .portal-card:hover .card-btn {
      background: #e4e4e7;
    }

    /* PYQ featured card */
    .c-pyq {
      grid-column: 1 / -1;
      flex-direction: row;
      gap: 18px;
      align-items: center;
      border-color: rgba(255, 255, 255, 0.2);
    }
    .c-pyq .card-top { margin-bottom: 0; }
    .c-pyq .card-body { flex: 1; }
    .c-pyq .card-footer { margin-top: 10px; padding-top: 10px; }

    /* ── Footer ─────────────────────────────────── */
    .site-footer {
      text-align: center;
      padding: 32px 0 20px;
      border-top: 1px solid rgba(255,255,255,.1);
      margin-top: 20px;
    }

    .credit-pill {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      display: inline-block;
      padding: 8px 18px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,.15);
      background: #121214;
      margin-bottom: 12px;
    }

    .social-row {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin: 10px 0 14px;
    }

    .soc-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      font-size: 1.15rem;
      color: #ffffff;
      background: #18181b;
      border: 1px solid rgba(255,255,255,.15);
      text-decoration: none;
      transition: all .2s ease;
    }
    .soc-btn:hover {
      background: #ffffff;
      color: #000000;
      transform: translateY(-2px);
    }

    .footer-creds {
      font-size: 13px;
      color: #a1a1aa;
    }
    .footer-creds a {
      color: #ffffff;
      text-decoration: none;
      font-weight: 500;
      margin: 0 4px;
    }
    .footer-creds a:hover {
      text-decoration: underline;
    }

    /* ── Responsive ──────────────────────────────── */
    @media (max-width: 680px) {
      .portal-grid { grid-template-columns: 1fr; }
      .c-pyq { flex-direction: column; align-items: stretch; }
      .c-pyq .card-top { margin-bottom: 10px; }
    }
    @media (min-width: 900px) {
      .portal-grid { grid-template-columns: repeat(3, 1fr); }
      .c-pyq { grid-column: 1 / -1; flex-direction: row; }
    }
  </style>"""

html = re.sub(r'<style>[\s\S]*?</style>', new_styles, html, count=1)

# Replace footer in index.html
new_footer = """    <footer class="site-footer">
      <div class="credit-pill">Created with ❤️ by <span style="color:#ffffff; font-weight:700;">Shivansh</span></div>

      <div class="social-row" role="list">
        <a href="https://github.com/ShivanshSWE-cmd" target="_blank" rel="noopener" class="soc-btn" title="GitHub (@ShivanshSWE-cmd)" role="listitem" aria-label="GitHub">
          <i class="fab fa-github" aria-hidden="true"></i>
        </a>
        <a href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener" class="soc-btn" title="Instagram (@Shiva._SWE)" role="listitem" aria-label="Instagram">
          <i class="fab fa-instagram" aria-hidden="true"></i>
        </a>
      </div>

      <div class="footer-creds">
        <a href="https://github.com/ShivanshSWE-cmd" target="_blank" rel="noopener"><i class="fab fa-github"></i> @ShivanshSWE-cmd</a> &bull;
        <a href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener"><i class="fab fa-instagram"></i> @Shiva._SWE</a>
      </div>
    </footer>"""

html = re.sub(r'<footer class="site-footer">[\s\S]*?</footer>', new_footer, html)

# Disable matrix canvas script
html = re.sub(r'<script>\s*\(function\s*\(\)\s*\{\s*var\s+canvas\s*=\s*document\.getElementById\(\'matrixCanvas\'\)[\s\S]*?<\/script>', '', html)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("✓ public/index.html updated successfully with Classic Black & White UI and Shivansh creator info!")
