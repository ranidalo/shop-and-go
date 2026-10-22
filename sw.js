const CACHE='shopgo-v6';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url=new URL(req.url);
  if(url.origin!==self.location.origin)return;           // Supabase, CDN, APIs: red normal
  e.respondWith(
    fetch(req).then(function(res){
      var copy=res.clone();
      caches.open(CACHE).then(function(c){c.put(req,copy);});
      return res;
    }).catch(function(){return caches.match(req);})
  );
});
