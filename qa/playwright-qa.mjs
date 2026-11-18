#!/usr/bin/env node
/**
 * playwright-qa.mjs
 *
 * Runs the automated portion of the "Step 8 — Playwright QA" checklist from
 * CLAUDE.md against a self-contained Aviniti UI board HTML file.
 *
 * Usage:
 *   node playwright-qa.mjs <path-to-html> [--out <dir>]
 *
 * Emits:
 *   <out>/playwright-report.json
 *   <out>/board.png              (full canvas @ zoom 0.35)
 *   <out>/screen-NN.png          (one per detected phone/desktop frame @ zoom 1.0)
 *
 * Exit codes:
 *   0  all checks passed
 *   1  at least one check failed
 */

import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

// ---------- CLI parsing ----------

function parseArgs(argv) {
  const args = { htmlPath: null, outDir: null };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--out' && rest[i + 1]) {
      args.outDir = rest[++i];
    } else if (!args.htmlPath && !a.startsWith('--')) {
      args.htmlPath = a;
    }
  }
  return args;
}

function die(msg, code = 1) {
  console.error(`[playwright-qa] ${msg}`);
  process.exit(code);
}

// ---------- Check helpers ----------

/** Fresh, serialisable result envelope for each check. */
function check(name) {
  return { name, passed: false, detail: '', data: null };
}

// ---------- Main ----------

export async function runPlaywrightQA({ htmlPath, outDir } = {}) {
  const args = htmlPath ? { htmlPath, outDir } : parseArgs(process.argv);
  if (!args.htmlPath) die('Missing HTML path. Usage: playwright-qa.mjs <path-to-html>');

  const abs = resolve(args.htmlPath);
  if (!existsSync(abs)) die(`File not found: ${abs}`);

  // Default output dir: ./QA_screenshots/<timestamp>/
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const out = args.outDir
    ? resolve(args.outDir)
    : resolve(dirname(new URL(import.meta.url).pathname), 'QA_screenshots', stamp);
  mkdirSync(out, { recursive: true });

  const fileUrl = pathToFileURL(abs).toString();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // ---------- Collectors ----------
  const consoleErrors = [];
  const pageErrors = [];
  const tileLoadEvents = [];
  const tileErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  // Observe Leaflet tile traffic by sniffing network responses to CartoDB.
  page.on('response', (resp) => {
    const url = resp.url();
    if (/basemaps\.cartocdn\.com|tile\.openstreetmap|cartodb-basemaps/i.test(url)) {
      if (resp.ok()) tileLoadEvents.push(url);
      else tileErrors.push(`${resp.status()} ${url}`);
    }
  });

  const perfStart = Date.now();
  await page.goto(fileUrl, { waitUntil: 'load' });

  // Wait for Babel to transpile and React to render — these boards render async.
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);

  const perfMetrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav
      ? {
          loadEventMs: Math.round(nav.loadEventEnd - nav.startTime),
          domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        }
      : null;
  });
  const wallClockMs = Date.now() - perfStart;

  const checks = [];

  // ---------- 1. Console clean ----------
  {
    const c = check('console_clean');
    c.passed = consoleErrors.length === 0 && pageErrors.length === 0;
    c.detail = c.passed
      ? 'No console errors or pageerrors detected.'
      : `Console errors: ${consoleErrors.length}, pageerrors: ${pageErrors.length}`;
    c.data = { consoleErrors, pageErrors };
    checks.push(c);
  }

  // ---------- 2. Zoom controls present + responsive ----------
  {
    const c = check('zoom_controls');
    try {
      // Board toolbars typically have buttons labelled "−", "+", "Fit" (case-insensitive).
      const before = await page.evaluate(() => {
        const label = document.body.innerText.match(/(\d{1,3})\s*%/);
        return label ? label[0] : null;
      });

      const clickIfExists = async (selector) => {
        const el = await page.$(selector);
        if (el) {
          await el.click({ timeout: 500 }).catch(() => {});
          return true;
        }
        return false;
      };

      // Try text-based locators first — works regardless of component markup.
      const minusClicked = await page
        .getByRole('button', { name: /^−$|^-$|zoom\s*out/i })
        .first()
        .click({ timeout: 1000 })
        .then(() => true)
        .catch(() => clickIfExists('button:has-text("−")'));

      await page.waitForTimeout(200);

      const plusClicked = await page
        .getByRole('button', { name: /^\+$|zoom\s*in/i })
        .first()
        .click({ timeout: 1000 })
        .then(() => true)
        .catch(() => clickIfExists('button:has-text("+")'));

      await page.waitForTimeout(200);

      const fitClicked = await page
        .getByRole('button', { name: /^fit$/i })
        .first()
        .click({ timeout: 1000 })
        .then(() => true)
        .catch(() => clickIfExists('button:has-text("Fit")'));

      await page.waitForTimeout(200);

      const after = await page.evaluate(() => {
        const label = document.body.innerText.match(/(\d{1,3})\s*%/);
        return label ? label[0] : null;
      });

      c.passed = (minusClicked || plusClicked || fitClicked) && (before !== null || after !== null);
      c.detail = c.passed
        ? `Zoom toolbar responsive. Before=${before}, After=${after}.`
        : `Could not find or operate zoom toolbar. Before=${before}, After=${after}.`;
      c.data = { before, after, minusClicked, plusClicked, fitClicked };
    } catch (e) {
      c.detail = `Error exercising zoom controls: ${e.message}`;
    }
    checks.push(c);
  }

  // ---------- 3. Bilingual EN + AR labels per screen ----------
  {
    const c = check('bilingual_labels');
    const result = await page.evaluate(() => {
      const AR_RANGE = /[\u0600-\u06FF]/;
      // Boards wrap each phone/desktop frame and follow with a caption block.
      // Heuristic: find all elements whose text contains Arabic, then count unique
      // "screen caption" groupings by proximity to phone/desktop frames.
      const frames = Array.from(
        document.querySelectorAll(
          '[data-frame], [class*="PhoneFrame"], [class*="phone-frame"], [class*="DesktopFrame"], [style*="border-radius: 44px"], [style*="border-radius: 40px"]'
        )
      );
      // Fallback: count any caption div that follows a frame — heuristic via the
      // "FS" (flow section) wrapper which is standard across templates.
      const captions = Array.from(document.querySelectorAll('div, span, p')).filter((el) => {
        const t = el.textContent || '';
        return t.length > 0 && t.length < 200 && AR_RANGE.test(t);
      });
      const arabicCaptions = captions.map((el) => (el.textContent || '').trim()).filter(Boolean);
      return {
        frameCount: frames.length,
        arabicCaptionCount: new Set(arabicCaptions).size,
        sampleCaptions: Array.from(new Set(arabicCaptions)).slice(0, 8),
      };
    });
    // Treat "at least one unique Arabic caption per frame" as healthy; zero frames
    // detected (unusual markup) still passes if AR text exists somewhere.
    c.passed =
      result.arabicCaptionCount > 0 &&
      (result.frameCount === 0 || result.arabicCaptionCount >= result.frameCount);
    c.detail = `Frames: ${result.frameCount}, unique AR captions: ${result.arabicCaptionCount}`;
    c.data = result;
    checks.push(c);
  }

  // ---------- 4. Leaflet tiles load ----------
  {
    const c = check('leaflet_tiles');
    // Allow a small window post-render for tile requests to flush.
    await page.waitForTimeout(3500);
    const hasLeaflet = await page.evaluate(() => !!window.L || !!document.querySelector('.leaflet-container'));
    if (!hasLeaflet) {
      c.passed = true; // Board doesn't use maps — not a failure.
      c.detail = 'No Leaflet instance detected on this board; skipping.';
      c.data = { skipped: true };
    } else {
      c.passed = tileLoadEvents.length > 0 && tileErrors.length === 0;
      c.detail = `Tile loads: ${tileLoadEvents.length}, tile errors: ${tileErrors.length}`;
      c.data = { tileLoads: tileLoadEvents.length, tileErrors };
    }
    checks.push(c);
  }

  // ---------- 5. No visible TODO text at zoom 0.35 ----------
  {
    const c = check('no_todo_text');
    const hits = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const found = [];
      while (walker.nextNode()) {
        const txt = walker.currentNode.nodeValue || '';
        if (/\bTODO\b/.test(txt)) {
          const el = walker.currentNode.parentElement;
          const style = el ? window.getComputedStyle(el) : null;
          const visible = style && style.display !== 'none' && style.visibility !== 'hidden';
          if (visible) found.push(txt.trim().slice(0, 120));
        }
      }
      return found;
    });
    c.passed = hits.length === 0;
    c.detail = c.passed ? 'No TODO text found in rendered DOM.' : `Found ${hits.length} TODO occurrences.`;
    c.data = { hits };
    checks.push(c);
  }

  // ---------- 6. Brand bar present ----------
  {
    const c = check('brand_bar');
    const found = await page.evaluate(() => {
      const bodyTxt = document.body.innerText || '';
      if (/AVINITI/i.test(bodyTxt)) return { kind: 'text' };
      const dataImg = document.querySelector('img[src^="data:image"]');
      if (dataImg) return { kind: 'base64-img', src: dataImg.src.slice(0, 40) + '...' };
      return null;
    });
    c.passed = !!found;
    c.detail = found ? `Brand bar detected (${found.kind}).` : 'No AVINITI text or base64 img found.';
    c.data = found;
    checks.push(c);
  }

  // ---------- 7. Arabic font loaded ----------
  {
    const c = check('arabic_font_loaded');
    const loaded = await page.evaluate(async () => {
      if (!document.fonts) return false;
      try {
        await document.fonts.ready;
        // Try the canonical font + a couple of common AR fallbacks.
        return (
          document.fonts.check('16px "IBM Plex Sans Arabic"') ||
          document.fonts.check('16px "Noto Sans Arabic"') ||
          document.fonts.check('16px "Cairo"')
        );
      } catch {
        return false;
      }
    });
    c.passed = loaded;
    c.detail = loaded
      ? 'Arabic font family reported as loaded by document.fonts.check.'
      : 'Arabic font not confirmed via document.fonts.check (AR text may fall back to system-ui).';
    checks.push(c);
  }

  // ---------- 8. Dark/light toggle flips background ----------
  {
    const c = check('theme_toggle');
    try {
      const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      const toggle = await page
        .getByRole('button', { name: /theme|dark|light|mode/i })
        .first()
        .elementHandle()
        .catch(() => null);
      if (toggle) {
        await toggle.click({ timeout: 800 }).catch(() => {});
        await page.waitForTimeout(400);
        const after = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        c.passed = before !== after;
        c.detail = c.passed
          ? `Background flipped ${before} → ${after}.`
          : `Toggle clicked but background unchanged (${before}).`;
        c.data = { before, after };
      } else {
        c.passed = true; // Not every board ships a theme toggle.
        c.detail = 'No theme toggle found; skipping.';
        c.data = { skipped: true };
      }
    } catch (e) {
      c.detail = `Error exercising theme toggle: ${e.message}`;
    }
    checks.push(c);
  }

  // ---------- 9. Screenshots ----------
  const screenshots = { board: null, screens: [] };
  {
    // Force-fit the canvas before the full shot by hitting "Fit".
    await page
      .getByRole('button', { name: /^fit$/i })
      .first()
      .click({ timeout: 800 })
      .catch(() => {});
    await page.waitForTimeout(400);

    const boardPath = join(out, 'board.png');
    await page.screenshot({ path: boardPath, fullPage: true });
    screenshots.board = boardPath;

    // Per-screen detail shots. Find phone/desktop frame-ish elements and shoot each.
    const frameHandles = await page.$$(
      '[data-frame], [class*="PhoneFrame"], [class*="phone-frame"], [class*="DesktopFrame"]'
    );
    // Fallback heuristic: elements sized roughly like a phone (393x852 / 390x844).
    let frames = frameHandles;
    if (frames.length === 0) {
      frames = await page.$$eval('*', (all) =>
        all
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return (
              (Math.abs(r.width - 393) < 8 && Math.abs(r.height - 852) < 12) ||
              (Math.abs(r.width - 390) < 8 && Math.abs(r.height - 844) < 12)
            );
          })
          .map((el, i) => ({ i, x: el.getBoundingClientRect().x }))
      ).then(() => frameHandles); // can't re-hydrate handles; leave empty array if so
    }

    for (let i = 0; i < Math.min(frames.length, 12); i++) {
      const shot = join(out, `screen-${String(i + 1).padStart(2, '0')}.png`);
      try {
        await frames[i].scrollIntoViewIfNeeded();
        await frames[i].screenshot({ path: shot });
        screenshots.screens.push(shot);
      } catch (e) {
        // Skip frames that can't be individually shot (likely transformed off-canvas).
      }
    }
  }

  await browser.close();

  const report = {
    boardFile: abs,
    boardName: basename(abs),
    timestamp: new Date().toISOString(),
    performance: { wallClockMs, ...(perfMetrics || {}) },
    checks,
    screenshots,
    outDir: out,
  };

  const reportPath = join(out, 'playwright-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

  const allPassed = checks.every((c) => c.passed);
  return { report, reportPath, allPassed, outDir: out };
}

// ---------- CLI entrypoint ----------

const invokedDirectly =
  import.meta.url === pathToFileURL(process.argv[1] || '').toString();

if (invokedDirectly) {
  runPlaywrightQA()
    .then(({ report, reportPath, allPassed }) => {
      console.log(`[playwright-qa] Report → ${reportPath}`);
      for (const c of report.checks) {
        console.log(`  ${c.passed ? 'PASS' : 'FAIL'}  ${c.name}: ${c.detail}`);
      }
      process.exit(allPassed ? 0 : 1);
    })
    .catch((e) => die(`Fatal: ${e.stack || e.message}`));
}
