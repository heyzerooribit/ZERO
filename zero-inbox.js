(function(){
  var Q=['What are you allowed to outgrow?','Which part of your past do you want to keep?','What would you try if it didn’t need explaining?','What change have you been apologizing for?','Who could you be that you couldn’t imagine before?','What does your next direction look like?','What’s something you used to love that you’re ready to love differently?','Which old version of you deserves a thank-you?','What’s one thing you want to start without a perfect plan?','What label have you outgrown?','What does evolving look like for you this week?','Which song would you play for your next chapter?','What are you carrying that you can set down?','What would you tell the version of you from a year ago?','What small thing makes you feel most like yourself?','What’s a contradiction in you that you actually like?','What would you make if no one was watching?','Where do you feel most free?','What do you want to be known for that has nothing to do with your past?','What’s something you changed your mind about?','Who helped you become who you are now?','What’s a rule you follow that you never chose?','What would starting from zero look like, without erasing anything?','What’s something you’re proud of that nobody noticed?','What are you curious about right now?','What’s a mistake that taught you something you’d keep?','If your next chapter had a title, what would it be?','What’s something you want to say yes to?','What’s something you’re ready to say no to?','What does a good day look like for the new you?','Which part of your style or taste has changed lately?','What are you still figuring out, and that’s okay?','What would you do with an empty day and no expectations?','What’s something you want to create this month?','Who do you want to be around more of?','What’s the kindest thing you can do for your future self today?','What’s a belief you hold more loosely now?','What does no final form mean to you?','What’s one thing you’ve outgrown but still respect?','What are you becoming?'];
  var C=['Try one thing this week you’ve never done, however small.','Spend a day without apologizing for who you are.','Reach out to someone you’ve been meaning to talk to.','Change one small habit and notice how it feels.','Make something, anything, and only show it if you want to.','Listen to an album or genre you’d normally skip.','Write down three things you’ve outgrown and thank each one.','Wear or do something that feels like the new you.','Spend an hour offline doing something just for you.','Say yes to something you’d usually say no to.','Tell someone about something you’re proud of.','Pick a direction for the next month and take one step.'];
  var F=window.ZERO_FEED,D=window.ZERO_DROPS,box=document.getElementById('msgs'),nd=document.getElementById('nextDrop'),chips=document.getElementById('chips');
  var LABEL={welcome:'Welcome',question:'Daily question',challenge:'Weekly challenge',stream:'Stream reminder',news:'Announcement'};
  var FILTERS=[['all','All',null],['q','Questions',['question','challenge']],['u','Updates',['welcome','news']],['s','Streams',['stream']]];
  var was=F.readIds(),cur='all';
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  function when(ms){return new Date(ms).toLocaleString(undefined,{weekday:'long',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'})}
  function whenS(ms){return new Date(ms).toLocaleString(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
  function content(m){
    if(m.type==='welcome')return {title:'Welcome to the inbox',body:'A new question lands here every morning at 8 AM Eastern. Mondays bring a weekly challenge, stream nights get a reminder, and news from us shows up here too.'};
    if(m.type==='question')return {title:Q[m.idx%Q.length]};
    if(m.type==='challenge')return {title:'This week’s challenge',body:C[m.idx%C.length]};
    if(m.type==='stream')return {title:'Live tonight',body:'ZERØ goes live at '+new Date(m.at).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit',timeZoneName:'short'})+' on TikTok LIVE.',link:'schedule.html',linkText:'See the schedule'};
    return {title:m.title||'Announcement',body:m.body,link:m.link,linkText:m.linkText||'Open'};
  }
  function drawChips(){
    chips.textContent='';
    FILTERS.forEach(function(f){var b=el('button',f[0]===cur?'on':'',f[1]);b.type='button';b.setAttribute('aria-pressed',String(f[0]===cur));b.onclick=function(){cur=f[0];drawChips();draw()};chips.appendChild(b)})}
  function draw(){
    var types=null;FILTERS.forEach(function(f){if(f[0]===cur)types=f[2]});
    var list=F.messages().filter(function(m){return !types||types.indexOf(m.type)>-1});
    box.textContent='';
    if(!list.length){box.appendChild(el('div','empty',cur==='all'?'Nothing yet. Your first question arrives at 8 AM Eastern.':'Nothing here right now.'));return}
    list.forEach(function(m){
      var isNew=was.indexOf(m.id)<0,c=content(m),card=el('div','msg t-'+m.type+(isNew?' new':'')),meta=el('div','meta');
      meta.appendChild(el('span','',LABEL[m.type]));meta.appendChild(el('span',isNew?'tag':'',isNew?'New':whenS(m.time)));
      card.appendChild(meta);card.appendChild(el('p','q',c.title));
      if(c.body)card.appendChild(el('p','body',c.body));
      if(c.link){var a=el('a','btn',c.linkText);a.href=c.link;card.appendChild(a)}
      if(isNew)card.appendChild(el('p','muted when',when(m.time)));
      box.appendChild(card)});
  }
  drawChips();draw();F.markRead();if(window.ZERO_BADGE)window.ZERO_BADGE();
  window.addEventListener('zero-feed',function(){draw();F.markRead();if(window.ZERO_BADGE)window.ZERO_BADGE()});
  var N=D.count();
  function tick(){
    if(D.count()!==N){location.reload();return}
    var t=D.at(N+1)-Date.now();if(t<0)t=0;
    var h=Math.floor(t/36e5),mn=Math.floor(t/6e4)%60,s=Math.floor(t/1e3)%60;
    nd.textContent='';nd.appendChild(el('b','',h+'h '+mn+'m '+s+'s'));nd.appendChild(el('span','',when(D.at(N+1))));
  }
  tick();setInterval(tick,1000);
})();
