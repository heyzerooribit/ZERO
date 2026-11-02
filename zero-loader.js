(function(){
  // Fill these in with your real links.
  var ZERO={discord:'https://discord.gg/jBfXVJUcVZ',shop:''};
  function link(attr,url){document.querySelectorAll('['+attr+']').forEach(function(a){
    if(url){a.href=url;a.target='_blank';a.rel='noopener'}else{a.setAttribute('aria-disabled','true');a.title='Link coming soon'}})}
  link('data-discord',ZERO.discord);link('data-shop',ZERO.shop);
  var here=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('nav ul a').forEach(function(a){if(a.getAttribute('href')===here)a.setAttribute('aria-current','page')});
  requestAnimationFrame(function(){document.body.classList.add('ready')});
  if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(function(){})}
})();

/* live status from your relay. Paste its address below; leave it empty to use the schedule only. */
(function(){
  var LIVE_URL='';
  var S=window.ZERO_LIVE={live:null};
  function tell(){window.dispatchEvent(new Event('zero-live'))}
  function poll(){
    if(!LIVE_URL)return;
    fetch(LIVE_URL,{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){S.live=(d&&typeof d.live==='boolean')?d.live:null;tell()}).catch(function(){S.live=null;tell()});
  }
  poll();setInterval(poll,60000);
})();

/* status pill + phone tab bar */
(function(){
  var TZ='America/New_York',DAYS=[1,2,4,5],HOUR=20,DUR=4;
  function parts(ts){var o={};new Intl.DateTimeFormat('en-US',{timeZone:TZ,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(new Date(ts)).forEach(function(p){o[p.type]=p.value});return o}
  function wall(y,m,d,h){var t0=Date.UTC(y,m-1,d,h,0,0),t=t0;for(var i=0;i<2;i++){var p=parts(t),w=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);t=t0-(w-t)}return t}
  function next(){var now=Date.now(),p=parts(now),b=Date.UTC(+p.year,+p.month-1,+p.day);for(var k=0;k<9;k++){var d=new Date(b+k*864e5);if(DAYS.indexOf(d.getUTCDay())<0)continue;var s=wall(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate(),HOUR);if(now<s+DUR*36e5)return s}}
  var here=location.pathname.split('/').pop()||'index.html',nav=document.querySelector('nav');
  if(nav){
    var pill=document.createElement('span');pill.className='pill';pill.innerHTML='<i></i><b style="font-weight:500"></b>';
    nav.insertBefore(pill,nav.querySelector('ul'));
    var upd=function(){var s=next(),n=Date.now(),L=window.ZERO_LIVE,live=(L&&typeof L.live==='boolean')?L.live:(n>=s&&n<s+DUR*36e5);pill.classList.toggle('on',live);pill.lastChild.textContent=live?'Live now':'Offline'};
    upd();setInterval(upd,30000);window.addEventListener('zero-live',upd);
  }
  /* daily question: one new message at 8 AM Eastern, starting on START */
  window.ZERO_DROPS=(function(){
    var START='2026-11-01',H=8;
    function at(i){var d=new Date(Date.parse(START+'T00:00:00Z')+(i-1)*864e5);return wall(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate(),H)}
    function count(){var now=Date.now(),n=Math.floor((now-at(1))/864e5)+1;if(n<0)n=0;while(n>0&&at(n)>now)n--;while(at(n+1)<=now)n++;return n}
    return {at:at,count:count};
  })();

  var I={
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    about:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    chat:'<path d="M4 5.5h16v10.5H9.5L5 20v-4H4z"/>',
    bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    mail:'<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7.5 7.5 6 7.5-6"/>'};
  var TABS=[['index.html','Home','home'],['about.html','About','about'],['community.html','Community','chat'],['merch.html','Merch','bag'],['schedule.html','Schedule','cal'],['inbox.html','Inbox','mail']];
  function svg(k){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+I[k]+'</svg>'}
  var bar=document.createElement('div');bar.className='tabbar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Main');
  TABS.forEach(function(t){var a=document.createElement('a');a.href=t[0];a.innerHTML=svg(t[2])+'<span>'+t[1]+'</span>';if(here===t[0])a.setAttribute('aria-current','page');bar.appendChild(a)});
  document.body.appendChild(bar);
  function seen(){try{return +localStorage.getItem('zero:seen')||0}catch(e){return 0}}
  window.ZERO_BADGE=function(){
    var u=Math.max(0,window.ZERO_DROPS.count()-seen());
    document.querySelectorAll('a[href="inbox.html"]').forEach(function(a){
      var b=a.querySelector('.badge');
      if(!u){if(b)b.remove();return}
      if(!b){b=document.createElement('i');b.className='badge';a.appendChild(b)}
      b.textContent=u>9?'9+':String(u)})};
  window.ZERO_BADGE();setInterval(window.ZERO_BADGE,60000);
})();

/* logo tile in the top bar */
(function(){var m=document.querySelector('nav .mark');if(!m)return;var i=new Image();i.src='logo-tile.png?v=3';i.alt='';i.className='logo-tile';m.insertBefore(i,m.firstChild)})();
