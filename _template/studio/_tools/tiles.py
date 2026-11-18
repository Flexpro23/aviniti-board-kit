# Usage: python3 _tools/tiles.py <png> <outdir> [tileW=1350] [tileH=1000] — split a capture into readable tiles.
# Stdlib only: the crop runs in headless Chromium through _tools/img.mjs (Playwright from the kit's qa/).
import os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.exit(subprocess.call(['node', os.path.join(here, 'img.mjs'), 'tiles', *sys.argv[1:]]))
