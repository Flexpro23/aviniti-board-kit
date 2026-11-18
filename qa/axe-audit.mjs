#!/usr/bin/env node
/**
 * axe-audit.mjs
 *
 * Injects axe-core into a rendered Aviniti UI board and runs a WCAG 2 A/AA +
 * best-practice audit. Produces raw JSON + a grouped markdown summary.
 *
 * Usage:
 *   node axe-audit.mjs <path-to-html> [--out <dir>]
 *
 * Emits:
 *   <out>/axe-violations.json
 *   <out>/axe-summary.md
 *
 * Exit codes:
 *   0  no critical or serious violations
 *   1  at least one critical violation
 *   2  at least one serious violation (no critical)
 */

import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const AXE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';

function parseArgs(argv) {
  const args = { htmlPath: null, outDir: null };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--out' && rest[i + 1]) args.outDir = rest[++i];
    else if (!args.htmlPath && !a.startsWith('--')) args.htmlPath = a;
  }
  return args;
}

function die(msg, code = 1) {
  console.error(`[axe-audit] ${msg}`);
  process.exit(code);
}

/** Load axe source from local node_modules, fall back to CDN fetch at runtime. */
function resolveAxeSource() {
  const here = dirname(fileURLToPath(import.meta.url));
  const local = join(here, 'node_modules', 'axe-core', 'axe.min.js');
  if (existsSync(local)) {
    return { source: readFileSync(local, 'utf8'), origin: 'local' };
  }
  return { source: null, origin: 'cdn' };
}

function groupByImpact(violations) {
  const buckets = { critical: [], serious: [], moderate: [], minor: [] };
  for (const v of violations) {
    const key = v.impact && buckets[v.impact] ? v.impact : 'minor';
    buckets[key].push(v);
  }
  return buckets;
}

function renderMarkdown({ boardName, timestamp, violations, passes, incomplete }) {
  const grouped = groupByImpact(violations);
  const lines = [];
  lines.push(`# axe-core Accessibility Audit — ${boardName}`);
  lines.push('');
  lines.push(`Run: ${timestamp}`);
  lines.push('');
  lines.push(
    `**Totals**: ${violations.length} violations · ${passes.length} passes · ${incomplete.length} incomplete (manual review)`
  );
  lines.push('');
  lines.push(
    `- Critical: ${grouped.critical.length}`,
    `- Serious:  ${grouped.serious.length}`,
    `- Moderate: ${grouped.moderate.length}`,
    `- Minor:    ${grouped.minor.length}`
  );
  lines.push('');

  if (violations.length === 0) {
    lines.push('No violations detected. ');
    return lines.join('\n');
  }

  lines.push('## Violations');
  lines.push('');
  lines.push('| Rule ID | Impact | Nodes | Summary | Docs |');
  lines.push('|---|---|---:|---|---|');
  const order = ['critical', 'serious', 'moderate', 'minor'];
  for (const impact of order) {
    for (const v of grouped[impact]) {
      const rule = v.id;
      const nodes = v.nodes.length;
      const summary = (v.help || v.description || '').replace(/\|/g, '\\|');
      const link = v.helpUrl || `https://dequeuniversity.com/rules/axe/latest/${rule}`;
      lines.push(`| \`${rule}\` | ${impact} | ${nodes} | ${summary} | [docs](${link}) |`);
    }
  }
  lines.push('');

  // Expanded node details for triage.
  lines.push('## Node details');
  lines.push('');
  for (const impact of order) {
    for (const v of grouped[impact]) {
      lines.push(`### \`${v.id}\` — ${impact}`);
      lines.push('');
      lines.push(`${v.help}`);
      lines.push('');
      v.nodes.slice(0, 5).forEach((n, i) => {
        lines.push(`${i + 1}. \`${n.target.join(' ')}\``);
        if (n.failureSummary) {
          lines.push(`   - ${n.failureSummary.split('\n').join('\n     ')}`);
        }
      });
      if (v.nodes.length > 5) lines.push(`   …and ${v.nodes.length - 5} more.`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

export async function runAxeAudit({ htmlPath, outDir } = {}) {
  const args = htmlPath ? { htmlPath, outDir } : parseArgs(process.argv);
  if (!args.htmlPath) die('Missing HTML path. Usage: axe-audit.mjs <path-to-html>');

  const abs = resolve(args.htmlPath);
  if (!existsSync(abs)) die(`File not found: ${abs}`);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const out = args.outDir
    ? resolve(args.outDir)
    : resolve(dirname(fileURLToPath(import.meta.url)), 'QA_screenshots', stamp);
  mkdirSync(out, { recursive: true });

  const { source: localAxe, origin } = resolveAxeSource();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const fileUrl = pathToFileURL(abs).toString();
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);

  // Boost to zoom 1.0 so axe inspects crisp, un-transformed DOM.
  await page
    .getByRole('button', { name: /^fit$/i })
    .first()
    .click({ timeout: 800 })
    .catch(() => {});
  await page.waitForTimeout(200);

  // Inject axe.
  if (localAxe) {
    await page.addScriptTag({ content: localAxe });
  } else {
    try {
      await page.addScriptTag({ url: AXE_CDN });
    } catch (e) {
      await browser.close();
      die(`Could not load axe-core locally or from CDN: ${e.message}`);
    }
  }

  const results = await page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    return await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'best-practice'] },
      resultTypes: ['violations', 'passes', 'incomplete'],
    });
  });

  await browser.close();

  const payload = {
    boardFile: abs,
    boardName: basename(abs),
    timestamp: new Date().toISOString(),
    axeSource: origin,
    violations: results.violations,
    passes: results.passes,
    incomplete: results.incomplete,
  };

  const jsonPath = join(out, 'axe-violations.json');
  const mdPath = join(out, 'axe-summary.md');
  await writeFile(jsonPath, JSON.stringify(payload, null, 2), 'utf8');
  await writeFile(mdPath, renderMarkdown(payload), 'utf8');

  const grouped = groupByImpact(results.violations);
  let exitCode = 0;
  if (grouped.critical.length > 0) exitCode = 1;
  else if (grouped.serious.length > 0) exitCode = 2;

  return {
    payload,
    jsonPath,
    mdPath,
    outDir: out,
    counts: {
      critical: grouped.critical.length,
      serious: grouped.serious.length,
      moderate: grouped.moderate.length,
      minor: grouped.minor.length,
    },
    exitCode,
  };
}

const invokedDirectly =
  import.meta.url === pathToFileURL(process.argv[1] || '').toString();

if (invokedDirectly) {
  runAxeAudit()
    .then(({ counts, jsonPath, mdPath, exitCode }) => {
      console.log(`[axe-audit] JSON → ${jsonPath}`);
      console.log(`[axe-audit] MD   → ${mdPath}`);
      console.log(
        `[axe-audit] critical=${counts.critical} serious=${counts.serious} moderate=${counts.moderate} minor=${counts.minor}`
      );
      process.exit(exitCode);
    })
    .catch((e) => die(`Fatal: ${e.stack || e.message}`));
}
