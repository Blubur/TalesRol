// generate-report.mjs
// Ejecuta: node generate-report.mjs
// Lee el JSON de resultados de Playwright y genera un dashboard HTML

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const RESULTS_FILE = './test-results.json';
const OUTPUT_HTML = './dashboard.html';

// ── 1. Lanza los tests con reporter JSON ─────────────────────────────────────
console.log('▶  Ejecutando tests...');
try {
  execSync(
    `npx playwright test --reporter=json 2>/dev/null > ${RESULTS_FILE}`,
    { env: { ...process.env }, stdio: 'inherit' }
  );
} catch {
  // Playwright devuelve exit code != 0 si hay fallos, lo ignoramos
}

if (!existsSync(RESULTS_FILE)) {
  console.error('✗  No se generó el archivo de resultados.');
  process.exit(1);
}

// ── 2. Lee y parsea los resultados ───────────────────────────────────────────
const raw = readFileSync(RESULTS_FILE, 'utf-8');
const data = JSON.parse(raw);

const suites = data.suites || [];
const stats = data.stats || {};

// Aplana todos los tests
function collectTests(suite, file = '') {
  const tests = [];
  const f = suite.file || file;
  for (const spec of suite.specs || []) {
    for (const result of spec.tests || []) {
      const status = result.results?.[0]?.status || 'unknown';
      const duration = result.results?.[0]?.duration || 0;
      const stdout = result.results?.[0]?.stdout?.map(s => s.text).join('') || '';
      tests.push({
        file: f,
        title: spec.title,
        fullTitle: result.title || spec.title,
        status,      // passed | failed | timedOut | skipped
        duration,
        stdout,
        error: result.results?.[0]?.error?.message || '',
      });
    }
  }
  for (const child of suite.suites || []) {
    tests.push(...collectTests(child, f));
  }
  return tests;
}

const allTests = suites.flatMap(s => collectTests(s));

// Agrupa por archivo
const byFile = {};
for (const t of allTests) {
  const key = path.basename(t.file || 'otros');
  if (!byFile[key]) byFile[key] = [];
  byFile[key].push(t);
}

const passed = allTests.filter(t => t.status === 'passed').length;
const failed = allTests.filter(t => t.status === 'failed' || t.status === 'timedOut').length;
const skipped = allTests.filter(t => t.status === 'skipped').length;
const total = allTests.length;
const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

// Extrae logs de bugs
const bugTests = allTests.filter(t => t.fullTitle?.includes('BUG') || t.title?.includes('BUG'));

// ── 3. Genera el HTML ─────────────────────────────────────────────────────────
const now = new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' });

function statusIcon(status) {
  if (status === 'passed') return `<svg class="icon icon-pass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  if (status === 'failed' || status === 'timedOut') return `<svg class="icon icon-fail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>`;
  return `<svg class="icon icon-skip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"/></svg>`;
}

function bugIcon(stdout) {
  if (stdout.includes('BUG CONFIRMADO')) return `<svg class="icon icon-bug" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.854.966 1.854 2.013 0 3.728-2.35 6.75-5.237 6.75S6.763 18.728 6.763 15c0-1.047.817-1.867 1.854-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44a23.916 23.916 0 001.152 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.778 3.778 0 01.4-2.25m0 0a3.75 3.75 0 016.035 0m-6.035 0l-.001.002M9.397 5.766A3.75 3.75 0 0112 5.25c.995 0 1.949.25 2.771.693"/></svg>`;
  if (stdout.includes('Sin errores') || stdout.includes('✅')) return `<svg class="icon icon-pass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  return `<svg class="icon icon-warn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`;
}

function fileLabel(filename) {
  const map = {
    'auth.spec.ts': 'Autenticación',
    'navegacion.spec.ts': 'Navegación',
    'salas.spec.ts': 'Salas & Posts',
    'personajes perfil.spec.ts': 'Personajes & Perfil',
    'admin.spec.ts': 'Panel Admin',
    'bugs conocidos.spec.ts': 'Bugs Conocidos',
  };
  return map[filename] || filename;
}

function fileIcon(filename) {
  if (filename.includes('auth')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`;
  if (filename.includes('nav')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>`;
  if (filename.includes('sala')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`;
  if (filename.includes('personaje')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>`;
  if (filename.includes('admin')) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>`;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.854.966 1.854 2.013 0 3.728-2.35 6.75-5.237 6.75S6.763 18.728 6.763 15c0-1.047.817-1.867 1.854-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44a23.916 23.916 0 001.152 6.06M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.778 3.778 0 01.4-2.25m0 0a3.75 3.75 0 016.035 0m-6.035 0l-.001.002"/></svg>`;
}

const testRows = Object.entries(byFile).map(([file, tests]) => {
  const fp = tests.filter(t => t.status === 'passed').length;
  const ff = tests.filter(t => t.status !== 'passed' && t.status !== 'skipped').length;
  const rows = tests.map(t => `
    <tr class="test-row ${t.status}">
      <td class="td-icon">${statusIcon(t.status)}</td>
      <td class="td-title">${t.title}</td>
      <td class="td-duration">${(t.duration / 1000).toFixed(1)}s</td>
      <td class="td-log">${t.stdout ? `<span class="log-text">${t.stdout.replace(/</g,'&lt;').trim()}</span>` : ''}</td>
      ${t.error ? `<td class="td-error"><span class="error-text">${t.error.replace(/</g,'&lt;').slice(0,120)}</span></td>` : '<td></td>'}
    </tr>`).join('');

  return `
  <div class="suite-card">
    <div class="suite-header">
      <div class="suite-icon">${fileIcon(file)}</div>
      <div class="suite-info">
        <h2 class="suite-title">${fileLabel(file)}</h2>
        <span class="suite-file">${file}</span>
      </div>
      <div class="suite-badges">
        <span class="badge badge-pass">${fp} ok</span>
        ${ff > 0 ? `<span class="badge badge-fail">${ff} fail</span>` : ''}
      </div>
    </div>
    <table class="test-table">
      <thead><tr><th></th><th>Test</th><th>Tiempo</th><th>Log</th><th>Error</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}).join('');

const bugRows = bugTests.map(t => `
  <div class="bug-row">
    <div class="bug-icon">${bugIcon(t.stdout)}</div>
    <div class="bug-info">
      <span class="bug-title">${t.title.replace('[BUG] ', '')}</span>
      <span class="bug-log">${t.stdout?.trim() || (t.status === 'passed' ? 'Pasó sin errores detectados' : 'Sin log')}</span>
    </div>
    <span class="bug-status ${t.status}">${t.status}</span>
  </div>`).join('');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TalesRol — Informe de Tests</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0d0d12;
    --bg2: #13131a;
    --bg3: #1a1a24;
    --border: #2a2a3a;
    --accent: #c9a84c;
    --accent2: #e8c97a;
    --pass: #4caf82;
    --fail: #e05c5c;
    --warn: #e8a84c;
    --skip: #6b7280;
    --text: #e8e4d8;
    --text2: #9490a0;
    --text3: #5a5668;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Crimson Pro', Georgia, serif;
    font-size: 16px;
    min-height: 100vh;
    background-image:
      radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%),
      repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px);
  }

  /* ── HEADER ── */
  .header {
    border-bottom: 1px solid var(--border);
    padding: 2.5rem 3rem 2rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
    background: linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%);
  }

  .header-left { flex: 1; }

  .header-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  h1 {
    font-family: 'Cinzel', serif;
    font-size: 1.9rem;
    font-weight: 600;
    color: var(--accent2);
    letter-spacing: 0.05em;
    line-height: 1.2;
  }

  .header-date {
    margin-top: 0.4rem;
    font-size: 0.9rem;
    color: var(--text2);
    font-style: italic;
  }

  /* ── STATS BAR ── */
  .stats-bar {
    display: flex;
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    min-width: 340px;
  }

  .stat-block {
    flex: 1;
    padding: 1.2rem 1.5rem;
    background: var(--bg2);
    text-align: center;
    transition: background 0.2s;
  }
  .stat-block:hover { background: var(--bg3); }

  .stat-num {
    font-family: 'Cinzel', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  .stat-block.s-pass .stat-num { color: var(--pass); }
  .stat-block.s-fail .stat-num { color: var(--fail); }
  .stat-block.s-total .stat-num { color: var(--accent2); }
  .stat-block.s-rate .stat-num { color: var(--accent); }

  .stat-label {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text3);
    font-family: 'Cinzel', serif;
  }

  /* ── PROGRESS BAR ── */
  .progress-wrap {
    padding: 0 3rem;
    margin: 1.5rem 0 0;
  }
  .progress-bar {
    height: 3px;
    background: var(--bg3);
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--pass), var(--accent));
    border-radius: 99px;
    transition: width 1s ease;
  }

  /* ── MAIN ── */
  main { padding: 2rem 3rem 4rem; max-width: 1400px; margin: 0 auto; }

  /* ── SECTION TITLE ── */
  .section-title {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--text3);
    margin: 2.5rem 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── BUGS PANEL ── */
  .bugs-panel {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
  }

  .bug-row {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .bug-row:last-child { border-bottom: none; }
  .bug-row:hover { background: var(--bg3); }

  .bug-icon { flex-shrink: 0; margin-top: 2px; }
  .bug-info { flex: 1; }
  .bug-title {
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    color: var(--text);
    display: block;
    margin-bottom: 0.25rem;
  }
  .bug-log {
    font-size: 0.85rem;
    color: var(--text2);
    font-style: italic;
  }
  .bug-status {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .bug-status.passed { background: rgba(76,175,130,0.15); color: var(--pass); }
  .bug-status.failed, .bug-status.timedOut { background: rgba(224,92,92,0.15); color: var(--fail); }

  /* ── SUITE CARDS ── */
  .suite-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.25rem;
    transition: border-color 0.2s;
  }
  .suite-card:hover { border-color: rgba(201,168,76,0.3); }

  .suite-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg3);
  }

  .suite-icon {
    width: 36px; height: 36px;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--accent);
  }
  .suite-icon svg { width: 18px; height: 18px; }

  .suite-info { flex: 1; }
  .suite-title {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
  }
  .suite-file {
    font-size: 0.75rem;
    color: var(--text3);
    font-family: monospace;
  }

  .suite-badges { display: flex; gap: 0.4rem; }

  .badge {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .badge-pass { background: rgba(76,175,130,0.15); color: var(--pass); border: 1px solid rgba(76,175,130,0.3); }
  .badge-fail { background: rgba(224,92,92,0.15); color: var(--fail); border: 1px solid rgba(224,92,92,0.3); }

  /* ── TABLE ── */
  .test-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .test-table thead tr {
    background: rgba(0,0,0,0.2);
  }
  .test-table th {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text3);
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-weight: 400;
  }

  .test-row { border-top: 1px solid rgba(255,255,255,0.03); transition: background 0.1s; }
  .test-row:hover { background: rgba(255,255,255,0.02); }
  .test-row.passed { }
  .test-row.failed, .test-row.timedOut { background: rgba(224,92,92,0.04); }

  .test-table td { padding: 0.55rem 0.75rem; vertical-align: top; }

  .td-icon { width: 28px; }
  .td-duration { width: 60px; color: var(--text3); font-size: 0.8rem; white-space: nowrap; }
  .td-title { color: var(--text); }
  .td-log { max-width: 320px; }
  .td-error { max-width: 240px; }

  .log-text {
    font-size: 0.78rem;
    color: var(--text2);
    font-style: italic;
    display: block;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .error-text {
    font-size: 0.75rem;
    color: var(--fail);
    font-family: monospace;
    display: block;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* ── ICONS ── */
  .icon { width: 18px; height: 18px; display: inline-block; vertical-align: middle; }
  .icon-pass { color: var(--pass); }
  .icon-fail { color: var(--fail); }
  .icon-skip { color: var(--skip); }
  .icon-bug  { color: var(--fail); }
  .icon-warn { color: var(--warn); }

  /* ── FOOTER ── */
  footer {
    text-align: center;
    padding: 2rem;
    font-size: 0.8rem;
    color: var(--text3);
    border-top: 1px solid var(--border);
    font-style: italic;
  }

  /* ── ANIM ── */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .suite-card { animation: fadeIn 0.4s ease both; }
  .suite-card:nth-child(1) { animation-delay: 0.05s; }
  .suite-card:nth-child(2) { animation-delay: 0.10s; }
  .suite-card:nth-child(3) { animation-delay: 0.15s; }
  .suite-card:nth-child(4) { animation-delay: 0.20s; }
  .suite-card:nth-child(5) { animation-delay: 0.25s; }
  .suite-card:nth-child(6) { animation-delay: 0.30s; }
</style>
</head>
<body>

<header class="header">
  <div class="header-left">
    <p class="header-eyebrow">TalesRol · Automatización</p>
    <h1>Informe de Tests</h1>
    <p class="header-date">${now}</p>
  </div>
  <div class="stats-bar">
    <div class="stat-block s-total">
      <div class="stat-num">${total}</div>
      <div class="stat-label">Total</div>
    </div>
    <div class="stat-block s-pass">
      <div class="stat-num">${passed}</div>
      <div class="stat-label">Pasados</div>
    </div>
    <div class="stat-block s-fail">
      <div class="stat-num">${failed}</div>
      <div class="stat-label">Fallidos</div>
    </div>
    <div class="stat-block s-rate">
      <div class="stat-num">${passRate}%</div>
      <div class="stat-label">Éxito</div>
    </div>
  </div>
</header>

<div class="progress-wrap">
  <div class="progress-bar">
    <div class="progress-fill" style="width:${passRate}%"></div>
  </div>
</div>

<main>
  ${bugTests.length > 0 ? `
  <p class="section-title">Regresión de bugs</p>
  <div class="bugs-panel">${bugRows}</div>
  ` : ''}

  <p class="section-title">Resultados por módulo</p>
  ${testRows}
</main>

<footer>
  Generado automáticamente · TalesRol Test Suite · Playwright
</footer>

</body>
</html>`;

writeFileSync(OUTPUT_HTML, html, 'utf-8');
console.log(`\n✦  Informe generado: ${OUTPUT_HTML}`);
console.log(`   ${passed}/${total} tests pasados (${passRate}%)\n`);

// Abre en el navegador por defecto
try {
  const open = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  execSync(`${open} ${OUTPUT_HTML}`);
} catch {}
