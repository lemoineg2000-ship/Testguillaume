// ══════════════════════════════
// PHOTO DRAG & DROP (per page)
// ══════════════════════════════

export function attachPhotoHandlers(idx) {
  const wrap     = document.getElementById(`img-wrap-${idx}`);
  const input    = document.getElementById(`cat-file-${idx}`);
  const rmBtn    = document.getElementById(`cat-rm-${idx}`);
  const urlRow   = document.getElementById(`cat-url-row-${idx}`);
  const urlInput = document.getElementById(`cat-url-${idx}`);
  const urlBtn   = wrap ? wrap.querySelector('.cat-url-btn') : null;
  if (!wrap) return;

  wrap.addEventListener('dragover', e => {
    e.preventDefault(); e.stopPropagation();
    if (!wrap.classList.contains('has-image')) wrap.classList.add('drag-over');
  });
  wrap.addEventListener('dragleave', e => {
    e.stopPropagation();
    wrap.classList.remove('drag-over');
  });
  wrap.addEventListener('drop', e => {
    e.preventDefault(); e.stopPropagation();
    wrap.classList.remove('drag-over');
    if (wrap.classList.contains('has-image')) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadPhoto(file, idx);
  });
  wrap.addEventListener('click', e => {
    if (wrap.classList.contains('has-image')) return;
    if (e.target.closest('.cat-url-row')) return;
    input.click();
  });
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) loadPhoto(file, idx);
  });
  rmBtn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    removePhoto(idx);
  });

  // URL row — stop propagation so wrap click doesn't fire
  if (urlRow) {
    urlRow.addEventListener('click', e => e.stopPropagation());
  }
  if (urlInput) {
    urlInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { loadFromUrl(idx); e.preventDefault(); }
    });
  }
  if (urlBtn) {
    urlBtn.addEventListener('click', e => {
      e.stopPropagation();
      loadFromUrl(idx);
    });
  }
}

export function loadPhoto(file, idx) {
  const reader = new FileReader();
  reader.onload = e => {
    const img    = document.getElementById(`cat-img-${idx}`);
    const ph     = document.getElementById(`cat-ph-${idx}`);
    const wrap   = document.getElementById(`img-wrap-${idx}`);
    const rm     = document.getElementById(`cat-rm-${idx}`);
    const urlRow = document.getElementById(`cat-url-row-${idx}`);
    img.src = e.target.result;
    img.style.display = 'block';
    ph.style.display = 'none';
    if (urlRow) urlRow.style.display = 'none';
    wrap.classList.add('has-image');
    rm.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

export function loadFromUrl(idx) {
  const input  = document.getElementById('cat-url-' + idx);
  const url    = (input ? input.value : '').trim();
  if (!url) return;
  const img    = document.getElementById('cat-img-' + idx);
  const ph     = document.getElementById('cat-ph-' + idx);
  const wrap   = document.getElementById('img-wrap-' + idx);
  const rm     = document.getElementById('cat-rm-' + idx);
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    img.style.display = 'block';
    ph.style.display = 'none';
    const urlRow = document.getElementById('cat-url-row-' + idx);
    if (urlRow) urlRow.style.display = 'none';
    wrap.classList.add('has-image');
    rm.style.display = 'flex';
  };
  img.onerror = () => {
    input.style.borderColor = '#ef4444';
    input.value = '';
    input.placeholder = 'Lien invalide ou inaccessible';
    setTimeout(() => { input.style.borderColor = ''; input.placeholder = '… ou coller un lien image'; }, 2500);
  };
  img.src = url;
}

export function removePhoto(idx) {
  const img    = document.getElementById(`cat-img-${idx}`);
  const ph     = document.getElementById(`cat-ph-${idx}`);
  const wrap   = document.getElementById(`img-wrap-${idx}`);
  const rm     = document.getElementById(`cat-rm-${idx}`);
  const urlRow = document.getElementById(`cat-url-row-${idx}`);
  const input  = document.getElementById(`cat-file-${idx}`);
  img.src = ''; img.style.display = 'none';
  ph.style.display = 'flex';
  if (urlRow) urlRow.style.display = 'flex';
  wrap.classList.remove('has-image');
  rm.style.display = 'none';
  input.value = '';
}

// ══════════════════════════════
// FIT OPTIONS TEXT TO CARD
// ══════════════════════════════
export function fitOptions(idx) {
  const vehCard = document.getElementById('veh-card-' + idx);
  const optCard = document.getElementById('opt-card-' + idx);
  const imgWrap = document.getElementById('img-wrap-' + idx);
  const optRows = optCard ? optCard.querySelectorAll('.cat-opt-name') : [];
  if (!vehCard || !optCard || !imgWrap || optRows.length === 0) return;

  const MIN_IMG_HEIGHT = 100;

  function tryFit(fontSize, rowPad) {
    optRows.forEach(r => r.style.fontSize = fontSize + 'px');
    optCard.querySelectorAll('.cat-opt-row').forEach(r => r.style.padding = rowPad);
    return imgWrap.getBoundingClientRect().height >= MIN_IMG_HEIGHT;
  }

  // Reset first
  optRows.forEach(r => r.style.fontSize = '');
  optCard.querySelectorAll('.cat-opt-row').forEach(r => r.style.padding = '');

  // Try progressively smaller until photo stays above MIN_IMG_HEIGHT
  const steps = [
    [12, '4px 6px'],
    [11, '4px 6px'],
    [10, '3px 6px'],
  ];

  for (const [size, pad] of steps) {
    if (tryFit(size, pad)) break;
  }
}
