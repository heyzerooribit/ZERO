(function(){
  function parts(ts,tz){
    var f=new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}),o={};
    f.formatToParts(new Date(ts)).forEach(function(p){o[p.type]=p.value});
    return o;
  }
  function wallToUtc(y,m,d,h,tz){
    var target=Date.UTC(y,m-1,d,h,0,0),t=target;
    for(var i=0;i<2;i++){
      var p=parts(t,tz),w=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
      t=target-(w-t);
    }
    return t;
  }
  function next(days,hour,dur,tz){
    var now=Date.now(),p=parts(now,tz),base=Date.UTC(+p.year,+p.month-1,+p.day);
    for(var k=0;k<9;k++){
      var dt=new Date(base+k*864e5);
      if(days.indexOf(dt.getUTCDay())<0)continue;
      var start=wallToUtc(dt.getUTCFullYear(),dt.getUTCMonth()+1,dt.getUTCDate(),hour,tz);
      if(now<start+dur*36e5)return start;
    }
    return null;
  }
  window.ZERO_SCHEDULE={next:next};
  if(typeof document==='undefined')return;
  document.querySelectorAll('[data-countdown]').forEach(function(el){
    var fixed=Date.parse(el.dataset.date||''),sched=!!el.dataset.days;
    if(isNaN(fixed)&&!sched)return;
    var days=(el.dataset.days||'').split(',').map(Number),hour=+(el.dataset.hour||20),dur=+(el.dataset.hours||4),tz=el.dataset.tz||'America/New_York';
    el.innerHTML='<p class="muted" data-l></p><div class="count"><div><span data-u="d">0</span><small>days</small></div><div><span data-u="h">0</span><small>hours</small></div><div><span data-u="m">0</span><small>minutes</small></div><div><span data-u="s">0</span><small>seconds</small></div></div><p class="muted" data-t></p>';
    var label=el.dataset.label||'Coming up',L=el.querySelector('[data-l]'),T=el.querySelector('[data-t]'),C=el.querySelector('.count'),start=sched?next(days,hour,dur,tz):fixed;
    function tick(){
      if(sched&&Date.now()>=start+dur*36e5)start=next(days,hour,dur,tz);
      if(start==null){el.hidden=true;return}
      var t=start-Date.now();
      if(sched&&t<=0){
        L.textContent='Live now';C.hidden=true;T.textContent='Come hang out.';return;
      }
      t=Math.max(0,t);C.hidden=false;L.textContent=label;
      var v={d:Math.floor(t/864e5),h:Math.floor(t/36e5)%24,m:Math.floor(t/6e4)%60,s:Math.floor(t/1e3)%60};
      for(var k in v){el.querySelector('[data-u='+k+']').textContent=v[k]}
      T.textContent=sched?'Starts '+new Date(start).toLocaleString(undefined,{weekday:'long',hour:'numeric',minute:'2-digit',timeZoneName:'short'})+' (your time)':'';
    }
    tick();setInterval(tick,1000);
  });
})();
