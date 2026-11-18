#!/usr/bin/env node
/**
 * run-qa.mjs
 *
 * Chains playwright-qa + axe-audit against a single Aviniti UI board HTML file
 * and emits one consolidated QA_report.md alongside the raw artefacts, all
 * under qa/QA_screenshots/<timestamp>/.
 *
 * Usage:
 *   node run-qa.mjs <path-to-html>
 *
 * Exit codes:
 *   0  all Playwright checks passed AND no critical/serious a11y violations
 *   1  a Playwright check failed OR a critical a11y violation was found
 *   2  only serious a11y violations (no critical, Playwright checks passed)
 */

import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname, basename, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { runPlaywrightQA } from './playwright-qa.mjs';
import { runAxeAudit } from './axe-audit.mjs';

function die(msg, code = 1) {
  console.error(`[run-qa] ${msg}`);
  process.exit(code);
}

function statusIcon(ok) {
  return ok ? '✅' : '❌';
}

function humanise(checkName) {
  return checkName
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function renderCombinedReport({ pwReport, axePayload, axeCounts, outDir, axeMdRel }) {
  const lines = [];
  lines.push(`# QA Report — ${pwReport.boardName}`);
  lines.push(`Run: ${pwReport.timestamp}`);

  // "Screens detected" = number of per-screen screenshots captured.
  const screens = pwReport.screenshots.screens.length;
  lines.push(`Screens detected: ${screens}`);
  lines.push('');

  // -------- Summary --------
  lines.push('## Summary');
  for (const c of pwReport.checks) {
    lines.push(`${statusIcon(c.passed)} ${humanise(c.name)} — ${c.detail}`);
  }
  const a11yOk = axeCounts.critical === 0 && axeCounts.serious === 0;
  lines.push(
    `${statusIcon(a11yOk)} Accessibility — critical: ${axeCounts.critical}, serious: ${axeCounts.serious}, moderate: ${axeCounts.moderate}, minor: ${axeCounts.minor}`
  );
  lines.push('');

  // -------- Screenshots --------
  lines.push('## Screenshots');
  const rel = (p) => (p ? './' + relative(outDir, p).replace(/\\/g, '/') : 'n/a');
  lines.push(`- Full canvas (zoom 0.35): ${rel(pwReport.screenshots.board)}`);
  pwReport.screenshots.screens.forEach((p, i) => {
    lines.push(`- Screen ${i + 1} detail: ${rel(p)}`);
  });
  lines.push('');

  // -------- Accessibility --------
  lines.push('## Accessibility (axe-core)');
  lines.push('');
  lines.push(
    `Totals: **${axePayload.violations.length}** violations · ${axePayload.passes.length} passes · ${axePayload.incomplete.length} incomplete`
  );
  lines.push('');
  if (axePayload.violations.length === 0) {
    lines.push('No violations found.');
  } else {
    lines.push('| Rule ID | Impact | Nodes | Summary | Docs |');
    lines.push('|---|---|---:|---|---|');
    const order = ['critical', 'serious', 'moderate', 'minor'];
    const buckets = { critical: [], serious: [], moderate: [], minor: [] };
    for (const v of axePayload.violations) {
      const k = v.impact && buckets[v.impact] ? v.impact : 'minor';
      buckets[k].push(v);
    }
    for (const impact of order) {
      for (const v of buckets[impact]) {
        const summary = (v.help || v.description || '').replace(/\|/g, '\\|');
        const link = v.helpUrl || `https://dequeuniversity.com/rules/axe/latest/${v.id}`;
        lines.push(`| \`${v.id}\` | ${impact} | ${v.nodes.length} | ${summary} | [docs](${link}) |`);
      }
    }
    lines.push('');
    lines.push(`Full violation details: ${axeMdRel}`);
  }
  lines.push('');

  // -------- Performance --------
  lines.push('## Performance');
  const perf = pwReport.performance || {};
  lines.push(
    `Load time: ${perf.loadEventMs ?? 'n/a'}ms / DOMContentLoaded: ${perf.domContentLoadedMs ?? 'n/a'}ms (wall-clock ${perf.wallClockMs}ms)`
  );
  lines.push('');

  // -------- Raw artefacts --------
  lines.push('## Raw artefacts');
  lines.push('- playwright-report.json');
  lines.push('- axe-violations.json');
  lines.push('- axe-summary.md');
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const htmlArg = process.argv[2];
  if (!htmlArg || htmlArg.startsWith('--')) {
    die('Missing HTML path. Usage: node run-qa.mjs <path-to-html>');
  }

  const abs = resolve(htmlArg);
  if (!existsSync(abs)) die(`File not found: ${abs}`);

  // Create one shared timestamped output dir for both phases.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = resolve(dirname(fileURLToPath(import.meta.url)), 'QA_screenshots', stamp);
  mkdirSync(outDir, { recursive: true });

  console.log(`[run-qa] Board: ${abs}`);
  console.log(`[run-qa] Output: ${outDir}`);

  // 1. Playwright phase
  console.log('[run-qa] Running Playwright checks…');
  const pw = await runPlaywrightQA({ htmlPath: abs, outDir });
  for (const c of pw.report.checks) {
    console.log(`  ${c.passed ? 'PASS' : 'FAIL'}  ${c.name}`);
  }

  // 2. axe phase
  console.log('[run-qa] Running axe-core audit…');
  const axe = await runAxeAudit({ htmlPath: abs, outDir });
  console.log(
    `  critical=${axe.counts.critical} serious=${axe.counts.serious} moderate=${axe.counts.moderate} minor=${axe.counts.minor}`
  );

  // 3. Merge report
  const md = renderCombinedReport({
    pwReport: pw.report,
    axePayload: axe.payload,
    axeCounts: axe.counts,
    outDir,
    axeMdRel: './' + basename(axe.mdPath),
  });
  const reportPath = join(outDir, 'QA_report.md');
  await writeFile(reportPath, md, 'utf8');
  console.log(`[run-qa] Report → ${reportPath}`);

  // 4. Exit code logic
  let exitCode = 0;
  if (!pw.allPassed) exitCode = 1;
  else if (axe.counts.critical > 0) exitCode = 1;
  else if (axe.counts.serious > 0) exitCode = 2;

  process.exit(exitCode);
}

const invokedDirectly =
  import.meta.url === pathToFileURL(process.argv[1] || '').toString();

if (invokedDirectly) {
  main().catch((e) => die(`Fatal: ${e.stack || e.message}`));
}
