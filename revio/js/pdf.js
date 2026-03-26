// ══════════════════════════════
// EXPORT PDF — avec champs de formulaire éditables sur le récapitulatif
// ══════════════════════════════

export async function downloadPDF() {
  const btn = document.getElementById('btn-pdf');
  const label = btn.textContent;
  btn.textContent = 'Génération…';
  btn.disabled = true;

  try {
    const { PDFDocument, rgb } = PDFLib;

    const pages      = document.querySelectorAll('#pages-container .cat-page');
    const summaryPage = document.querySelector('#pages-container .cat-summary');

    // A4 paysage en points PDF (1 pt = 1/72 pouce)
    const PDF_W = 841.89;
    const PDF_H = 595.28;

    // ── Mesurer les positions des inputs Qté AVANT le rendu ──────────────
    const qtyPositions = [];
    if (summaryPage) {
      const pageRect = summaryPage.getBoundingClientRect();
      summaryPage.querySelectorAll('.sum-qty-input').forEach(input => {
        const r = input.getBoundingClientRect();
        qtyPositions.push({
          x: r.left - pageRect.left,
          y: r.top  - pageRect.top,
          w: r.width,
          h: r.height,
        });
      });
    }

    const pdfDoc = await PDFDocument.create();

    for (const pageEl of pages) {
      const isSummary = pageEl === summaryPage;
      const pageW = pageEl.offsetWidth;
      const pageH = pageEl.offsetHeight;

      // Masquer les éléments UI (inputs, boutons, placeholders)
      const hidden = pageEl.querySelectorAll(
        '.cat-remove-btn, .cat-url-row, .cat-drop-placeholder, .sum-qty-input'
      );
      hidden.forEach(el => (el.style.visibility = 'hidden'));

      // Neutraliser le pseudo-élément ::after de la cover (halo radial)
      // html2canvas ne coupe pas overflow:hidden sur l'élément racine
      const isCover = pageEl.classList.contains('cat-cover');
      if (isCover) pageEl.classList.add('pdf-rendering');

      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f5f6f8',
        width: pageW,
        height: pageH,
        logging: false,
      });

      hidden.forEach(el => (el.style.visibility = ''));
      if (isCover) pageEl.classList.remove('pdf-rendering');

      // Intégrer l'image dans le PDF
      const pdfPage = pdfDoc.addPage([PDF_W, PDF_H]);
      const imgData  = canvas.toDataURL('image/jpeg', 0.92);
      const imgBytes = Uint8Array.from(atob(imgData.split(',')[1]), c => c.charCodeAt(0));
      const jpgImage = await pdfDoc.embedJpg(imgBytes);
      pdfPage.drawImage(jpgImage, { x: 0, y: 0, width: PDF_W, height: PDF_H });

      // ── Ajouter les champs de formulaire sur la page récapitulatif ────
      if (isSummary && qtyPositions.length) {
        const form = pdfDoc.getForm();
        const sx   = PDF_W / pageW;
        const sy   = PDF_H / pageH;

        qtyPositions.forEach((pos, i) => {
          const field = form.createTextField(`qte_vehicule_${i + 1}`);
          field.addToPage(pdfPage, {
            x:               pos.x * sx,
            y:               PDF_H - (pos.y + pos.h) * sy,
            width:           pos.w * sx,
            height:          pos.h * sy,
            borderWidth:     1.5,
            borderColor:     rgb(0.78, 0.82, 0.99),   // #c7d2fe
            backgroundColor: rgb(0.94, 0.97, 1.00),   // #eff6ff
            textColor:       rgb(0.11, 0.31, 0.87),   // #1d4ed8
          });
        });
      }
    }

    const bytes = await pdfDoc.save();
    const blob  = new Blob([bytes], { type: 'application/pdf' });
    const a     = document.createElement('a');
    a.href      = URL.createObjectURL(blob);
    a.download  = `catalogue_revio_${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);

  } finally {
    btn.textContent = label;
    btn.disabled    = false;
  }
}
