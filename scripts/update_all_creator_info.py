import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
public_dir = r'd:\Github projects\aktu-notes-store\public'

social_footer_html = """  <div class="support">
    <span>Created with ❤️ by <b>Shivansh</b></span>
    <a href="https://github.com/ShivanshSWE-cmd" target="_blank" rel="noopener">
      <i class="fab fa-github"></i> GitHub: @ShivanshSWE-cmd
    </a>
    <a href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener">
      <i class="fab fa-instagram"></i> Instagram: @Shiva._SWE
    </a>
  </div>"""

for fname in sorted(os.listdir(public_dir)):
    if not fname.endswith('.html'):
        continue
    fpath = os.path.join(public_dir, fname)
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    orig = content

    # 1. Author meta
    content = re.sub(r'<meta\s+name=["\']author["\']\s+content=["\'][^"\']+["\']>',
                     '<meta name="author" content="Shivansh (@ShivanshSWE-cmd)">', content)

    # 2. Subtitles: Maintained by Cyber Raj -> Maintained by Shivansh
    content = re.sub(r'Maintained by\s*<b>Cyber Raj</b>', 'Maintained by <b>Shivansh</b>', content, flags=re.IGNORECASE)
    content = re.sub(r'Cyber Raj', 'Shivansh', content)

    # 3. Instagram & Telegram URLs
    content = content.replace('https://t.me/noteswalebhaiya123', 'https://github.com/ShivanshSWE-cmd')
    content = content.replace('https://www.instagram.com/cyber_raj1', 'https://instagram.com/Shiva._SWE')
    content = content.replace('https://instagram.com/cyber_raj1', 'https://instagram.com/Shiva._SWE')
    content = content.replace('@noteswalebhaiya123', '@ShivanshSWE-cmd')
    content = content.replace('@cyber_raj1', '@Shiva._SWE')

    # 4. Support footer in 1year, 2ndyear, 3year, multiatom, lectindex
    content = re.sub(
        r'<div class="support">[\s\S]*?<\/div>',
        social_footer_html,
        content
    )

    # 5. 4year footer: <footer>Join our Telegram channel...</footer>
    if '<footer>Join our' in content or '<footer>Join' in content:
        content = re.sub(
            r'<footer>[\s\S]*?<\/footer>',
            '<footer>Created with ❤️ by <b>Shivansh</b> &bull; <a href="https://github.com/ShivanshSWE-cmd" target="_blank" rel="noopener"><i class="fab fa-github"></i> @ShivanshSWE-cmd</a> &bull; <a href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener"><i class="fab fa-instagram"></i> @Shiva._SWE</a></footer>',
            content
        )

    # 6. Ensure FontAwesome is linked for github & instagram icons if missing
    if 'fa-github' in content and 'font-awesome' not in content:
        content = content.replace(
            '</head>',
            '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">\n</head>'
        )

    if content != orig:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated creator info in {fname}")
    else:
        print(f"No changes needed in {fname}")

# Also update README.md
readme_path = r'd:\Github projects\aktu-notes-store\README.md'
if os.path.exists(readme_path):
    with open(readme_path, 'r', encoding='utf-8', errors='ignore') as f:
        r_content = f.read()

    r_content = r_content.replace('Cyber Raj (@noteswalebhaiya123)', 'Shivansh (@ShivanshSWE-cmd, Instagram: @Shiva._SWE)')
    r_content = r_content.replace('@noteswalebhaiya123', '@ShivanshSWE-cmd')
    r_content = r_content.replace('https://t.me/noteswalebhaiya123', 'https://github.com/ShivanshSWE-cmd')
    r_content = r_content.replace('https://instagram.com/cyber_raj1', 'https://instagram.com/Shiva._SWE')

    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(r_content)
    print("Updated README.md")

print("All creator info successfully updated to Shivansh!")
