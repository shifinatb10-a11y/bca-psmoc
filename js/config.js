const DEFAULT_ADMIN = { username: "admin", password: "bca@2026" };
let state = { page:"home", eventsTab:"upcoming", isAdmin:false, loading:true, modal:null, loginError:"", events:[], gallery:[], finance:[], reports:[] };

const SUPABASE_URL = "https://dpyakadxohzxzlmydflt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRweWFrYWR4b2h6eHpsbXlkZmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNjM4OTMsImV4cCI6MjEwNDgzOTg5M30.LZb2_xhlj163ytaXUZHNan4ux4cgQAqXMo2XRW11NGE";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
