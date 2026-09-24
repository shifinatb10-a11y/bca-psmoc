  if(m.type==='report') return overlay(`
    <h3>${m.editId?'Edit report':'Add report'}</h3>
    <div class="field"><label>Title</label><input id="repTitle" placeholder="e.g. Annual Activity Report 2026" value="${esc(m.data?.title||'')}"></div>
    <div class="field"><label>Description</label><textarea id="repDesc" placeholder="Short description">${esc(m.data?.desc||'')}</textarea></div>
    <div class="field"><label>Date</label><input id="repDate" type="text" placeholder="dd/mm/yyyy" maxlength="10" value="${m.data?fmtDate(m.data.date):''}"></div>
    <div class="field"><label>${m.editId?'Replace File (optional)':'File (PDF, optional)'}</label><input id="repFile" type="file" accept=".pdf,image/*"></div>
    ${m.editId ? `<div class="hint">Leave file empty to keep the current file.</div>` : ``}
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="reportSubmit">${m.editId?'Save Changes':'Add Report'}</button></div>`);

  if(m.type==='faculty') return overlay(`
    <h3>${m.editId?'Edit faculty':'Add faculty'}</h3>
    <div class="field"><label>Name</label><input id="facName" placeholder="e.g. Anupama T" value="${esc(m.data?.name||'')}"></div>
    <div class="field"><label>Role / Title</label><input id="facRole" placeholder="e.g. Head of Department" value="${esc(m.data?.role_title||'')}"></div>
    <div class="field"><label>${m.editId?'Replace Photo (optional)':'Photo (optional)'}</label><input id="facFile" type="file" accept="image/*"></div>
    ${m.editId?`<div class="hint">Leave file empty to keep current photo.</div>`:``}
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="facultySubmit">${m.editId?'Save Changes':'Add Faculty'}</button></div>`);

  if(m.type==='lightbox') return `<div class="overlay lightbox-overlay" id="overlayBg">
    <button class="lightbox-close" id="lightboxClose">✕</button>
    <div class="lightbox-body">
      ${m.data.type==='video'
        ? `<video src="${esc(m.data.url)}" controls autoplay></video>`
        : `<img src="${esc(m.data.url)}" alt="${esc(m.data.title)}">`}
      <div class="lightbox-cap"><div class="name">${esc(m.data.title)}</div><div class="prog">${esc(m.data.program||"")}</div></div>
    </div>
  </div>`;
}
function overlay(inner){ return `<div class="overlay" id="overlayBg"><div class="modal">${inner}</div></div>`; }
