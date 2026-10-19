import re

with open(r'd:\Github projects\aktu-notes-store\raw_data\under.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines mentioning paper click / download / link logic:")
for i, line in enumerate(lines):
    if any(k in line for k in ['openPaper', 'downloadPaper', 'getPaperUrl', 'raw_paper', 'RAW_PAPERS', 'pdf', 'blob', 'cdn', 'aktu']):
        if 20 < len(line.strip()) < 200:
            print(f"Line {i+1}: {line.strip()}")
