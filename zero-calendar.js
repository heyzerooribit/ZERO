(function(){
  var TZ='America/New_York',DAYS=[1,2,4,5],HOUR=20,DUR=4,TITLE='ZERØ live',WHERE='TikTok LIVE';
  /* One-off events go here, for example:
     {start:'2026-12-31T21:00:00-05:00',end:'2027-01-01T01:00:00-05:00',title:'Zero hour',where:'TikTok LIVE'} */
  var SPECIAL=[];

  function parts(ts){var o={};new Intl.DateTimeFormat('en-US',{timeZone:TZ,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(new Date(ts)).forEach(function(p){o[p.type]=p.value});return o}
  function wall(y,m,d,h){var t0=Date.UTC(y,m-1,d,h,0,0),t=t0;for(var i=0;i<2;i++){var p=parts(t),w=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);t=t0-(w-t)}return t}

  var events=[],p0=parts(Date.now()),base=Date.UTC(+p0.year,+p0.month-1,+p0.day);
  for(var k=-3;k<120;k++){var d=new Date(base+k*864e5);if(DAYS.indexOf(d.getUTCDay())<0)continue;
    var s=wall(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate(),HOUR);events.push({start:s,end:s+DUR*36e5,title:TITLE,where:WHERE})}
  SPECIAL.forEach(function(e){var s=Date.parse(e.start),n=Date.parse(e.end);if(!isNaN(s)&&!isNaN(n))events.push({start:s,end:n,title:e.title,where:e.where||WHERE})});
  events.sort(function(a,b){return a.start-b.start});

  function $(i){return document.getElementById(i)}
  function mid(t){var d=new Date(t);d.setHours(0,0,0,0);return d.getTime()}
  function addDays(t,n){var d=new Date(t);d.setDate(d.getDate()+n);d.setHours(0,0,0,0);return d.getTime()}
  function onDay(day){return events.filter(function(e){return e.start>=day&&e.start<addDays(day,1)})}
  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
  function tm(t){return new Date(t).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}
  function tz(t){return new Date(t).toLocaleTimeString(undefined,{timeZoneName:'short'}).split(' ').pop()}

  var today=mid(Date.now()),weekStart=today,sel=today;

  function drawStrip(){
    var st=$('strip');st.textContent='';
    $('cMonth').textContent=new Date(weekStart).toLocaleDateString(undefined,{month:'long',year:'numeric'});
    for(var i=0;i<7;i++){(function(day){
      var b=el('button','day'+(day===sel?' sel':'')+(day===today?' today':'')+(onDay(day).length?' has':''));
      b.type='button';b.setAttribute('aria-pressed',String(day===sel));
      b.setAttribute('aria-label',new Date(day).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}));
      b.appendChild(el('small','',new Date(day).toLocaleDateString(undefined,{weekday:'short'})));
      b.appendChild(el('b','',String(new Date(day).getDate())));b.appendChild(el('i'));
      b.onclick=function(){sel=day;drawStrip();drawDay()};st.appendChild(b)})(addDays(weekStart,i))}
  }

  function drawDay(){
    var list=$('dayList'),evs=onDay(sel);list.textContent='';
    $('dayLab').textContent=new Date(sel).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
    $('dayCount').textContent=evs.length?evs.length+' planned':'Nothing planned';
    if(!evs.length){list.appendChild(el('div','empty','No stream this day.'));return}
    evs.forEach(function(e){var r=el('div','ev'),t=el('div','evt');
      t.appendChild(el('b','',tm(e.start)));t.appendChild(el('span','',tm(e.end)+' '+tz(e.end)));
      var m=el('div','');m.appendChild(el('b','',e.title));m.appendChild(el('span','muted',e.where));
      r.appendChild(t);r.appendChild(m);list.appendChild(r)})
  }

  var C=2*Math.PI*57;
  function drawUp(){
    var box=$('up'),now=Date.now(),n=null;
    for(var i=0;i<events.length;i++){if(events[i].end>now){n=events[i];break}}
    if(!n){box.textContent='';box.appendChild(el('p','muted','Nothing scheduled right now.'));return}
    var live=now>=n.start,t=n.start-now,txt,prog;
    if(live){txt='Live';prog=1}
    else{var d=Math.floor(t/864e5),h=Math.floor(t/36e5)%24,m=Math.floor(t/6e4)%60,s=Math.floor(t/1e3)%60;
      txt=d?d+'d '+h+'h':(h?h+'h '+m+'m':m+'m '+s+'s');prog=1-Math.min(1,t/(7*864e5))}
    if(!box.firstChild||box.dataset.k!==String(n.start)){
      box.dataset.k=String(n.start);box.textContent='';
      var ring=el('div','cring');
      ring.innerHTML='<svg viewBox="0 0 132 132" aria-hidden="true"><circle class="bg" cx="66" cy="66" r="57"/><circle class="fg" cx="66" cy="66" r="57" stroke-dasharray="'+C+'"/></svg>';
      ring.appendChild(el('span','',''));
      var info=el('div','info');info.appendChild(el('b','big',n.title));
      info.appendChild(el('p','',new Date(n.start).toLocaleString(undefined,{weekday:'long',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'})));
      info.appendChild(el('p','muted',n.where));
      box.appendChild(ring);box.appendChild(info);
      var note=el('p','muted note','Regular streams: Monday, Tuesday, Thursday and Friday, 8 PM to midnight Eastern, shown in your time.');box.appendChild(note)}
    box.querySelector('.cring span').textContent=txt;
    box.querySelector('.fg').style.strokeDashoffset=String(C*(1-prog));
  }

  $('cPrev').onclick=function(){weekStart=addDays(weekStart,-7);sel=weekStart<=today&&today<addDays(weekStart,7)?today:weekStart;drawStrip();drawDay()};
  $('cNext').onclick=function(){weekStart=addDays(weekStart,7);sel=weekStart<=today&&today<addDays(weekStart,7)?today:weekStart;drawStrip();drawDay()};
  $('cToday').onclick=function(){today=mid(Date.now());weekStart=today;sel=today;drawStrip();drawDay()};
  drawStrip();drawDay();drawUp();setInterval(drawUp,1000);
})();
