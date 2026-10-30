var C='zero-v5',F=['zero-calendar.js',"index.html", "about.html", "community.html", "merch.html", "media.html", "projects.html", "schedule.html", "archives.html", "becoming.html", "404.html", "style.css", "zero-loader.js", "zero-countdown.js", "manifest.json", "icon.svg"];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);if(u.origin!==location.origin)return;
  // Only handle this site's own files; leave other sites (like /echo-admin/ and /outcryinruins/) alone.
  var rel=u.pathname.slice(new URL('./',location.href).pathname.length);
  if(rel!==''&&F.indexOf(rel)<0)return;
  e.respondWith(fetch(r).then(function(x){var c=x.clone();caches.open(C).then(function(k){k.put(r,c)});return x}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('404.html')})}));
});
