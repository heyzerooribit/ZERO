var C='zero-v9',F=["index.html", "about.html", "community.html", "merch.html", "schedule.html", "inbox.html", "404.html", "style.css", "zero-loader.js", "zero-calendar.js", "zero-inbox.js", "manifest.json", "favicon-32.png", "logo-tile.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);if(u.origin!==location.origin)return;
  var rel=u.pathname.slice(new URL('./',location.href).pathname.length);
  if(rel!==''&&F.indexOf(rel)<0)return;
  e.respondWith(fetch(r).then(function(x){var c=x.clone();caches.open(C).then(function(k){k.put(r,c)});return x}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('404.html')})}));
});
