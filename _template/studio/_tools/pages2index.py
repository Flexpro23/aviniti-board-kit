# Parse PAGES.md into the screens of Boards/index.json. Run after any PAGES.md change.
# Board metadata (id, file, src, name, nameAr, short, blurb, icon, status) stays as it is in index.json; only "screens" is
# rebuilt, for every board that has a "## <id> · …" section in PAGES.md. Screen line format:
#   - **1.2 · Name · الاسم · v1 · desktop [P]** — …      ([P] adds the phone variant <id>p)
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _index import PROJECT, load_index
os.chdir(PROJECT)
data = load_index(); boards = data['boards']
if not os.path.exists('PAGES.md'): sys.exit('PAGES.md not found in ' + PROJECT + ' (write the page inventory first)')
s = open('PAGES.md', encoding='utf-8').read()
parts = re.split(r'^## (B\d+)\b', s, flags=re.M)
seen = []
for i in range(1, len(parts), 2):
    bid, body = parts[i], parts[i + 1]
    b = next((x for x in boards if x['id'] == bid), None)
    if not b: sys.exit(f'PAGES.md has a section for {bid} but Boards/index.json has no such board')
    b['screens'] = []; seen.append(bid)
    for m in re.finditer(r'^- \*\*(\d+\.\d+) · (.+?) · (.+?) · (v\d) · (desktop|phone|tablet)( \[P\])?\*\*', body, flags=re.M):
        sid, en, ar, v, dev, p = m.groups()
        b['screens'].append({'id': sid, 'name': en, 'nameAr': ar, 'v': v, 'device': dev})
        if p: b['screens'].append({'id': sid + 'p', 'name': en + ' · phone', 'nameAr': ar, 'v': v, 'device': 'phone'})
with open('Boards/index.json', 'w', encoding='utf-8') as f: json.dump(data, f, ensure_ascii=False, indent=1); f.write('\n')
for b in boards: print(b['id'], len(b.get('screens', [])), 'screens', '(from PAGES.md)' if b['id'] in seen else '(kept)', ' '.join(f"{d} {sum(1 for x in b.get('screens', []) if x['device'] == d)}" for d in ('desktop', 'tablet', 'phone')))
