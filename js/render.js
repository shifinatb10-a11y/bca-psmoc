function render(){
  const app=document.getElementById('app');
  if(state.loading){ app.innerHTML=`<div class="loading-msg">Loading department portal…</div>`; return; }
  app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div>
        <div class="brand"><div class="brand-mark"></div><div class="brand-text"><div class="t1">PSMO College (Autonomous)</div><div class="t2">BCA DEPARTMENT</div></div></div>
        <div class="sidenav">
          ${sideLink('home','Home')}
          ${canViewPage('events') ? sideLink('events','Programs & Events') : ''}
          ${canViewPage('gallery') ? sideLink('gallery','Galleries') : ''}
          ${canViewPage('reports') ? sideLink('reports','Reports') : ''}
          ${canViewPage('finance') ? sideLink('finance','Finance') : ''}
          ${sideLink('about','About Department')}
        </div>
      </div>
      <div class="side-foot">
        ${state.isAdmin ? `<button class="admin-btn" id="logoutBtn">Log out (Admin)</button>` : `<button class="admin-btn" id="openLogin">Admin Login</button>`}
      </div>
    </aside>
    <div class="main">
      ${state.isAdmin ? `<div class="admin-bar">Logged in as <b>${adminLabel()}</b>${adminScopeNote()}</div>` : ``}
      ${renderPage()}
      <footer><div>© 2026 BCA Department, PSMO College (Autonomous).</div><div>Designed for BCA Students &amp; Faculty</div></footer>
    </div>
  </div>
  ${state.modal ? renderModal() : ""}
  `;
  bindEvents();
}
function sideLink(page,label){ return `<div class="navlink ${state.page===page?'active':''}" data-nav="${page}"><span class="dot"></span>${label}</div>`; }

function adminLabel(){
  return { super:'Admin', media:'Media Admin', finance:'Finance Admin', events:'Events Admin' }[state.role] || 'Admin';
}
function adminScopeNote(){
  const notes = {
    super: ' — manage events, gallery, finance and reports.',
    media: ' — manage gallery only.',
    finance: ' — manage finance only.',
    events: ' — manage events and reports only.'
  };
  return notes[state.role] || '';
}

function renderPage(){
  if(!canViewPage(state.page)) state.page='home';
  if(state.page==='home') return renderHome();
  if(state.page==='events') return renderEvents();
  if(state.page==='gallery') return renderGallery();
  if(state.page==='finance') return renderFinance();
  if(state.page==='reports') return renderReports();
  if(state.page==='about') return renderAbout();
  return "";
}

function renderHome(){
  const upcoming=state.events.filter(e=>e.status==='upcoming').sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,3);
  const done=state.events.filter(e=>e.status==='done').sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
  const galPreview=state.gallery.slice(0,4);
  return `
  <div class="hero">
    <div class="eyebrow">PSMO COLLEGE (AUTONOMOUS) · TIRURANGADI</div>
    <h1>Department of<br>Computer Applications</h1>
    <p>Program schedules, technical events, photo &amp; video archives, and financial records for the BCA department — open to all.</p>
    <div class="hero-cta"><button class="btn-primary" data-nav="events">Program Schedules</button><button class="btn-ghost" data-nav="gallery">View Galleries</button></div>
  </div>
  <div class="stats-row">
    <div class="stat"><div class="num">120+</div><div class="lbl">BCA Students</div></div>
    <div class="stat"><div class="num">${state.events.filter(e=>e.status==='done').length}+</div><div class="lbl">Events Completed</div></div>
    <div class="stat"><div class="num">${state.faculty.length || 0}</div><div class="lbl">Faculty Members</div></div>
    <div class="stat"><div class="num">60+</div><div class="lbl">Lab Systems</div></div>
  </div>
  <div class="sec">
    <div class="sec-head"><div><h2>Upcoming programs</h2><p>Workshops, seminars and technical events.</p></div><span class="viewall" data-nav="events">View all →</span></div>
    ${upcoming.length===0?`<div class="empty">No upcoming events right now. Check back soon.</div>`:upcoming.map(e=>evRowHtml(e)).join("")}
  </div>
  <div class="sec">
    <div class="sec-head"><div><h2>Already done programs</h2><p>Past events with summaries and highlights.</p></div><span class="viewall" data-nav="events">View archives →</span></div>
    ${done.length===0?`<div class="empty">No past programs recorded yet.</div>`:done.map(e=>evRowHtml(e)).join("")}
  </div>
  <div class="sec">
    <div class="sec-head"><div><h2>Department galleries</h2><p>Student life, labs and celebrations.</p></div><span class="viewall" data-nav="gallery">Open full gallery →</span></div>
    ${galPreview.length===0?`<div class="empty">No gallery items yet.</div>`:`<div class="gal-grid">${galPreview.map(g=>galCardHtml(g)).join("")}</div>`}
  </div>`;
}

function evRowHtml(e){
  const meta=[e.category, e.venue, e.time_schedule, e.coordinator?`Coordinator: ${e.coordinator}`:'', e.guest_speaker?`Guest: ${e.guest_speaker}`:''].filter(Boolean);
  return `<div class="ev-row">
    <div class="ev-thumb"><img src="${esc(e.img||'https://placehold.co/300x300/0a1120/7a88a8?text=No+Image')}" alt="${esc(e.title)}" onerror="this.src='https://placehold.co/300x300/0a1120/7a88a8?text=Image+unavailable'"></div>
    <div class="ev-date">${fmtDate(e.date)}</div>
    <div class="ev-body">
      <div class="ev-title">${esc(e.title)}</div>
      ${meta.length ? `<div class="ev-meta">${meta.map(esc).join(' · ')}</div>` : ''}
      <div class="ev-desc">${esc(e.desc||"")}</div>
    </div>
    <span class="ev-tag ${e.status==='upcoming'?'tag-up':'tag-done'}">${e.status==='upcoming'?'Upcoming':'Completed'}</span>
    ${canManage('events')?`<button class="edit-x" data-edit-event="${e.id}">✎</button><button class="del-x" data-del-event="${e.id}">✕</button>`:``}
  </div>`;
}
function galCardHtml(g){
  return `<div class="gcard">
    ${canManage('gallery')?`<button class="ed" data-edit-gallery="${g.id}">✎</button><button class="rm" data-del-gallery="${g.id}">✕</button>`:``}
    <div class="mw" data-open-gallery="${g.id}" style="cursor:pointer">${g.type==='video'?`<video src="${esc(g.url)}" muted></video>`:`<img src="${esc(g.url)}" alt="${esc(g.title)}" onerror="this.src='https://placehold.co/500x500/0a1120/7a88a8?text=Image+unavailable'">`}</div>
    <div class="cap"><div class="name">${esc(g.title)}</div><div class="prog">${esc(g.program||"")}</div></div>
  </div>`;
}

function facCardHtml(f) {
  const initial = esc((f.name || '?').trim().charAt(0).toUpperCase() || '?');
  return `<div class="fac-card">
    <div class="fac-photo">${f.photo_url ? `<img src="${esc(f.photo_url)}" alt="${esc(f.name)}" onerror="this.closest('.fac-photo').innerHTML='${initial}'">` : initial}</div>
    ${canManage('faculty') ? `<button class="edit-x" data-edit-faculty="${f.id}">✎</button><button class="del-x" data-del-faculty="${f.id}">✕</button>` : ``}
    <div class="fac-info"><span>${esc(f.name)}</span><span class="role">${esc(f.role)}</span></div>
  </div>`;
}

function renderEvents(){
  const list=state.events.filter(e=>e.status===state.eventsTab).sort((a,b)=>state.eventsTab==='upcoming'?new Date(a.date)-new Date(b.date):new Date(b.date)-new Date(a.date));
  return `<div class="sec">
    <div class="sec-head"><div><h2>Programs &amp; events</h2><p>Upcoming activities and a record of programs already conducted.</p></div>${canManage('events')?`<button class="add-btn" id="addEventBtn">+ Add Event</button>`:``}</div>
    <div class="tabs"><button class="tabbtn ${state.eventsTab==='upcoming'?'active':''}" data-etab="upcoming">Upcoming</button><button class="tabbtn ${state.eventsTab==='done'?'active':''}" data-etab="done">Already Done</button></div>
    ${list.length===0?`<div class="empty">No ${state.eventsTab==='upcoming'?'upcoming':'past'} events yet.</div>`:list.map(e=>evRowHtml(e)).join("")}
  </div>`;
}

function renderGallery(){
  return `<div class="sec">
    <div class="sec-head"><div><h2>Galleries</h2><p>Photos and videos from department programs, workshops and events.</p></div>${canManage('gallery')?`<button class="add-btn" id="addGalleryBtn">+ Add Image / Video</button>`:``}</div>
    ${state.gallery.length===0?`<div class="empty">No gallery items yet.</div>`:`<div class="gal-grid">${state.gallery.map(g=>galCardHtml(g)).join("")}</div>`}
  </div>`;
}

function renderFinance(){
  const income=state.finance.filter(f=>f.type==='income').reduce((s,f)=>s+Number(f.amount),0);
  const expense=state.finance.filter(f=>f.type==='expense').reduce((s,f)=>s+Number(f.amount),0);
  const rows=[...state.finance].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return `<div class="sec">
    <div class="sec-head"><div><h2>Financial management</h2><p>Transparent record of department income and expenses.</p></div>${canManage('finance')?`<button class="add-btn" id="addFinanceBtn">+ Add Entry</button>`:``}</div>
    <div class="fin-row">
      <div class="fin-cell"><div class="l">Total Income</div><div class="v pos">${fmtMoney(income)}</div></div>
      <div class="fin-cell"><div class="l">Total Expense</div><div class="v neg">${fmtMoney(expense)}</div></div>
      <div class="fin-cell"><div class="l">Balance</div><div class="v">${fmtMoney(income-expense)}</div></div>
    </div>
    ${rows.length===0?`<div class="empty">No financial records yet.</div>`:`
    <table><thead><tr><th>Date</th><th>Description</th><th>Given By / To</th><th>Mode</th><th>Type</th><th>Amount</th>${canManage('finance')?'<th></th>':''}</tr></thead>
    <tbody>${rows.map(f=>`<tr><td>${fmtDate(f.date)}</td><td>${esc(f.desc)}</td><td>${esc(f.given_by||'—')}</td><td>${esc(f.mode||'—')}</td><td style="text-transform:capitalize">${f.type}</td><td class="${f.type==='income'?'amt-in':'amt-out'}">${f.type==='income'?'+':'-'}${fmtMoney(f.amount)}</td>${canManage('finance')?`<td><button class="edit-x" data-edit-finance="${f.id}">✎</button><button class="del-x" data-del-finance="${f.id}">✕</button></td>`:''}</tr>`).join("")}</tbody></table>`}
  </div>`;
}

function renderReports(){
  const rows=[...state.reports].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return `<div class="sec">
    <div class="sec-head"><div><h2>Reports</h2><p>Department reports and official documents.</p></div>${canManage('reports')?`<button class="add-btn" id="addReportBtn">+ Add Report</button>`:``}</div>
    ${rows.length===0?`<div class="empty">No reports published yet.</div>`:`
    <div class="event-list">
      ${rows.map(r=>`<div class="ev-row">
        <div class="ev-date">${fmtDate(r.date)}</div>
        <div class="ev-body"><div class="ev-title">${esc(r.title)}</div><div class="ev-desc">${esc(r.desc||"")}</div></div>
        ${r.file_url ? `<a class="btn-ghost" style="padding:8px 16px; font-size:13px;" href="${esc(r.file_url)}" target="_blank" rel="noopener">View</a>` : ``}
        ${canManage('reports')?`<button class="edit-x" data-edit-report="${r.id}">✎</button><button class="del-x" data-del-report="${r.id}">✕</button>`:``}
      </div>`).join("")}
    </div>`}
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
        <div class="sec-head fac-head">
          <h3 style="font-size:15px; font-weight:500; margin-bottom:0;">Faculty directory</h3>
          ${canManage('faculty') ? `<button class="add-btn" id="addFacultyBtn">+ Add Faculty</button>` : ``}
        </div>
        ${state.facultyError ? `<div class="err-msg">${esc(state.facultyError)}</div>` : ''}
        ${state.faculty.length === 0
          ? `<div class="empty">No faculty members added yet.</div>`
          : `<div class="fac-grid">${state.faculty.map(f => facCardHtml(f)).join('')}</div>`}
      </div>
    </div>
  </div>`;
}

function renderModal(){
  const m=state.modal;
  if(m.type==='login') return overlay(`
    <h3>Admin login</h3>
    <div class="field">
  <label>Email</label>
  <input
    id="loginUser"
    type="email"
    autocomplete="email"
    placeholder="admin@example.com"
  >
</div>
    <div class="field">
  <label>Password</label>
  <input
    id="loginPass"
    type="password"
    autocomplete="current-password"
  >
</div>
    ${state.loginError?`<div class="err-msg">${esc(state.loginError)}</div>`:``}
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="loginSubmit">Log in</button></div>`);
  if(m.type==='event') return overlay(`
    <h3>${m.editId?'Edit event':'Add event'}</h3>
    <div class="field"><label>Event Title *</label><input id="fTitle" placeholder="e.g. Annual Tech Fest" value="${esc(m.data?.title||'')}"></div>
    <div class="field"><label>Category</label><select id="fCategory">
      ${['Workshop','Seminar','Hackathon','Guest Lecture','Fest','Industry Visit','Other'].map(c=>`<option ${m.data?.category===c?'selected':''}>${c}</option>`).join("")}
    </select></div>
    <div class="field"><label>Date (dd/mm/yyyy) *</label><input id="fDate" type="text" placeholder="dd/mm/yyyy" maxlength="10" value="${m.data?fmtDate(m.data.date):''}"></div>
    <div class="field"><label>Time Schedule</label><input id="fTime" placeholder="e.g. 10:00 AM - 4:00 PM" value="${esc(m.data?.time_schedule||'')}"></div>
    <div class="field"><label>Venue / Lab Room</label><input id="fVenue" placeholder="e.g. Seminar Hall" value="${esc(m.data?.venue||'')}"></div>
    <div class="field"><label>Faculty / Student Coordinator</label><input id="fCoordinator" placeholder="e.g. Anupama T" value="${esc(m.data?.coordinator||'')}"></div>
    <div class="field"><label>Guest Speaker / Jury</label><input id="fGuest" placeholder="Optional" value="${esc(m.data?.guest_speaker||'')}"></div>
    <div class="field"><label>Description / Scope *</label><textarea id="fDesc" placeholder="Short description">${esc(m.data?.desc||'')}</textarea></div>
    <div class="field"><label>Status</label><select id="fStatus"><option value="upcoming" ${m.data?.status==='upcoming'?'selected':''}>Upcoming</option><option value="done" ${m.data?.status==='done'?'selected':''}>Already Done</option></select></div>
    <div class="field"><label>${m.editId ? 'Replace Image (optional)' : 'Image'}</label><input id="fImgFile" type="file" accept="image/*"></div>
    <div class="hint">${m.editId ? 'Leave empty to keep the current image.' : 'Optional — leave empty for a placeholder.'}</div>
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="eventSubmit">${m.editId?'Save Changes':'Add Event'}</button></div>`);
  if(m.type==='gallery') return overlay(`
    <h3>${m.editId?'Edit gallery item':'Add gallery item'}</h3>
    <div class="field"><label>${m.editId ? 'Replace File (optional)' : 'File'}</label><input id="gFile" type="file" accept="image/*,video/*"></div>
    <div class="hint">${m.editId ? 'Leave file empty to keep the current media.' : 'Image or video type is detected automatically from the file.'}</div>
    <div class="field"><label>Title</label><input id="gTitle" placeholder="e.g. Orientation Day" value="${esc(m.data?.title||'')}"></div>
    <div class="field"><label>Program / Event name</label><input id="gProgram" placeholder="e.g. Tech Fest 2026" value="${esc(m.data?.program||'')}"></div>
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="gallerySubmit">${m.editId?'Save Changes':'Add Item'}</button></div>`);
  if(m.type==='faculty') return overlay(`
    <h3>${m.editId?'Edit faculty member':'Add faculty member'}</h3>
    <div class="field"><label>Name *</label><input id="facultyName" placeholder="e.g. Anupama T" value="${esc(m.data?.name||'')}"></div>
    <div class="field"><label>Role *</label><input id="facultyRole" placeholder="e.g. Head of Department" value="${esc(m.data?.role||'')}"></div>
    <div class="field"><label>${m.editId?'Replace Photo (optional)':'Photo (optional)'}</label><input id="facultyPhoto" type="file" accept="image/*"></div>
    <div class="hint">Accepted image formats only. Maximum file size: 5MB.</div>
    ${m.error ? `<div class="err-msg">${esc(m.error)}</div>` : ``}
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="facultySubmit">${m.editId?'Save Changes':'Add Faculty'}</button></div>`);

  if(m.type==='finance') return overlay(`
    <h3>${m.editId?'Edit financial entry':'Add financial entry'}</h3>
    <div class="field"><label>Description</label><input id="finDesc" placeholder="e.g. Lab Fee Collection" value="${esc(m.data?.desc||'')}"></div>
    <div class="field"><label>Type</label><select id="finType"><option value="income" ${m.data?.type==='income'?'selected':''}>Income</option><option value="expense" ${m.data?.type==='expense'?'selected':''}>Expense</option></select></div>
    <div class="field"><label>Amount (₹)</label><input id="finAmount" type="number" placeholder="0" value="${m.data?.amount??''}"></div>
    <div class="field"><label>Date</label><input id="finDate" type="text" placeholder="dd/mm/yyyy" maxlength="10" value="${m.data?fmtDate(m.data.date):''}"></div>
    <div class="field"><label id="finGivenByLabel">${m.data?.type==='expense'?'Given To':'Given By'}</label><input id="finGivenBy" placeholder="${m.data?.type==='expense'?'e.g. Vendor / Person paid':'e.g. Student name / Department'}" value="${esc(m.data?.given_by||'')}"></div>
    <div class="field"><label>Mode of Transaction</label><select id="finMode">
      ${['Cash','Online Transfer','UPI','Cheque','Card','Other'].map(mo=>`<option ${m.data?.mode===mo?'selected':''}>${mo}</option>`).join("")}
    </select></div>
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="financeSubmit">${m.editId?'Save Changes':'Add Entry'}</button></div>`);
  if(m.type==='report') return overlay(`
    <h3>${m.editId?'Edit report':'Add report'}</h3>
    <div class="field"><label>Title</label><input id="repTitle" placeholder="e.g. Annual Activity Report 2026" value="${esc(m.data?.title||'')}"></div>
    <div class="field"><label>Description</label><textarea id="repDesc" placeholder="Short description">${esc(m.data?.desc||'')}</textarea></div>
    <div class="field"><label>Date</label><input id="repDate" type="text" placeholder="dd/mm/yyyy" maxlength="10" value="${m.data?fmtDate(m.data.date):''}"></div>
    <div class="field"><label>${m.editId?'Replace File (optional)':'File (PDF, optional)'}</label><input id="repFile" type="file" accept=".pdf,image/*"></div>
    ${m.editId ? `<div class="hint">Leave file empty to keep the current file.</div>` : ``}
    <div class="modal-actions"><button class="btn-cancel" id="modalCancel">Cancel</button><button class="btn-primary" id="reportSubmit">${m.editId?'Save Changes':'Add Report'}</button></div>`);
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
