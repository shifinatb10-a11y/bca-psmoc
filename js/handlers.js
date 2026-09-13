function bindEvents(){
  document.querySelectorAll('[data-nav]').forEach(el=>{ el.onclick=()=>{ state.page=el.getAttribute('data-nav'); if(state.page==='finance' && state.isAdmin) loadAll(); else render(); }; });
  const openLogin=document.getElementById('openLogin'); if(openLogin) openLogin.onclick=()=>{ state.modal={type:'login'}; state.loginError=""; render(); };
  const logoutBtn=document.getElementById('logoutBtn'); if(logoutBtn) logoutBtn.onclick=()=>{ state.isAdmin=false; if(state.page==='finance') state.page='home'; render(); };
  document.querySelectorAll('[data-etab]').forEach(el=>{ el.onclick=()=>{ state.eventsTab=el.getAttribute('data-etab'); render(); }; });
  const addEventBtn=document.getElementById('addEventBtn'); if(addEventBtn) addEventBtn.onclick=()=>{ state.modal={type:'event'}; render(); };
  const fDateEl=document.getElementById('fDate'); if(fDateEl) autoSlash(fDateEl);
  const finDateEl=document.getElementById('finDate'); if(finDateEl) autoSlash(finDateEl);
  const addGalleryBtn=document.getElementById('addGalleryBtn'); if(addGalleryBtn) addGalleryBtn.onclick=()=>{ state.modal={type:'gallery'}; render(); };
  const addFinanceBtn=document.getElementById('addFinanceBtn'); if(addFinanceBtn) addFinanceBtn.onclick=()=>{ state.modal={type:'finance'}; render(); };
  const addReportBtn=document.getElementById('addReportBtn'); if(addReportBtn) addReportBtn.onclick=()=>{ state.modal={type:'report'}; render(); };
  const repDateEl=document.getElementById('repDate'); if(repDateEl) autoSlash(repDateEl);

  document.querySelectorAll('[data-del-event]').forEach(el=>{ el.onclick=async()=>{ if(!confirm('Delete this event? This cannot be undone.')) return; await deleteEventRow(el.getAttribute('data-del-event')); await loadAll(); }; });
  document.querySelectorAll('[data-del-gallery]').forEach(el=>{ el.onclick=async()=>{ if(!confirm('Delete this gallery item? This cannot be undone.')) return; await deleteGalleryRow(el.getAttribute('data-del-gallery')); await loadAll(); }; });
  document.querySelectorAll('[data-del-finance]').forEach(el=>{ el.onclick=async()=>{ if(!confirm('Delete this financial entry? This cannot be undone.')) return; await deleteFinanceRow(el.getAttribute('data-del-finance')); await loadAll(); }; });
  document.querySelectorAll('[data-del-report]').forEach(el=>{ el.onclick=async()=>{ if(!confirm('Delete this report? This cannot be undone.')) return; await deleteReportRow(el.getAttribute('data-del-report')); await loadAll(); }; });

  document.querySelectorAll('[data-edit-event]').forEach(el=>{ el.onclick=()=>{ const id=el.getAttribute('data-edit-event'); const data=state.events.find(e=>e.id===id); state.modal={type:'event',editId:id,data}; render(); }; });
  document.querySelectorAll('[data-edit-gallery]').forEach(el=>{ el.onclick=()=>{ const id=el.getAttribute('data-edit-gallery'); const data=state.gallery.find(g=>g.id===id); state.modal={type:'gallery',editId:id,data}; render(); }; });
  document.querySelectorAll('[data-edit-finance]').forEach(el=>{ el.onclick=()=>{ const id=el.getAttribute('data-edit-finance'); const data=state.finance.find(f=>f.id===id); state.modal={type:'finance',editId:id,data}; render(); }; });
  document.querySelectorAll('[data-edit-report]').forEach(el=>{ el.onclick=()=>{ const id=el.getAttribute('data-edit-report'); const data=state.reports.find(r=>r.id===id); state.modal={type:'report',editId:id,data}; render(); }; });

  document.querySelectorAll('[data-open-gallery]').forEach(el=>{ el.onclick=()=>{ const id=el.getAttribute('data-open-gallery'); const data=state.gallery.find(g=>g.id===id); if(data) { state.modal={type:'lightbox', data}; render(); } }; });
  const lightboxClose=document.getElementById('lightboxClose'); if(lightboxClose) lightboxClose.onclick=()=>{ state.modal=null; render(); };
  const overlayBg=document.getElementById('overlayBg'); if(overlayBg) overlayBg.onclick=(ev)=>{ if(ev.target.id==='overlayBg'){ state.modal=null; render(); } };
  const modalCancel=document.getElementById('modalCancel'); if(modalCancel) modalCancel.onclick=()=>{ state.modal=null; render(); };

  const loginSubmit=document.getElementById('loginSubmit');
  if(loginSubmit) loginSubmit.onclick=async()=>{
    const u=document.getElementById('loginUser').value.trim();
    const p=document.getElementById('loginPass').value;
    if(u===DEFAULT_ADMIN.username && p===DEFAULT_ADMIN.password){
      state.isAdmin=true; state.modal=null; state.loginError="";
      await loadAll(); // re-fetch so finance rows load now that isAdmin is true
    } else { state.loginError="Incorrect username or password."; render(); }
  };

  const eventSubmit=document.getElementById('eventSubmit');
  if(eventSubmit) eventSubmit.onclick=async()=>{
    const title=document.getElementById('fTitle').value.trim();
    const category=document.getElementById('fCategory').value;
    const date=parseDMY(document.getElementById('fDate').value.trim());
    const time_schedule=document.getElementById('fTime').value.trim();
    const venue=document.getElementById('fVenue').value.trim();
    const coordinator=document.getElementById('fCoordinator').value.trim();
    const guest_speaker=document.getElementById('fGuest').value.trim();
    const desc=document.getElementById('fDesc').value.trim();
    const status=document.getElementById('fStatus').value;
    if(!title||!date||!desc) return;
    const editId=state.modal.editId;
    const file=document.getElementById('fImgFile').files[0];

    let image_url = state.modal.data?.image_url || null; // keep existing on edit if no new file
    if(file){
      eventSubmit.disabled=true; eventSubmit.textContent='Uploading...';
      const path = `events/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g,'_')}`;
      const { error: upErr } = await sb.storage.from('gallery').upload(path, file);
      if(upErr){ console.error(upErr); alert('Upload failed: '+upErr.message); eventSubmit.disabled=false; eventSubmit.textContent='Add Event'; return; }
      const { data: pub } = sb.storage.from('gallery').getPublicUrl(path);
      image_url = pub.publicUrl;
    }

    const payload={title,category,date,time_schedule,venue,coordinator,guest_speaker,desc,status,image_url};
    if(editId) await updateEventRow(editId, payload);
    else await saveEventRow(payload);
    state.modal=null; state.page='events'; state.eventsTab=status;
    await loadAll();
  };

  const gallerySubmit=document.getElementById('gallerySubmit');
  if(gallerySubmit) gallerySubmit.onclick=async()=>{
    const title=document.getElementById('gTitle').value.trim();
    const program=document.getElementById('gProgram').value.trim();
    const fileInput=document.getElementById('gFile');
    const file=fileInput.files[0];
    const editId=state.modal.editId;
    if(!title) return;
    if(!file && !editId) return; // new item needs a file

    let url = state.modal.data?.url; // keep existing on edit if no new file
    let type = state.modal.data?.type || 'image';
    if(file){
      type = file.type.startsWith('video/') ? 'video' : 'image'; // detect from actual file, not the dropdown
      gallerySubmit.disabled=true; gallerySubmit.textContent='Uploading...';
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g,'_')}`;
      const { error: upErr } = await sb.storage.from('gallery').upload(path, file);
      if(upErr){ console.error(upErr); alert('Upload failed: '+upErr.message); gallerySubmit.disabled=false; gallerySubmit.textContent='Add Item'; return; }
      const { data: pub } = sb.storage.from('gallery').getPublicUrl(path);
      url = pub.publicUrl;
    }

    if(editId) await updateGalleryRow(editId, {type,url,title,program});
    else await saveGalleryRow({type,url,title,program});
    state.modal=null;
    await loadAll();
  };

  const financeSubmit=document.getElementById('financeSubmit');
  if(financeSubmit) financeSubmit.onclick=async()=>{
    const desc=document.getElementById('finDesc').value.trim();
    const type=document.getElementById('finType').value;
    const amount=Number(document.getElementById('finAmount').value);
    const date=parseDMY(document.getElementById('finDate').value.trim());
    const given_by=document.getElementById('finGivenBy').value.trim();
    const mode=document.getElementById('finMode').value;
    if(!desc||!amount||!date) return;
    const editId=state.modal.editId;
    const payload={desc,type,amount,date,given_by,mode};
    if(editId) await updateFinanceRow(editId, payload);
    else await saveFinanceRow(payload);
    state.modal=null;
    await loadAll();
  };

  const reportSubmit=document.getElementById('reportSubmit');
  if(reportSubmit) reportSubmit.onclick=async()=>{
    const title=document.getElementById('repTitle').value.trim();
    const desc=document.getElementById('repDesc').value.trim();
    const date=parseDMY(document.getElementById('repDate').value.trim());
    if(!title||!date) return;
    const editId=state.modal.editId;
    const file=document.getElementById('repFile').files[0];

    let file_url = state.modal.data?.file_url || null; // keep existing on edit if no new file
    if(file){
      reportSubmit.disabled=true; reportSubmit.textContent='Uploading...';
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g,'_')}`;
      const { error: upErr } = await sb.storage.from('reports').upload(path, file);
      if(upErr){ console.error(upErr); alert('Upload failed: '+upErr.message); reportSubmit.disabled=false; reportSubmit.textContent='Add Report'; return; }
      const { data: pub } = sb.storage.from('reports').getPublicUrl(path);
      file_url = pub.publicUrl;
    }

    if(editId) await updateReportRow(editId, {title,desc,date,file_url});
    else await saveReportRow({title,desc,date,file_url});
    state.modal=null; state.page='reports';
    await loadAll();
  };
}
