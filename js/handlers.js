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

  document.querySelectorAll('[data-del-event]').forEach(el=>{ el.onclick=async()=>{ await deleteEventRow(el.getAttribute('data-del-event')); await loadAll(); }; });
  document.querySelectorAll('[data-del-gallery]').forEach(el=>{ el.onclick=async()=>{ await deleteGalleryRow(el.getAttribute('data-del-gallery')); await loadAll(); }; });
  document.querySelectorAll('[data-del-finance]').forEach(el=>{ el.onclick=async()=>{ await deleteFinanceRow(el.getAttribute('data-del-finance')); await loadAll(); }; });

  document.querySelectorAll('[data-edit-event]').forEach(el=>{ el.onclick=()=>{ const id=el.getAttribute('data-edit-event'); const data=state.events.find(e=>e.id===id); state.modal={type:'event',editId:id,data}; render(); }; });
  document.querySelectorAll('[data-edit-gallery]').forEach(el=>{ el.onclick=()=>{ const id=el.getAttribute('data-edit-gallery'); const data=state.gallery.find(g=>g.id===id); state.modal={type:'gallery',editId:id,data}; render(); }; });
  document.querySelectorAll('[data-edit-finance]').forEach(el=>{ el.onclick=()=>{ const id=el.getAttribute('data-edit-finance'); const data=state.finance.find(f=>f.id===id); state.modal={type:'finance',editId:id,data}; render(); }; });

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
    const date=parseDMY(document.getElementById('fDate').value.trim());
    const desc=document.getElementById('fDesc').value.trim();
    const status=document.getElementById('fStatus').value;
    const image_url=document.getElementById('fImg').value.trim() || null;
    if(!title||!date) return;
    const editId=state.modal.editId;
    if(editId) await updateEventRow(editId, {title,date,desc,status,image_url});
    else await saveEventRow({title,date,desc,status,image_url});
    state.modal=null; state.page='events'; state.eventsTab=status;
    await loadAll();
  };

  const gallerySubmit=document.getElementById('gallerySubmit');
  if(gallerySubmit) gallerySubmit.onclick=async()=>{
    const type=document.getElementById('gType').value;
    const url=document.getElementById('gUrl').value.trim();
    const title=document.getElementById('gTitle').value.trim();
    const program=document.getElementById('gProgram').value.trim();
    if(!url||!title) return;
    const editId=state.modal.editId;
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
    if(!desc||!amount||!date) return;
    const editId=state.modal.editId;
    if(editId) await updateFinanceRow(editId, {desc,type,amount,date});
    else await saveFinanceRow({desc,type,amount,date});
    state.modal=null;
    await loadAll();
  };
}
