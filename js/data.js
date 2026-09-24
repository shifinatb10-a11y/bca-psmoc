async function loadAll() {
  try {
    const [evRes, galRes, finRes, repRes, facRes] = await Promise.all([
      sb.from('events').select('*').order('date', { ascending: true }),
      sb.from('gallery').select('*').order('created_at', { ascending: false }),
      canViewPage('finance')
        ? sb.from('finance').select('*').order('date', { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      sb.from('reports').select('*').order('date', { ascending: false }),
      sb.from('faculty').select('*').order('created_at', { ascending: true })
    ]);

    state.events = (evRes.data || []).map(e => ({ ...e, desc: e.desc || '', img: e.image_url || '' }));
    state.gallery = galRes.data || [];
    state.finance = finRes.data || [];
    state.reports = repRes.data || [];
    state.faculty = facRes.data || [];

    state.facultyError = '';

    if (facRes.error) {
      state.faculty = [];
      state.facultyError = `Could not load faculty: ${facRes.error.message}`;
      console.error('Supabase faculty load error', facRes.error);
    }
  } catch (e) {
    console.error('Supabase load error', e);
    state.events = [];
    state.gallery = [];
    state.finance = [];
    state.reports = [];
    state.faculty = [];
    state.facultyError = 'Could not load data from Supabase.';
  }

  state.loading = false;
  render();
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getStoragePathFromPublicUrl(url, bucket) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch (e) {
    console.warn('Invalid storage URL:', url, e);
    return null;
  }
}

async function deleteFacultyPhotoByUrl(photoUrl) {
  const oldPath = getStoragePathFromPublicUrl(photoUrl, FACULTY_BUCKET);
  if (!oldPath) return null;

  const { error } = await sb.storage.from(FACULTY_BUCKET).remove([oldPath]);
  if (error) {
    return `Could not remove old photo file (${error.message}).`;
  }

  return null;
}

async function uploadFacultyPhoto(file, previousPhotoUrl = null) {
  const path = `faculty/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await sb.storage
    .from(FACULTY_BUCKET)
    .upload(path, file, { upsert: false, cacheControl: '3600' });

  if (uploadError) {
    throw new Error(`Faculty photo upload failed: ${uploadError.message}`);
  }

  const { data: publicData } = sb.storage.from(FACULTY_BUCKET).getPublicUrl(path);
  const warning = previousPhotoUrl ? await deleteFacultyPhotoByUrl(previousPhotoUrl) : null;

  return {
    photoUrl: publicData.publicUrl,
    warning
  };
}

async function saveFacultyRow(payload) {
  const { error } = await sb.from('faculty').insert([payload]);
  if (error) throw new Error(`Could not add faculty: ${error.message}`);
}

async function updateFacultyRow(id, payload) {
  const { error } = await sb.from('faculty').update(payload).eq('id', id);
  if (error) throw new Error(`Could not update faculty: ${error.message}`);
}

async function deleteFacultyRow(id, photoUrl) {
  const { error } = await sb.from('faculty').delete().eq('id', id);
  if (error) throw new Error(`Could not delete faculty: ${error.message}`);

  return photoUrl ? await deleteFacultyPhotoByUrl(photoUrl) : null;
}

async function saveEventRow(ev) { const { error } = await sb.from('events').insert([ev]); if (error) console.error(error); }
async function updateEventRow(id, ev) { const { error } = await sb.from('events').update(ev).eq('id', id); if (error) console.error(error); }
async function deleteEventRow(id) { const { error } = await sb.from('events').delete().eq('id', id); if (error) console.error(error); }
async function saveGalleryRow(g) { const { error } = await sb.from('gallery').insert([g]); if (error) console.error(error); }
async function updateGalleryRow(id, g) { const { error } = await sb.from('gallery').update(g).eq('id', id); if (error) console.error(error); }
async function deleteGalleryRow(id) { const { error } = await sb.from('gallery').delete().eq('id', id); if (error) console.error(error); }
async function saveFinanceRow(f) { const { error } = await sb.from('finance').insert([f]); if (error) console.error(error); }
async function updateFinanceRow(id, f) { const { error } = await sb.from('finance').update(f).eq('id', id); if (error) console.error(error); }
async function deleteFinanceRow(id) { const { error } = await sb.from('finance').delete().eq('id', id); if (error) console.error(error); }
async function saveReportRow(r) { const { error } = await sb.from('reports').insert([r]); if (error) console.error(error); }
async function updateReportRow(id, r) { const { error } = await sb.from('reports').update(r).eq('id', id); if (error) console.error(error); }
async function deleteReportRow(id) { const { error } = await sb.from('reports').delete().eq('id', id); if (error) console.error(error); }
