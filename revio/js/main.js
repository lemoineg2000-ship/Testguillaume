// ══════════════════════════════
// MAIN — entry point
// Wires up all static event listeners
// ══════════════════════════════
import { processCSV } from './csv.js';
import { resetToUpload } from './render.js';
import { downloadHTML } from './export.js';

// ── Upload zone drag & drop ──────────────────
const dropZone = document.getElementById('drop-zone');
const dropBtn  = document.getElementById('drop-btn');
const csvInput = document.getElementById('csv-input');

dropZone.addEventListener('click', () => csvInput.click());

dropBtn.addEventListener('click', e => {
  e.stopPropagation();
  csvInput.click();
});

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-active');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-active'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-active');
  const file = e.dataTransfer.files[0];
  if (file) processCSV(file);
});

csvInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) processCSV(file);
});

// ── Toolbar buttons ──────────────────────────
document.getElementById('btn-reset').addEventListener('click', resetToUpload);
document.getElementById('btn-download').addEventListener('click', downloadHTML);
document.getElementById('btn-print').addEventListener('click', () => window.print());
