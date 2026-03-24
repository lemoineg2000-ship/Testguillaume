// ══════════════════════════════
// CATALOGUE GENERATION — DOM RENDERING
// ══════════════════════════════
import { state } from './state.js';
import { fmtNum, fmtEur, isElec, energyBadge, fmtDate, esc, capitalize } from './helpers.js';
import { ICON_BUILD, ICON_TIRE, ICON_SAFETY, ICON_GEAR, iconImg } from './icons.js';
import { attachPhotoHandlers, fitOptions } from './photo.js';

const LOGO_URL = 'https://framerusercontent.com/images/LJsvdPae39IN7id1ld7qwbmRlg.png?scale-down-to=512&width=1300&height=380';

export function generateCatalogue(rows) {
  state.pageCount = rows.length;
  const container = document.getElementById('pages-container');
  container.innerHTML = '';

  document.getElementById('tb-count').textContent = rows.length;
  document.getElementById('tb-filename').textContent = state.currentFilename;

  // Cover page (no pill)
  const cover = buildCoverPage();
  container.appendChild(cover);

  rows.forEach((r, idx) => {
    // Page counter pill
    const pill = document.createElement('div');
    pill.className = 'page-counter';
    pill.textContent = `Page ${idx + 1} / ${rows.length}`;
    container.appendChild(pill);

    // Build page
    const page = buildPage(r, idx);
    container.appendChild(page);

    // Attach photo drag/drop after DOM insert
    attachPhotoHandlers(idx);
    fitOptions(idx);
  });

  // Summary page only if more than 2 vehicles
  if (rows.length >= 2) {
    const summaryPill = document.createElement('div');
    summaryPill.className = 'page-counter';
    summaryPill.textContent = 'Récapitulatif';
    container.appendChild(summaryPill);
    container.appendChild(buildSummaryPage(rows));
  }

  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('catalogue-screen').style.display = 'block';
}

export function buildCoverPage() {
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const cover = document.createElement('div');
  cover.className = 'cat-page cat-cover';
  cover.innerHTML = `
    <div class="cover-inner">
      <div class="cover-top">
        <div class="cover-logo-row">
          <img src="${LOGO_URL}" alt="Revio" class="cover-logo">
          <div class="cover-logo-sep"></div>
          <div class="cover-client-name">${esc(state.clientName)}</div>
        </div>
        <div class="cover-divider"></div>
        <div class="cover-catalogue-name">${esc(state.catalogueName)}</div>
      </div>
      <div class="cover-notes-wrapper">
        <div class="cover-notes-label">Notes</div>
        <div class="cover-notes" contenteditable="true" data-placeholder="Ajouter des notes pour le client…"></div>
      </div>
      <div class="cover-bottom">
        <div class="cover-date">${today}</div>
        <div class="cover-count">${state.pageCount} véhicule${state.pageCount > 1 ? 's' : ''}</div>
      </div>
    </div>
  `;
  return cover;
}

export function buildSummaryPage(rows) {
  const page = document.createElement('div');
  page.className = 'cat-page cat-summary';

  const rowsHTML = rows.map((r, idx) => {
    const marque    = capitalize(r['Marque'] || '');
    const gen       = capitalize(r['Génération'] || '');
    const modele    = r['Modèle (label)'] || '';
    const badge     = energyBadge(r['Énergie'] || '');
    const loyer     = fmtEur(r['Loyer mensuel (€)'] || 0);
    const tco       = fmtEur(r['TCO mensuel (€)'] || r['TCO / mois (€)'] || 0);
    const coffre    = r['Volume coffre (L)'] ? fmtNum(r['Volume coffre (L)']) + '\u00a0L' : '—';
    const autonomie = isElec(r['Énergie'])
      ? (r['Autonomie batterie'] ? fmtNum(r['Autonomie batterie']) + '\u00a0km' : '—')
      : (r['Consommation'] ? fmtNum(r['Consommation'], 1) + '\u00a0L/100' : '—');
    return `<tr class="sum-row">
      <td class="sum-td sum-num">${idx + 1}</td>
      <td class="sum-td sum-car">
        <div class="sum-car-name">${esc(marque)} ${esc(gen)}</div>
        <div class="sum-car-model">${esc(modele)}</div>
      </td>
      <td class="sum-td">
        <span class="cat-badge" style="background:${badge.bg};color:${badge.color};border:1px solid ${badge.border};font-size:10px;padding:0 8px;height:22px;">${badge.text}</span>
      </td>
      <td class="sum-td sum-num-val">${loyer}</td>
      <td class="sum-td sum-num-val">${tco}</td>
      <td class="sum-td sum-num-val">${coffre}</td>
      <td class="sum-td sum-num-val">${autonomie}</td>
      <td class="sum-td"><div class="sum-qty-line"></div></td>
    </tr>`;
  }).join('');

  page.innerHTML = `
    <div class="cat-topbar">
      <div class="cat-topbar-left">
        <div class="cat-logo"><img src="${LOGO_URL}" alt="Revio" style="height:26px;width:auto;display:block;"></div>
      </div>
      <div class="cat-topbar-right">${esc(state.clientName)}</div>
    </div>
    <div class="sum-body">
      <div class="sum-title">Récapitulatif des véhicules</div>
      <table class="sum-table">
        <thead>
          <tr class="sum-head">
            <th class="sum-th">#</th>
            <th class="sum-th" style="text-align:left;">Véhicule</th>
            <th class="sum-th">Énergie</th>
            <th class="sum-th">Loyer mensuel</th>
            <th class="sum-th">TCO mensuel</th>
            <th class="sum-th">Coffre</th>
            <th class="sum-th">Autonomie / Conso</th>
            <th class="sum-th">Qté</th>
          </tr>
        </thead>
        <tbody>${rowsHTML}</tbody>
      </table>
    </div>
  `;
  return page;
}

export function buildPage(r, idx) {
  const badge  = energyBadge(r['Énergie'] || '');
  const date   = fmtDate(r['Date/heure'] || '25/02/2026');

  // Services
  const services = [];
  if ((r['Maintenance'] || '').trim()) services.push([iconImg(ICON_BUILD), r['Maintenance'], '']);
  if ((r['Pneus (type)'] || '').trim()) services.push([iconImg(ICON_TIRE), r['Pneus (type)'], r['Pneus (quantité)'] || '']);
  if ((r['Assurance (offre)'] || '').trim()) services.push([iconImg(ICON_SAFETY), 'Assurance', '']);
  if ((r['Véh. remplacement'] || '').trim()) services.push([iconImg(ICON_GEAR), 'Véh. remplacement', r['Véh. remplacement']]);

  const servicesHTML = services.map(([em, name, desc]) => `
    <div class="cat-service-item">
      <div class="cat-service-emoji">${em}</div>
      <div>
        <div class="cat-service-name">${esc(name)}</div>
        ${desc ? `<div class="cat-service-desc">${esc(desc)}</div>` : ''}
      </div>
    </div>`).join('');

  const optRaw   = (r['Détail options'] || '').trim();
  const optTotal = r['Total options (€)'] || '0';
  const optLines = optRaw ? optRaw.split(' | ').map(s => s.trim()).filter(Boolean) : [];

  function capitalizeOpt(str) {
    return str.replace(/^([^(]+)(\(.*\))?$/, (_, name, price) => {
      const cap = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
      return price ? cap + ' ' + price : cap;
    });
  }

  const optRowsHTML = optLines.length > 0
    ? optLines.map(opt => `<div class="cat-opt-row"><span class="cat-opt-name">${esc(capitalizeOpt(opt))}</span></div>`).join('')
    : '<div class="cat-opt-row"><span class="cat-opt-name" style="color:#9ca3af;font-style:italic;">Aucune option</span></div>';

  const marque       = capitalize(r['Marque'] || '');
  const generation   = capitalize(r['Génération'] || '');
  const modele       = r['Modèle (label)'] || '';
  const transmission = r['Transmission'] || '';
  const portes       = r['Portes'] || '';
  const numero       = r['N° demande'] || '';
  const tco          = fmtEur(r['TCO mensuel (€)'] || r['TCO / mois (€)'] || '0');

  const page = document.createElement('div');
  page.className = 'cat-page';
  page.id = `cat-page-${idx}`;
  page.innerHTML = `
    <div class="cat-topbar">
      <div class="cat-topbar-left">
        <div class="cat-logo"><img src="${LOGO_URL}" alt="Revio" style="height:26px;width:auto;display:block;"></div>
        <div class="cat-topbar-date">${date}</div>
      </div>
      <div class="cat-topbar-right">N°\u00a0${esc(numero)}\u00a0·\u00a0${esc(state.clientName)}</div>
    </div>

    <div class="cat-body">
      <div class="cat-left">
        <div class="cat-card cat-vehicle-card" id="veh-card-${idx}">
          <div class="cat-vehicle-header">
            <div>
              <div class="cat-vehicle-title">${esc(marque)} ${esc(generation)}</div>
              <div class="cat-vehicle-subtitle">${esc(modele)}\u00a0·\u00a0${esc(transmission)}\u00a0·\u00a0${esc(portes)} portes${r['Type véhicule'] ? '\u00a0·\u00a0' + esc(r['Type véhicule']) : ''}</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
              <span class="cat-badge" style="background:${badge.bg};color:${badge.color};border:1px solid ${badge.border}">${badge.text}</span>
              ${(r['Eco score'] || '').toLowerCase() === 'oui' ? '<span class="cat-badge cat-eco-pill"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjMWQ0ZWQ4Ij48cGF0aCBkPSJNNDgwLTMwMHE3NSAwIDEyNy41LTUyLjVUNjYwLTQ4MHYtMTgwSDQ4MHEtNzUgMC0xMjcuNSA1Mi41VDMwMC00ODBxMCAyNiA3IDUwdDIxIDQ2bC0xNiAxNnEtMTEgMTEtMTEgMjh0MTEgMjhxMTEgMTEgMjggMTF0MjgtMTFsMTYtMTZxMjIgMTQgNDYgMjF0NTAgN1ptMC04MHEtOSAwLTE4LTJ0LTE4LTVsODQtODVxMTEtMTEgMTEtMjh0LTExLTI4cS0xMS0xMS0yOC0xMXQtMjggMTFsLTg1IDg0cS0zLTktNS0xOHQtMi0xOHEwLTQyIDI5LTcxdDcxLTI5aDEwMHYxMDBxMCA0Mi0yOSA3MXQtNzEgMjlabTIwLTEyMFpNNDgwLTgwcS04MyAwLTE1Ni0zMS41VDE5Ny0xOTdxLTU0LTU0LTg1LjUtMTI3VDgwLTQ4MHEwLTgzIDMxLjUtMTU2VDE5Ny03NjNxNTQtNTQgMTI3LTg1LjVUNDgwLTg4MHE4MyAwIDE1NiAzMS41VDc2My03NjNxNTQgNTQgODUuNSAxMjdUODgwLTQ4MHEwIDgzLTMxLjUgMTU2VDc2My0xOTdxLTU0IDU0LTEyNyA4NS41VDQ4MC04MFptMC04MHExMzQgMCAyMjctOTN0OTMtMjI3cTAtMTM0LTkzLTIyN3QtMjI3LTkzcS0xMzQgMC0yMjcgOTN0LTkzIDIyN3EwIDEzNCA5MyAyMjd0MjI3IDkzWm0wLTMyMFoiLz48L3N2Zz4=" style="width:18px;height:18px;flex-shrink:0;"> Eco Score</span>' : ''}
            </div>
          </div>
          <div class="cat-img-wrapper" id="img-wrap-${idx}">
            <img class="cat-img-el" id="cat-img-${idx}" src="" alt="">
            <div class="cat-drop-placeholder" id="cat-ph-${idx}">
              <div class="cat-drop-icon">🖼️</div>
              <div class="cat-drop-text">Glisser une photo ici</div>
              <div class="cat-drop-sub">ou cliquer pour choisir un fichier</div>
            </div>
            <div class="cat-url-row" id="cat-url-row-${idx}">
              <input type="text" class="cat-url-input" id="cat-url-${idx}" placeholder="… ou coller un lien image">
              <button class="cat-url-btn">→</button>
            </div>
            <input type="file" id="cat-file-${idx}" accept="image/*" style="display:none">
            <button class="cat-remove-btn" id="cat-rm-${idx}" title="Supprimer">✕</button>
          </div>
          <div class="cat-card cat-options-card" id="opt-card-${idx}">
            <div class="cat-card-title">Options</div>
            <div class="cat-options-rows">
              ${optRowsHTML}
            </div>
          </div>
        </div>
        <div class="cat-card cat-services-card">
          <div class="cat-card-title">Services inclus</div>
          <div class="cat-services-grid">${servicesHTML}</div>
        </div>
      </div>

      <div class="cat-right">
        <div class="cat-card cat-contract-card">
          <div class="cat-contract-title">Contrat LLD</div>
          <div class="cat-kpis">
            <div class="cat-kpi"><div class="cat-kpi-val">${fmtNum(r['Durée (mois)'] || 0)}<span class="cat-kpi-unit">\u00a0mois</span></div></div>
            <div class="cat-kpi-sep"></div>
            <div class="cat-kpi"><div class="cat-kpi-val">${fmtNum(r['Kilométrage (km)'] || 0)}<span class="cat-kpi-unit">\u00a0km</span></div></div>
          </div>
          <div class="cat-kpi-loyer-row">
            <div class="cat-kpi-loyer-val">${fmtEur(r['Loyer mensuel (€)'] || 0)}</div>
            <div class="cat-kpi-loyer-label">Loyer mensuel</div>
          </div>
          <div>
            <div class="cat-cd-row"><span class="cat-cd-label">Prix catalogue</span><span class="cat-cd-val">${fmtEur(r['Prix catalogue (€)'] || 0)}</span></div>
            <div class="cat-cd-row"><span class="cat-cd-label">Prix total options</span><span class="cat-cd-val">${fmtEur(optTotal)}</span></div>
          </div>
        </div>
        <div class="cat-tco-total">
          <div class="cat-tco-label">TCO Mensuel</div>
          <div class="cat-tco-val">${tco}</div>
        </div>
        <div class="cat-card cat-comp-card">
          <div class="cat-card-title">Composition du TCO</div>
          <div class="cat-comp-line"><span class="cat-comp-label">Loyer leasing mensuel</span><span class="cat-comp-val">${fmtEur(r['Loyer mensuel (€)'] || 0)}</span></div>
          <div class="cat-comp-line"><span class="cat-comp-label">Coût énergie</span><span class="cat-comp-val">${fmtEur(r['Coût carburant (€)'] || 0)}</span></div>
          <div class="cat-comp-line"><span class="cat-comp-label">TVS mensuelle</span><span class="cat-comp-val">${fmtEur(r['TVS mensuelle (€)'] || 0)}</span></div>
          <div class="cat-comp-line"><span class="cat-comp-label">AND mensuelle</span><span class="cat-comp-val">${fmtEur(r['AND mensuelle (€)'] || 0)}</span></div>
          <div class="cat-comp-line"><span class="cat-comp-label">Ch. patronales AEN</span><span class="cat-comp-val">${fmtEur(r['Charges patronales AEN (€)'] || 0)}</span></div>
        </div>
        <div class="cat-card cat-malus-card">
          <div class="cat-card-title">Malus</div>
          <div class="cat-comp-line"><span class="cat-comp-label">Malus CO₂</span><span class="cat-comp-val">${fmtEur(r['Malus CO2 (€)'] || 0)}</span></div>
          <div class="cat-comp-line"><span class="cat-comp-label">Malus au poids</span><span class="cat-comp-val">${fmtEur(r['Malus au poids (€)'] || 0)}</span></div>
        </div>
        <div class="cat-card cat-carac-card">
          <div class="cat-card-title">Caractéristiques techniques</div>
          ${isElec(r['Énergie']) ?
            '<div class="cat-comp-line"><span class="cat-comp-label">Autonomie</span><span class="cat-comp-val">' + fmtNum(r['Autonomie batterie'] || 0) + '\u00a0km</span></div>' :
            '<div class="cat-comp-line"><span class="cat-comp-label">Consommation</span><span class="cat-comp-val">' + fmtNum(r['Consommation'] || 0, 1) + '\u00a0L/100km</span></div>'
          }
          <div class="cat-comp-line"><span class="cat-comp-label">CO₂</span><span class="cat-comp-val">${fmtNum(r['CO2 (g/km)'] || 0)}\u00a0g/km</span></div>
          <div class="cat-comp-line"><span class="cat-comp-label">Volume coffre</span><span class="cat-comp-val">${fmtNum(r['Volume coffre (L)'] || 0)}\u00a0L</span></div>
        </div>
      </div>
    </div>
  `;

  return page;
}

export function resetToUpload() {
  document.getElementById('catalogue-screen').style.display = 'none';
  document.getElementById('upload-screen').style.display = 'flex';
  document.getElementById('csv-input').value = '';
  document.getElementById('pages-container').innerHTML = '';
}
