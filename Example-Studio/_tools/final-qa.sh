#!/bin/sh
# Final QA over every built board in Boards/index.json (+ the hub): verify.py, kit QA (Playwright + axe light), axe dark,
# 100 % captures light (with states) + dark. Results in exports/final/. Run sh _tools/build-all.sh first.
cd "$(dirname "$0")/.." || exit 1
PROJ=$(pwd); KIT=$(python3 _tools/_index.py kit) || exit 1
OUT=exports/final; rm -rf $OUT; mkdir -p $OUT
python3 _tools/verify.py > $OUT/verify.txt 2>&1; echo "verify exit $?" >> $OUT/verify.txt
for f in $(python3 _tools/_index.py files) index.html; do
  n=${f%.html}
  (cd "$KIT/qa" && npm run qa -- "$PROJ/Boards/$f" 2>&1 | grep -E "PASS|FAIL|critical=") > $OUT/$n.qa.txt
  (cd "$KIT/qa" && node axe-dark.mjs "$PROJ/Boards/$f" 2>&1) > $OUT/$n.axedark.txt
  [ "$f" = index.html ] && continue
  node _tools/capture.mjs $OUT/cap "Boards/$f" --states 2>&1 | tail -4 > $OUT/$n.cap.txt
  node _tools/capture.mjs $OUT/cap "Boards/$f" --dark 2>&1 | tail -4 > $OUT/$n.capdark.txt
done
echo DONE > $OUT/DONE
