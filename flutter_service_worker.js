'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  ".vscode/settings.json": "19751b2a32e46d1ba1477f357123a898",
"android-icon-144x144.png": "fa1e3ba5cfb15dfdaa9ffd898161b05e",
"android-icon-192x192.png": "bef5dcf3db72647a744eacf433a5e08d",
"android-icon-36x36.png": "cc41d57800c080ade3cea245601f2bd7",
"android-icon-48x48.png": "17988355f2a82699a6b465f86d34a1b3",
"android-icon-72x72.png": "9f65b227939e4ee8526c3f5aef4c1941",
"android-icon-96x96.png": "7e68f099fd93176c0ab0a98e6ba14cad",
"apple-icon-114x114.png": "d130e684bf33de1478da24d8d618de98",
"apple-icon-120x120.png": "533341f231caba298739ef98e0f50577",
"apple-icon-144x144.png": "fa1e3ba5cfb15dfdaa9ffd898161b05e",
"apple-icon-152x152.png": "eaff0c22c5cb58caf81e61c47eee1d48",
"apple-icon-180x180.png": "7bd100b246c6f38dc41cd9183c83b908",
"apple-icon-57x57.png": "a3e6d480909b6bf1ddf9f8636ff203fc",
"apple-icon-60x60.png": "c3df216ae9d807be5d4b6f1915d80b04",
"apple-icon-72x72.png": "9f65b227939e4ee8526c3f5aef4c1941",
"apple-icon-76x76.png": "bf3dac96913e09700003a320042d59fb",
"apple-icon-precomposed.png": "7f3e332941196306fb69ab1330d774ee",
"apple-icon.png": "7f3e332941196306fb69ab1330d774ee",
"assets/AssetManifest.json": "15bf94541b419a0a0f9ff5f2b2effae1",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "7578b191790211e04d4e5041a2e65985",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/packages/fluttertoast/assets/toastify.css": "8beb4c67569fb90146861e66d94163d7",
"assets/packages/fluttertoast/assets/toastify.js": "8f5ac78dd0b9b5c9959ea1ade77f68ae",
"assets/packages/flutter_google_places/assets/google_black.png": "97f2acfb6e993a0c4134d9d04dff21e2",
"assets/packages/flutter_google_places/assets/google_white.png": "40bc3ae5444eae0b9228d83bfd865158",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "831eb40a2d76095849ba4aecd4340f19",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a126c025bab9a1b4d8ac5534af76a208",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "d80ca32233940ebadc5ae5372ccd67f9",
"browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"favicon-16x16.png": "43950c73e415cfc38b319adc2973e45e",
"favicon-32x32.png": "8bd182408fb729a64e1fcb83935ae4c4",
"favicon-96x96.png": "7e68f099fd93176c0ab0a98e6ba14cad",
"favicon.ico": "342e1827b6a6bcf019509516be0e74f9",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"index.html": "beaa79d8ba5deed62218afdac23c15cd",
"/": "beaa79d8ba5deed62218afdac23c15cd",
"main.dart.js": "747fd965fcee01efeaa2f4fd8561f19e",
"manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"ms-icon-144x144.png": "fa1e3ba5cfb15dfdaa9ffd898161b05e",
"ms-icon-150x150.png": "6a498e5a4258b1c9b5c231a62986d653",
"ms-icon-310x310.png": "19b713fb56031a9e6f8a6c7061bbe6b1",
"ms-icon-70x70.png": "085117981d6ef81a72c162bd93192d5d",
"version.json": "950ba10da9e27f4a0ad1ed8daed26d04"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
