function facCardHtml(f){
  return `<div class="fac-card">
    ${canManageFaculty()?`<button class="ed" data-edit-faculty="${f.id}">✎</button><button class="rm" data-del-faculty="${f.id}">✕</button>`:``}
    <div class="fac-photo">${f.photo_url?`<img src="${esc(f.photo_url)}" alt="${esc(f.name)}">`:esc((f.name||'?')[0])}</div>
    <div class="fac-info"><span>${esc(f.name)}</span><span class="role">${esc(f.role_title||'')}</span></div>
  </div>`;
}

function renderAbout(){
  return `<div class="sec">
    <div class="sec-head"><div><h2>About the department</h2><p>Faculty, facilities and department overview.</p></div></div>
    <div class="about-grid">
      <div>
        <p>The Department of Computer Applications offers an undergraduate BCA program focused on programming, software development, databases and emerging technologies.</p>
        <p>The department maintains modern computer labs, an active student association, and runs technical fests, workshops and seminars throughout the academic year.</p>
        <p>Affiliated to University Name. NAAC Accredited institution.</p>
      </div>
      <div>
        <h3 style="font-size:15px; font-weight:500; margin-bottom:14px;">Faculty directory</h3>
        <div class="fac-grid">
          ${state.faculty.map(f=>facCardHtml(f)).join("")}
        </div>
        ${canManageFaculty()?`<button class="add-btn" style="margin-top:14px;" id="addFacultyBtn">+ Add Faculty</button>`:``}
      </div>
    </div>
  </div>`;
}

  if(m.type==='report') return overlay(`
    ...existing report modal html...
    </div>`);
  
  if(m.type==='faculty') return overlay(`
    <h3>${m.editId?'Edit faculty':'Add faculty'}</h3>
    <div class="field"><label>Name</label><input id="facName" placeholder="e.g. Anupama T" value="${esc(m.data?.name||'')}"></div>
    <div class="field"><label>Role / Title</label><input id="facRole" placeholder="e.g. Head of Department" value="${esc(m.data?.role_title||'')}"></div>
    <div class="field"><label>${m.editId?'Replace Photo (optional)':'Photo (optional)'}</label><input id="facFile" type="file" accept="image/*"></div>
    ${m.editId?`<div class="hint">Leave file empty to keep current photo.</div>`:``}
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="facultySubmit">${m.editId?'Save Changes':'Add Faculty'}</button></div>`);

  if(m.type==='lightbox') return `<div class="overlay lightbox-overlay" id="overlayBg">
    ...existing lightbox html...
