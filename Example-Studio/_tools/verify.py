# Structural verification: inventory (Boards/index.json) ↔ board parts ↔ links. Run after any change; exits 1 on any problem.
# Checks every board that has screens in index.json against its parts Boards/src/<id>-*.jsx: missing / extra / duplicate
# ScreenFrame ids, ChapterBand screen counts, dead leadsTo targets, FlowStrip steps that point nowhere.
import glob, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _index import PROJECT, boards
os.chdir(PROJECT)
idx = boards()
ids = {b['id']: {s['id'] for s in b.get('screens', [])} for b in idx}
bad = 0
for b in idx:
    bid = b['id']; files = sorted(glob.glob(f'Boards/src/{bid}-*.jsx'))
    if not files and not ids[bid]: continue
    src = ''.join(open(f, encoding='utf-8').read() for f in files)
    frames = re.findall(r'<ScreenFrame id="([^"]+)"', src)
    dup = {x for x in frames if frames.count(x) > 1}
    missing = ids[bid] - set(frames); extra = set(frames) - ids[bid]
    counts = {}
    for f in frames: counts[int(f.split('.')[0])] = counts.get(int(f.split('.')[0]), 0) + 1
    bands = {int(n): int(c) for n, c in re.findall(r'<ChapterBand num=\{(\d+)\}[^>]*?screens=\{(\d+)\}', src, re.S)}
    wrong = {n: (bands[n], counts.get(n)) for n in bands if bands[n] != counts.get(n)}
    dead = []
    for l in re.findall(r"leadsTo=\{\[([^\]]*)\]\}", src):
        for t in re.findall(r"'([^']+)'", l):
            b2, sid = (t.split(':') if ':' in t else (bid, t))
            if sid not in ids.get(b2, set()): dead.append(t)
    flow = []
    for steps in re.findall(r"<FlowStrip name=\"[^\"]*\" steps=\{\[([^\]]*)\]\}", src):
        for st in re.findall(r"'((?:[^'\\]|\\.)*)'", steps):
            sid = st.split(' ')[0]
            b2, sid2 = (sid.split(':') if ':' in sid else (bid, sid))
            if sid2 not in ids.get(b2, set()): flow.append(st)
    print(f"{bid}: {len(frames)} frames · index {len(ids[bid])} · missing {sorted(missing)} · extra {sorted(extra)} · dup {sorted(dup)} · band counts wrong {wrong} · dead links {sorted(set(dead))} · bad flow steps {flow}")
    bad += len(missing) + len(extra) + len(dup) + len(wrong) + len(dead) + len(flow)
sys.exit(1 if bad else 0)
