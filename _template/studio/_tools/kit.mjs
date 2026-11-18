// Shared by the _tools/*.mjs scripts: finds the kit root (the nearest folder above this project that holds both _template/
// and qa/) and loads Playwright from <kit>/qa/node_modules. No hardcoded depth or absolute paths.
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const kitRoot = (() => {
  let d = projectRoot;
  for (;;) {
    if (fs.existsSync(path.join(d, '_template')) && fs.existsSync(path.join(d, 'qa'))) return d;
    const p = path.dirname(d); if (p === d) throw new Error(`kit root (a folder holding _template/ and qa/) not found above ${projectRoot}`); d = p;
  }
})();
const pw = path.join(kitRoot, 'qa', 'node_modules', 'playwright', 'index.mjs');
if (!fs.existsSync(pw)) throw new Error(`Playwright not installed: run "npm install && npx playwright install chromium" in ${path.join(kitRoot, 'qa')}`);
export const { chromium } = await import(pathToFileURL(pw).href);
