// ══════════════════════════════
// HELPERS
// ══════════════════════════════
export function fmtNum(val, dec = 0) {
  const n = parseFloat(val);
  if (isNaN(n)) return val || '—';
  if (dec === 0) return Math.round(n).toLocaleString('fr-FR');
  return n.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export function fmtEur(val, dec = 0) { return fmtNum(val, dec) + '\u00a0€'; }

export function isElec(energy) {
  const e = (energy || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return e.includes('electrique') || e.includes('bev') || e === 'ev';
}

export function energyBadge(energy) {
  const e = (energy || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (e.includes('electrique') || e.includes('bev') || e === 'ev') return { text: 'Électrique', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
  if (e.includes('plug') || e.includes('rechargeable')) return { text: 'Hybride rechargeable', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
  if (e.includes('hybride')) return { text: 'Hybride', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
  if (e.includes('diesel')) return { text: 'Diesel', bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' };
  return { text: 'Essence', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' };
}

export function fmtDate(raw) {
  const d = new Date(raw);
  if (isNaN(d)) return raw || '';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function capitalize(s) {
  return s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
