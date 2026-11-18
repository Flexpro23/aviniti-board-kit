# Usage: python3 _tools/half.py <png...> — writes <name>.half<k>.png scaled to 50 % (1300 px tall slices), ready to LOOK at.
# Stdlib only: the resize runs in headless Chromium through _tools/img.mjs (Playwright from the kit's qa/).
import os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.exit(subprocess.call(['node', os.path.join(here, 'img.mjs'), 'half', *sys.argv[1:]]))
