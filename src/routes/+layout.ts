// Seluruh aplikasi dijalankan sebagai SPA (client-side only).
// getUserMedia, canvas 2D/WebGL, IndexedDB, MediaPipe WASM — semuanya browser-bound.
export const ssr = false;
export const csr = true;
export const prerender = true;
export const trailingSlash = 'never';
