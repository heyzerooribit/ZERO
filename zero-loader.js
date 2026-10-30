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
    var upd=function(){var s=next(),n=Date.now(),live=n>=s&&n<s+DUR*36e5;pill.classList.toggle('on',live);pill.lastChild.textContent=live?'Live now':'Offline'};
    upd();setInterval(upd,30000);
  }
  var I={
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    about:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    chat:'<path d="M4 5.5h16v10.5H9.5L5 20v-4H4z"/>',
    bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    more:'<circle cx="6" cy="12" r="1.4" style="fill:currentColor"/><circle cx="12" cy="12" r="1.4" style="fill:currentColor"/><circle cx="18" cy="12" r="1.4" style="fill:currentColor"/>'};
  var TABS=[['index.html','Home','home'],['about.html','About','about'],['community.html','Community','chat'],['merch.html','Merch','bag'],['schedule.html','Schedule','cal']];
  var MORE=[['media.html','Media'],['projects.html','Projects'],['archives.html','Archives'],['becoming.html','Becoming']];
  function svg(k){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+I[k]+'</svg>'}
  var bar=document.createElement('div');bar.className='tabbar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Main');
  TABS.forEach(function(t){var a=document.createElement('a');a.href=t[0];a.innerHTML=svg(t[2])+'<span>'+t[1]+'</span>';if(here===t[0])a.setAttribute('aria-current','page');bar.appendChild(a)});
  var more=document.createElement('button');more.type='button';more.setAttribute('aria-expanded','false');more.innerHTML=svg('more')+'<span>More</span>';
  var sheet=document.createElement('div');sheet.className='sheet';sheet.hidden=true;
  MORE.forEach(function(m){var a=document.createElement('a');a.href=m[0];a.textContent=m[1];if(here===m[0]){a.setAttribute('aria-current','page');more.setAttribute('aria-current','page')}sheet.appendChild(a)});
  more.onclick=function(e){e.stopPropagation();sheet.hidden=!sheet.hidden;more.setAttribute('aria-expanded',String(!sheet.hidden))};
  document.addEventListener('click',function(){sheet.hidden=true;more.setAttribute('aria-expanded','false')});
  bar.appendChild(more);document.body.appendChild(sheet);document.body.appendChild(bar);
})();
