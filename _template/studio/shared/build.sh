#!/bin/sh
# Usage: sh shared/build.sh <src> <out>   (both relative to the project folder, e.g. Boards/src/B1.html Boards/Project_B1.html)
# 1. rebuilds Design-System/tokens.* (fails the build on any contrast miss)
# 2. inlines every "@inline <path>" comment marker (paths relative to the project folder, nested up to 3 levels)
# 3. substitutes the tokens, logo, fonts and boards-index markers (see the kit docs for the exact spellings)
# 4. swaps the text/babel script for a compact in-browser Babel loader (no 500 KB console note)
# Edit sources only — never the built output.
set -e
cd "$(dirname "$0")/.."
[ -n "$1" ] && [ -n "$2" ] || { echo "usage: sh shared/build.sh <src> <out>" >&2; exit 2; }
(cd Design-System && node build-tokens.mjs) || { echo "build failed: design tokens (see above)" >&2; exit 1; }
python3 - "$1" "$2" <<'PY'
import json, os, re, sys
src, out = sys.argv[1], sys.argv[2]
def kit_root(start):
    d = os.path.abspath(start)
    while True:
        if os.path.isdir(os.path.join(d, '_template')) and os.path.isdir(os.path.join(d, 'qa')): return d
        p = os.path.dirname(d)
        if p == d: sys.exit('build: kit root (a folder holding _template/ and qa/) not found above ' + os.path.abspath(start))
        d = p
s = open(src, encoding='utf-8').read()
for _ in range(3):
    s = re.sub(r'/\*\s*@inline\s+(.+?)\s*\*/', lambda m: open(m.group(1).strip(), encoding='utf-8').read(), s)
t = json.load(open('Design-System/tokens.json', encoding='utf-8'))
logo = open(os.path.join(kit_root('.'), '_template', '_aviniti-logo-base64.txt')).read().strip()
try:
    idx = json.load(open('Boards/index.json', encoding='utf-8')).get('boards', [])
except FileNotFoundError:
    idx = []
s = (s.replace('/*__TOKENS__*/', json.dumps(t, ensure_ascii=False)).replace('/*__LOGO__*/', logo)
      .replace('/*__FONTS__*/', t['type'].get('fontsHref') or '').replace('/*__BOARDS_INDEX__*/', json.dumps(idx, ensure_ascii=False)))
left = re.findall(r'/\*__[A-Z_]+__\*/', s)
if left: sys.exit('build: unreplaced markers ' + ', '.join(sorted(set(left))))
# Large boards exceed Babel's 500 KB "auto compact" threshold, which logs a console.error note. Transform explicitly
# with compact output through a tiny loader instead of type="text/babel" (same in-browser Babel, no build deps).
tag = '<script type="text/babel" data-presets="react">'
if tag in s:
    i = s.index(tag); j = s.index('</script>', i)
    loader = ('<script>(function(){var src=document.getElementById("board-src").textContent;try{'
              'var out=Babel.transform(src,{presets:["react"],compact:true,comments:false,sourceType:"script"}).code;'
              'var el=document.createElement("script");el.textContent=out;document.body.appendChild(el);}'
              'catch(e){console.error(e);document.body.insertAdjacentHTML("beforeend","<pre style=\\"padding:24px;white-space:pre-wrap\\">"+String(e.message).replace(/</g,"&lt;")+"</pre>");}})();</script>')
    s = s[:i] + '<script type="text/x-board-jsx" id="board-src">' + s[i+len(tag):j] + '</script>\n' + loader + s[j+len('</script>'):]
os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
open(out, 'w', encoding='utf-8').write(s)
PY
echo "built $2"
