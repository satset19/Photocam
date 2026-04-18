import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    // getUserMedia membutuhkan secure context; localhost OK, tapi biarkan
    // akses dari device lain di LAN (untuk test mobile) via HTTPS proxy opsional.
    host: true
  },
  optimizeDeps: {
    // gif.js bukan ESM murni — paksa prebundle agar Vite bisa serve.
    include: ['gif.js', 'peerjs', 'qrcode', '@mediapipe/tasks-vision', 'idb']
  }
});
