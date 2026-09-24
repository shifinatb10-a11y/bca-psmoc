const SUPABASE_URL = "https://dpyakadxohzxzlmydflt.supabase.co";
const SUPABASE_ANON_KEY = "******";

const FACULTY_BUCKET = 'faculty';
const FACULTY_MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let state = {
  page: 'home',
  eventsTab: 'upcoming',
  isAdmin: false,
  role: null,
  user: null,
  loading: true,
  modal: null,
  loginError: '',
  events: [],
  gallery: [],
  finance: [],
  reports: [],
  faculty: [],
  facultyError: ''
};

// section: 'events' | 'gallery' | 'finance' | 'reports' | 'faculty'
function canManage(section) {
  if (!state.isAdmin) return false;
  if (state.role === 'super') return true;
  if (section === 'gallery') return state.role === 'media';
  if (section === 'finance') return state.role === 'finance';
  if (section === 'events' || section === 'reports') return state.role === 'events';
  return false;
}

// page: 'home' | 'about' | 'events' | 'gallery' | 'reports' | 'finance'
function canViewPage(page) {
  if (page === 'home' || page === 'about') return true;
  if (page === 'finance') return state.isAdmin && (state.role === 'super' || state.role === 'finance');
  if (!state.isAdmin) return true; // public: events/gallery/reports open to all
  if (state.role === 'super') return true;
  if (page === 'gallery') return state.role === 'media';
  if (page === 'events' || page === 'reports') return state.role === 'events';
  return false;
}

async function loadUserRole() {
  if (!state.user) {
    state.isAdmin = false;
    state.role = null;
    return;
  }

  const { data, error } = await sb
    .from('admin_users')
    .select('role')
    .eq('user_id', state.user.id)
    .maybeSingle();

  if (error || !data) {
    console.error('Could not load admin role:', error);
    state.isAdmin = false;
    state.role = null;
    return;
  }

  state.isAdmin = true;
  state.role = data.role;
}
