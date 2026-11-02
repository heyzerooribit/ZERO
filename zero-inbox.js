(function(){
  var Q=['What are you allowed to outgrow?','Which part of your past do you want to keep?','What would you try if it didn’t need explaining?','What change have you been apologizing for?','Who could you be that you couldn’t imagine before?','What does your next direction look like?','What’s something you used to love that you’re ready to love differently?','Which old version of you deserves a thank-you?','What’s one thing you want to start without a perfect plan?','What label have you outgrown?','What does evolving look like for you this week?','Which song would you play for your next chapter?','What are you carrying that you can set down?','What would you tell the version of you from a year ago?','What small thing makes you feel most like yourself?','What’s a contradiction in you that you actually like?','What would you make if no one was watching?','Where do you feel most free?','What do you want to be known for that has nothing to do with your past?','What’s something you changed your mind about?','Who helped you become who you are now?','What’s a rule you follow that you never chose?','What would starting from zero look like, without erasing anything?','What’s something you’re proud of that nobody noticed?','What are you curious about right now?','What’s a mistake that taught you something you’d keep?','If your next chapter had a title, what would it be?','What’s something you want to say yes to?','What’s something you’re ready to say no to?','What does a good day look like for the new you?','Which part of your style or taste has changed lately?','What are you still figuring out, and that’s okay?','What would you do with an empty day and no expectations?','What’s something you want to create this month?','Who do you want to be around more of?','What’s the kindest thing you can do for your future self today?','What’s a belief you hold more loosely now?','What does no final form mean to you?','What’s one thing you’ve outgrown but still respect?','What are you becoming?'];
  var D=window.ZERO_DROPS,N=D.count(),box=document.getElementById('msgs'),nd=document.getElementById('nextDrop');
  function seen(){try{return +localStorage.getItem('zero:seen')||0}catch(e){return 0}}
  var was=seen();
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  function whenS(ms){return new Date(ms).toLocaleString(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
  function when(ms){return new Date(ms).toLocaleString(undefined,{weekday:'long',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'})}
  if(!N){box.appendChild(el('div','empty','Nothing yet. Your first question arrives at 8 AM Eastern.'))}
  else for(var i=N;i>=Math.max(1,N-29);i--){
    var m=el('div','msg'+(i>was?' new':'')),meta=el('div','meta');
    meta.appendChild(el('span','','Daily question'));meta.appendChild(el('span',i>was?'tag':'',i>was?'New':whenS(D.at(i))));
    m.appendChild(meta);m.appendChild(el('p','q',Q[(i-1)%Q.length]));
    if(i>was){m.appendChild(el('p','muted',when(D.at(i))))}
    box.appendChild(m)}
  try{localStorage.setItem('zero:seen',String(N))}catch(e){}
  if(window.ZERO_BADGE)window.ZERO_BADGE();
  function tick(){
    var nowN=D.count();if(nowN!==N){location.reload();return}
    var t=D.at(N+1)-Date.now();if(t<0)t=0;
    var h=Math.floor(t/36e5),mn=Math.floor(t/6e4)%60,s=Math.floor(t/1e3)%60;
    nd.textContent='';nd.appendChild(el('b','',h+'h '+mn+'m '+s+'s'));nd.appendChild(el('span','',when(D.at(N+1))));
  }
  tick();setInterval(tick,1000);
})();
