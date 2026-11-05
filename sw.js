const CACHE='shopgo-v3';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    }).then(function(){return self.clients.claim();})
  );
});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url=new URL(req.url);
  if(url.origin!==self.location.origin)return;           // Supabase, CDN, APIs: red normal
  e.respondWith(
    fetch(req,{cache:'no-store'}).then(function(res){     // siempre la version mas reciente del servidor
      if(res&&res.ok){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(req,copy);});}
      return res;
    }).catch(function(){return caches.match(req);})      // sin internet: copia guardada
  );
});
