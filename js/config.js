
let state = { page:"home", eventsTab:"upcoming", isAdmin:false, role:null, loading:true, modal:null, loginError:"", events:[], gallery:[], finance:[], reports:[] };

// section: 'events' | 'gallery' | 'finance' | 'reports'
function canManage(section){
  if(!state.isAdmin) return false;
  if(state.role==='super') return true;
  if(section==='gallery') return state.role==='media';
  if(section==='finance') return state.role==='finance';
  if(section==='events' || section==='reports') return state.role==='events';
  return false;
}
// page: 'home' | 'about' | 'events' | 'gallery' | 'reports' | 'finance'
function canViewPage(page){
  if(page==='home' || page==='about') return true;
  if(page==='finance') return state.isAdmin && (state.role==='super' || state.role==='finance');
  if(!state.isAdmin) return true; // public: events/gallery/reports open to all
  if(state.role==='super') return true;
  if(page==='gallery') return state.role==='media';
  if(page==='events' || page==='reports') return state.role==='events';
  return false;
}

const SUPABASE_URL = "https://dpyakadxohzxzlmydflt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRweWFrYWR4b2h6eHpsbXlkZmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNjM4OTMsImV4cCI6MjEwNDgzOTg5M30.LZb2_xhlj163ytaXUZHNan4ux4cgQAqXMo2XRW11NGE";

const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let state = {
  page: "home",
  eventsTab: "upcoming",
  isAdmin: false,
  role: null,
  user: null,
  loading: true,
  modal: null,
  loginError: "",
  events: [],
  gallery: [],
  finance: [],
  reports: []
};
