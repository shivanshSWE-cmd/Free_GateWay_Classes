import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

raw_dir = r'd:\Github projects\aktu-notes-store\raw_data'

def inspect_var(filename, varname):
    with open(f"{raw_dir}\\{filename}", 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    pattern = rf'(?:const|let|var)\s+{varname}\s*=\s*'
    m = re.search(pattern, content)
    if m:
        start = m.end()
        print(f"=== {filename} : {varname} ===")
        print(content[start:start+400])
        print("...")
    else:
        print(f"Variable {varname} not found in {filename}")

inspect_var('1year.html', 'subjectMeta')
inspect_var('2ndyear.html', 'subjectMeta')
inspect_var('2ndyear.html', 'data')
inspect_var('3year.html', 'subjectsData')
inspect_var('multiatom.html', 'subjectsData')
inspect_var('3year-multiatom.html', 'subjectsData')
inspect_var('lectindex.html', 'videoData')
