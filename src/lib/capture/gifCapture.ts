/**
 * Encode array of frames (HTMLCanvasElement atau data URL) menjadi animated GIF
 * menggunakan gif.js (web worker based).
 *
 * gif.js butuh worker script di URL - di dev/build Vite, kita serve dari node_modules
 * via import URL atau static copy. Versi sederhana: fetch dari CDN jsdelivr.
 */

type GifOptions = {
  /** Delay per frame dalam ms. */
  delay?: number;
  /** Quality (1-30, lebih rendah = lebih bagus, lebih lambat). */
  quality?: number;
  /** Boomerang: ulangi frame terbalik di akhir. */
  boomerang?: boolean;
  width?: number;
  height?: number;
};

const GIF_WORKER_CDN = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js';

let cachedWorkerBlobUrl: string | null = null;

async function getWorkerScriptUrl(): Promise<string> {
  if (cachedWorkerBlobUrl) return cachedWorkerBlobUrl;
  // Download worker script lalu wrap jadi blob URL (hindari CORS kalau CDN berubah).
  try {
    const res = await fetch(GIF_WORKER_CDN);
    const code = await res.text();
    const blob = new Blob([code], { type: 'application/javascript' });
    cachedWorkerBlobUrl = URL.createObjectURL(blob);
    return cachedWorkerBlobUrl;
  } catch {
    // Fallback ke CDN langsung.
    return GIF_WORKER_CDN;
  }
}

export async function encodeGif(
  frames: HTMLCanvasElement[],
  options: GifOptions = {}
): Promise<Blob> {
  if (frames.length === 0) throw new Error('No frames provided.');
  const { default: GIF } = await import('gif.js');
  const workerScript = await getWorkerScriptUrl();
  const first = frames[0];
  const width = options.width ?? first.width;
  const height = options.height ?? first.height;

  // Boomerang: append reversed frames (kecuali first/last biar smooth).
  const sequence = options.boomerang
    ? [...frames, ...frames.slice(1, -1).reverse()]
    : [...frames];

  return new Promise<Blob>((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: options.quality ?? 12,
      width,
      height,
      workerScript
    });

    for (const canvas of sequence) {
      gif.addFrame(canvas, { delay: options.delay ?? 120, copy: true });
    }

    gif.on('finished', (blob: Blob) => resolve(blob));
    gif.on('abort', () => reject(new Error('GIF encoding aborted.')));
    gif.render();
  });
}
