with open(r'd:\Github projects\aktu-notes-store\raw_data\under.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1300, 1350):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')
