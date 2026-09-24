async function loadAll(){
  try{
    const [evRes, galRes, finRes, repRes, facRes] = await Promise.all([
      sb.from('events').select('*').order('date', {ascending:true}),
      sb.from('gallery').select('*').order('created_at', {ascending:false}),
      canViewPage('finance')
        ? sb.from('finance').select('*').order('date', {ascending:false})
        : Promise.resolve({data:[], error:null}),
      sb.from('reports').select('*').order('date', {ascending:false}),
      sb.from('faculty').select('*').order('created_at', {ascending:true})
    ]);
    state.events = (evRes.data || []).map(e => ({...e, desc: e.desc || "", img: e.image_url || ""}));
    state.gallery = galRes.data || [];
    state.finance = finRes.data || [];
    state.reports = repRes.data || [];
    state.faculty = facRes.data || [];
  }catch(e){
    console.error("Supabase load error", e);
    state.events = []; state.gallery = []; state.finance = []; state.reports = []; state.faculty = [];
  }
  state.loading = false;
  render();
}

async function saveFacultyRow(f){ const { error } = await sb.from('faculty').insert([f]); if(error) console.error(error); }
async function updateFacultyRow(id, f){ const { error } = await sb.from('faculty').update(f).eq('id', id); if(error) console.error(error); }
async function deleteFacultyRow(id){ const { error } = await sb.from('faculty').delete().eq('id', id); if(error) console.error(error); }
