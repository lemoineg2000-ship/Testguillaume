// ══════════════════════════════
// CSV PROCESSING
// ══════════════════════════════
import { state } from './state.js';
import { generateCatalogue, resetToUpload } from './render.js';

export function processCSV(file) {
  state.currentFilename = file.name;
  state.clientName  = document.getElementById('client-name').value.trim() || 'Client';
  state.catalogueName = document.getElementById('catalogue-name').value.trim() || 'Catalogue LLD';
  document.getElementById('upload-screen').style.display = 'none';
  document.getElementById('loading-screen').style.display = 'flex';

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    encoding: 'UTF-8',
    complete: function(results) {
      state.currentRows = results.data;
      setTimeout(() => generateCatalogue(state.currentRows), 300);
    },
    error: function() {
      alert('Erreur lors de la lecture du CSV. Vérifiez le format.');
      resetToUpload();
    }
  });
}
