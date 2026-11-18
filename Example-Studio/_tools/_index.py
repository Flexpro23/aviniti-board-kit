# Shared by the _tools/*.py scripts: project root, kit root and Boards/index.json (stdlib only).
import json, os, sys
PROJECT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
def kit_root():
    d = PROJECT
    while True:
        if os.path.isdir(os.path.join(d, '_template')) and os.path.isdir(os.path.join(d, 'qa')): return d
        p = os.path.dirname(d)
        if p == d: sys.exit('kit root (a folder holding _template/ and qa/) not found above ' + PROJECT)
        d = p
def load_index():
    with open(os.path.join(PROJECT, 'Boards', 'index.json'), encoding='utf-8') as f: return json.load(f)
def boards(): return load_index().get('boards', [])
if __name__ == '__main__':
    # sh helpers: python3 _tools/_index.py kit | files | builds
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'kit': print(kit_root())
    elif cmd == 'files': print('\n'.join(b['file'] for b in boards()))
    elif cmd == 'builds':
        for b in boards(): print(b.get('src') or f"Boards/src/{b['id']}.html", 'Boards/' + b['file'])
        hub = load_index().get('hub')
        if hub: print(hub.get('src', 'Boards/src/index.html'), 'Boards/' + hub.get('file', 'index.html'))
    else: sys.exit('usage: _index.py kit | files | builds')
