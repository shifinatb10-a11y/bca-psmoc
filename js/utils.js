function fmtDate(d){ const dt=new Date(d+"T00:00:00"); const dd=String(dt.getDate()).padStart(2,'0'); const mm=String(dt.getMonth()+1).padStart(2,'0'); return `${dd}/${mm}/${dt.getFullYear()}`; }
function fmtMoney(n){ return "₹"+Number(n).toLocaleString('en-IN'); }
function uid(){ return 'id'+Math.random().toString(36).slice(2,10); }
function esc(s){ const d=document.createElement('div'); d.innerText=s==null?"":s; return d.innerHTML; }
function parseDMY(str){
  const m=str.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(!m) return null;
  const dd=m[1].padStart(2,'0'), mm=m[2].padStart(2,'0'), yyyy=m[3];
  const dt=new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  if(isNaN(dt.getTime())) return null;
  return `${yyyy}-${mm}-${dd}`;
}
function autoSlash(el){
  el.addEventListener('input',()=>{
    let v=el.value.replace(/[^\d]/g,'').slice(0,8);
    if(v.length>4) v=v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4);
    else if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2);
    el.value=v;
  });
}
