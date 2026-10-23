
const CACHE_NAME = "juga-con-bauti-v1";

const ARCHIVOS_INICIALES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./imagenes/iconos/app-192.png",
  "./imagenes/iconos/app-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_INICIALES);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((respuestaGuardada) => {
      return (
        respuestaGuardada ||
        fetch(event.request).then((respuesta) => {
          if (
            respuesta.ok &&
            new URL(event.request.url).origin === self.location.origin
          ) {
            const copia = respuesta.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copia);
            });
          }

          return respuesta;
        })
      );
    })
  );
});
