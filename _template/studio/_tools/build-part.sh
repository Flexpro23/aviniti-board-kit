#!/bin/sh
# Usage: sh _tools/build-part.sh B1 B1-ch05.jsx  → exports/preview/B1-ch05.html containing ONLY that part.
# Lets parallel builders QA their own chapters without being broken by another builder's unfinished file.
set -e
cd "$(dirname "$0")/.." && board="$1" && part="$2" && mkdir -p exports/preview
python3 - "$board" "$part" <<'PY'
import re, sys
b, part = sys.argv[1], sys.argv[2]
s = open(f'Boards/src/{b}.html', encoding='utf-8').read()
s = re.sub(r'/\* @inline Boards/src/(B\d+-[^ ]+\.jsx) \*/', lambda m: m.group(0) if m.group(1) == part else '', s)
open(f'exports/preview/_{part}.src.html', 'w', encoding='utf-8').write(s)
PY
sh shared/build.sh "exports/preview/_$2.src.html" "exports/preview/${2%.jsx}.html"
