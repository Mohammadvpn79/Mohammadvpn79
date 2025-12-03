export default{
  async fetch(r,e){
    const n=new URL(r.url),t=n.pathname;
    const USER="TixxxxDbgbvhf";          // ← رمز کاربر
    const ADMIN="8800552vbvbccxvccc";    // ← رمز ادمین
    const kv=e.SA;

    const ua=r.headers.get("user-agent")||"";
    if(!ua||/bot|curl|wget|scan|python|headless/i.test(ua))return new Response("Forbidden",{status:403});

    if(t==="/data"){
      const v2=await kv.get("v2",{type:"json"})||[];
      const o=!!await kv.get("ovpn");
      const w=!!await kv.get("wg");
      return Response.json({v2,ovpn:o,wg:w});
    }
    if(t==="/addv2"&&r.method==="POST"){
      if(r.headers.get("X-Admin")!==ADMIN)return new Response("No",{status:403});
      const txt=await r.text();
      let arr=await kv.get("v2",{type:"json"})||[];
      arr.push(...txt.split(/\r?\n/).map(l=>l.trim()).filter(l=>l));
      await kv.put("v2",JSON.stringify(arr));
      return new Response("Added");
    }
    if(t.startsWith("/upload/")){
      if(r.headers.get("X-Admin")!==ADMIN)return new Response("No",{status:403});
      const b64=await r.text();
      await kv.put(t==="/upload/ovpn"?"ovpn":"wg",b64);
      return new Response("Uploaded");
    }
    if(t.startsWith("/dl/")){
      const key=t==="/dl/ovpn"?"ovpn":"wg";
      const name=key==="ovpn"?"config.ovpn":"wireguard.conf";
      const b64=await kv.get(key);
      if(!b64)return new Response("404",{status:404});
      return new Response(atob(b64),{headers:{"Content-Type":"application/octet-stream","Content-Disposition":`attachment; filename="${name}"`}});
    }

    const html=`<!DOCTYPE html><html lang=en><head><meta charset=UTF-8><meta name=viewport content="width=device-width,initial-scale=1"><title>National Panel</title><style>body{margin:0;background:#0d1117;color:#c9d1d9;font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh}.c{max-width:480px;width:90%;background:#161b22;padding:30px;border-radius:16px;box-shadow:0 8px 32px #0004;border:1px solid #30363d}h2,h3{color:#58a6ff;text-align:center}input,button,textarea{width:100%;padding:12px;margin:8px 0;border-radius:8px;border:none;box-sizing:border-box}input,textarea{background:#21262d;color:#fff}button{background:#238636;color:#fff;font-weight:bold;cursor:pointer}button:hover{background:#2ea043}.dl{background:#8957e5}.dl:hover{background:#7c4dff}pre{background:#21262d;padding:14px;border-radius:8px;max-height:240px;overflow:auto;white-space:pre-wrap;font-size:13px}.h{display:none}</style></head><body><div class=c><h2>National Panel</h2>
<input type=password id=u placeholder="User Password"><button onclick="document.getElementById('u').value==='${USER}'?document.getElementById('us').classList.remove('h'):alert('Wrong password')">User Login</button>
<div id=us class=h><h3>V2RayNG / Nekobox</h3><pre id=v>Loading configs...</pre><button onclick="navigator.clipboard.writeText(document.getElementById('v').innerText);alert('Copied')">Copy All</button><h3>OpenVPN</h3><button id=o class=dl disabled>Download .ovpn</button><h3>WireGuard</h3><button id=w class=dl disabled>Download .conf</button><hr><button onclick="location.reload()">Logout</button></div>
<hr><h3>Admin</h3><input type=password id=p placeholder="Admin Password"><button onclick="document.getElementById('p').value==='${ADMIN}'?document.getElementById('ad').classList.remove('h'):alert('Wrong admin password')">Admin Login</button>
<div id=ad class=h><h3>Add V2Ray Configs</h3><textarea id=t rows=6 placeholder="one per line"></textarea><button onclick="fetch('/addv2',{method:'POST',headers:{'X-Admin':'${ADMIN}'},body:document.getElementById('t').value}).then(r=>r.text()).then(alert)">Add Configs</button><h3>Upload OpenVPN</h3><input type=file id=of accept=.ovpn><button onclick="up('of','ovpn')">Upload</button><h3>Upload WireGuard</h3><input type=file id=wf accept=.conf><button onclick="up('wf','wg')">Upload</button><br><br><button onclick="location.reload()">Logout</button></div></div>
<script>fetch('/data').then(r=>r.json()).then(d=>{if(d.v2.length)document.getElementById('v').innerText=d.v2.join('\\n');if(d.ovpn){document.getElementById('o').disabled=false;document.getElementById('o').onclick=()=>location.href='/dl/ovpn'}if(d.wg){document.getElementById('w').disabled=false;document.getElementById('w').onclick=()=>location.href='/dl/wg'}});
function up(i,t){const f=document.getElementById(i).files[0];if(!f)return alert('Select file');const r=new FileReader();r.onload=()=>fetch('/upload/'+t,{method:'POST',headers:{'X-Admin':'${ADMIN}'},body:r.result.split(',')[1]}).then(x=>x.text()).then(alert);r.readAsDataURL(f)}</script></body></html>`;

    return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8"}});
  }
}