async function loadAll(){
  try{
    const [evRes, galRes, finRes] = await Promise.all([
      sb.from('events').select('*').order('date', {ascending:true}),
      sb.from('gallery').select('*').order('created_at', {ascending:false}),
      state.isAdmin
        ? sb.from('finance').select('*').order('date', {ascending:false})
        : Promise.resolve({data:[], error:null})
    ]);
    state.events = (evRes.data || []).map(e => ({...e, desc: e.desc || "", img: e.image_url || ""}));
    state.gallery = galRes.data || [];
    state.finance = finRes.data || [];
  }catch(e){
    console.error("Supabase load error", e);
    state.events = []; state.gallery = []; state.finance = [];
  }
  state.loading = false;
  render();
}

async function saveEventRow(ev){ const { error } = await sb.from('events').insert([ev]); if(error) console.error(error); }
async function updateEventRow(id, ev){ const { error } = await sb.from('events').update(ev).eq('id', id); if(error) console.error(error); }
async function deleteEventRow(id){ const { error } = await sb.from('events').delete().eq('id', id); if(error) console.error(error); }
async function saveGalleryRow(g){ const { error } = await sb.from('gallery').insert([g]); if(error) console.error(error); }
async function updateGalleryRow(id, g){ const { error } = await sb.from('gallery').update(g).eq('id', id); if(error) console.error(error); }
async function deleteGalleryRow(id){ const { error } = await sb.from('gallery').delete().eq('id', id); if(error) console.error(error); }
async function saveFinanceRow(f){ const { error } = await sb.from('finance').insert([f]); if(error) console.error(error); }
async function updateFinanceRow(id, f){ const { error } = await sb.from('finance').update(f).eq('id', id); if(error) console.error(error); }
async function deleteFinanceRow(id){ const { error } = await sb.from('finance').delete().eq('id', id); if(error) console.error(error); }
