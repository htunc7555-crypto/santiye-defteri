var C='sd-v1';
var ASSETS=['./','index.html','firebase-config.js','manifest.webmanifest','icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(ASSETS)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.hostname.indexOf('firestore.googleapis.com')>=0||u.hostname.indexOf('identitytoolkit')>=0||u.hostname.indexOf('securetoken')>=0)return;
  e.respondWith(fetch(r).then(function(res){
    if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}
    return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match('index.html')})}));
});
