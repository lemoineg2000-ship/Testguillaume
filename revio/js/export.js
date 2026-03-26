// ══════════════════════════════
// DOWNLOAD HTML
// ══════════════════════════════
export function downloadHTML() {
  const doctype = '<!DOCTYPE html>\n';
  const head = `<html lang="fr"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Catalogue Revio</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>${extractPrintCSS()}</style>
</head><body>`;
  const pagesHTML = document.getElementById('pages-container').innerHTML;
  const footer = '</body></html>';
  const blob = new Blob([doctype + head + pagesHTML + footer], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `catalogue_revio_${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
}

function extractPrintCSS() {
  return `
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;background:#d1d5db;color:#111827;}
  .page-counter{font-size:11px;color:#6b7280;background:white;border-radius:20px;padding:3px 12px;font-weight:500;width:fit-content;margin:16px auto 0;}
  .pages-container{padding:24px 0 40px;display:flex;flex-direction:column;align-items:center;gap:24px;}
  .cat-page{width:1122px;height:794px;background:#f5f6f8;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.18);}
  .cat-topbar{background:#fff;border-bottom:1px solid #e8eaed;padding:0 28px;height:46px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
  .cat-topbar-left{display:flex;align-items:center;gap:14px;}
  .cat-logo{display:flex;align-items:center;} .cat-logo img{height:26px;width:auto;}
  .cat-topbar-date{font-size:12px;color:#9ca3af;}
  .cat-topbar-right{font-size:12px;color:#6b7280;font-weight:500;}
  .cat-body{display:grid;grid-template-columns:1fr 320px;gap:16px;padding:16px 16px 12px;flex:1;min-height:0;align-items:stretch;}
  .cat-left{display:flex;flex-direction:column;gap:12px;min-height:0;}
  .cat-right{display:flex;flex-direction:column;gap:10px;min-height:0;}
  .cat-card{background:#fff;border-radius:12px;border:1px solid #e8eaed;padding:14px 18px;}
  .cat-card-title{font-size:10px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.8px;margin-bottom:9px;}
  .cat-vehicle-card{flex:1;display:flex;flex-direction:column;min-height:0;}
  .cat-vehicle-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:3px;}
  .cat-vehicle-title{font-size:20px;font-weight:700;color:#111827;}
  .cat-vehicle-subtitle{font-size:12px;color:#9ca3af;margin-bottom:12px;}
  .cat-badge{font-size:12px;font-weight:600;padding:0 13px;height:32px;border-radius:20px;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;}
  .cat-img-wrapper{flex:1;min-height:220px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;position:relative;overflow:hidden;cursor:pointer;background:#f8faff;border:2px dashed #c7d2fe;}
  .cat-img-wrapper.has-image{border:none;cursor:default;}
  .cat-drop-placeholder{display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;}
  .cat-drop-icon{font-size:30px;opacity:.3;}
  .cat-drop-text{font-size:13px;font-weight:600;color:#6366f1;}
  .cat-drop-sub{font-size:11px;color:#a5b4fc;}
  .cat-img-el{display:none;width:100%;height:100%;object-fit:cover;border-radius:8px;position:absolute;top:0;left:0;}
  .cat-remove-btn{position:absolute;top:8px;right:8px;background:rgba(0,0,0,.5);color:#fff;border:none;border-radius:50%;width:26px;height:26px;font-size:13px;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:10;}
  .cat-specs-row{display:grid;grid-template-columns:1fr 1fr;flex-shrink:0;}
  .cat-spec-item{padding:7px 0;border-top:1px solid #f3f4f6;}
  .cat-spec-item:nth-child(odd){padding-right:18px;}
  .cat-spec-item:nth-child(even){padding-left:18px;border-left:1px solid #f3f4f6;}
  .cat-spec-key{font-size:9px;font-weight:600;color:#9ca3af;letter-spacing:.8px;text-transform:uppercase;margin-bottom:2px;}
  .cat-spec-val{font-size:14px;font-weight:600;color:#111827;}
  .cat-eco-val{color:#059669!important;font-size:13px;}
  .cat-eco-badge{background:#f0fdf4;}
  .cat-eco-pill{background:#eff6ff!important;color:#1d4ed8!important;border:1px solid #bfdbfe!important;}
  .cat-services-card{padding:12px 16px;flex-shrink:0;}
  .cat-services-card .cat-card-title{margin-bottom:8px;}
  .cat-services-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .cat-service-item{display:flex;gap:10px;align-items:center;padding:11px 14px;background:#f9fafb;border-radius:8px;}
  .cat-service-emoji{display:flex;align-items:center;flex-shrink:0;width:22px;height:22px;}
  .cat-service-name{font-size:13px;font-weight:600;color:#111827;margin-bottom:2px;}
  .cat-service-desc{font-size:11px;color:#9ca3af;line-height:1.3;}
  .cat-contract-card{padding:16px 20px;flex-shrink:0;}
  .cat-contract-title{font-size:18px;font-weight:700;color:#111827;margin-bottom:14px;padding-bottom:12px;border-bottom:2px solid #f3f4f6;}
  .cat-kpis{display:flex;align-items:center;margin-bottom:16px;}
  .cat-kpi{flex:1;text-align:center;}
  .cat-kpi-val{font-size:28px;font-weight:700;color:#1d4ed8;line-height:1;}
  .cat-kpi-unit{font-size:13px;font-weight:500;color:#6b7280;}
  .cat-kpi-sep{width:1px;height:38px;background:#e5e7eb;margin:0 8px;}
  .cat-kpi-loyer-row{text-align:center;padding:10px 0 14px;border-top:1px solid #f3f4f6;margin-top:-8px;}
  .cat-kpi-loyer-val{font-size:26px;font-weight:700;color:#1d4ed8;line-height:1;margin-bottom:3px;}
  .cat-kpi-loyer-label{font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;}
  .cat-cd-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f3f4f6;font-size:13px;}
  .cat-cd-row:last-child{border-bottom:none;}
  .cat-cd-label{color:#6b7280;}
  .cat-cd-val{font-weight:600;color:#111827;}
  .cat-tco-total{background-color:#1d4ed8;background-image:linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%);border-radius:12px;padding:16px 20px;text-align:center;flex-shrink:0;}
  .cat-tco-label{font-size:10px;font-weight:700;color:rgba(255,255,255,.75);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;}
  .cat-tco-val{font-size:32px;font-weight:700;color:#fff;line-height:1;}
  .cat-comp-card{padding:14px 18px;flex-shrink:0;}
  .cat-comp-line{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;}
  .cat-comp-line:last-child{border-bottom:none;}
  .cat-comp-label{color:#374151;}
  .cat-comp-val{font-weight:600;color:#111827;}
  .cat-options-card{padding:10px 16px;flex-shrink:0;}
  .cat-options-rows{display:grid;grid-template-columns:1fr 1fr;gap:0;overflow:hidden;}
  .cat-opt-row{display:flex;align-items:baseline;padding:4px 6px;border-bottom:1px solid #f3f4f6;gap:4px;}
  .cat-opt-row:last-child{border-bottom:none;}
  .cat-opt-name{font-size:12px;color:#374151;flex:1;line-height:1.4;}
  .cat-opt-price{font-size:12px;font-weight:600;color:#111827;white-space:nowrap;flex-shrink:0;}
  .cat-carac-card{padding:12px 18px;flex-shrink:0;}
  .cat-summary{background:#fff!important;}
  .sum-body{padding:20px 28px 16px;display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;}
  .sum-title{font-size:18px;font-weight:700;color:#111827;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f3f4f6;flex-shrink:0;}
  .sum-table{width:100%;border-collapse:collapse;}
  .sum-head{background:#f8faff;}
  .sum-th{padding:9px 12px;font-size:9px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;text-align:center;border-bottom:2px solid #e5e7eb;border-right:1px dashed #e5e7eb;}
  .sum-th:nth-child(2){text-align:left;}
  .sum-th:last-child{border-right:none;}
  .sum-th-qty{color:#1d4ed8!important;}
  .sum-row{border-bottom:1px dashed #e5e7eb;}
  .sum-row:last-child{border-bottom:none;}
  .sum-td{padding:8px 12px;font-size:12px;color:#374151;vertical-align:middle;text-align:center;border-right:1px dashed #e5e7eb;}
  .sum-td:last-child{border-right:none;}
  .sum-num{color:#d1d5db;font-size:11px;width:28px;}
  .sum-car{text-align:left!important;}
  .sum-car-name{font-size:13px;font-weight:700;color:#111827;}
  .sum-car-model{font-size:10px;color:#9ca3af;margin-top:1px;}
  .sum-num-val{font-weight:600;color:#111827;}
  .sum-qty-input{width:64px;height:32px;border:2px solid #c7d2fe;border-radius:8px;background:#eff6ff;color:#1d4ed8;font-size:15px;font-weight:700;text-align:center;outline:none;cursor:text;font-family:inherit;-moz-appearance:textfield;}
  .sum-qty-input::-webkit-outer-spin-button,.sum-qty-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
  .sum-qty-input:focus{border-color:#1d4ed8;background:#dbeafe;}
  @media print{
    @page{size:297mm 210mm;margin:0;}
    html,body{margin:0;padding:0;background:white;}
    .pages-container{padding:0;background:white;gap:0;}
    .page-counter{display:none;}
    .cat-page{width:297mm;height:210mm;margin:0;box-shadow:none;page-break-after:always;page-break-inside:avoid;background:#f5f6f8!important;}
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    .cat-drop-placeholder{display:none!important;}
    .cat-remove-btn{display:none!important;}
    .cat-img-wrapper{border:1px solid #e0e7ff!important;}
  }
  `;
}
