/**
 * Pipeline filter untuk canvas preview dan capture.
 *
 * Pendekatan: render video frame ke canvas dengan ctx.filter (GPU-accelerated
 * di Chromium/Safari modern), lalu overlay tint / grain / vignette sesuai preset.
 * Face-aware beauty (smoothing + face-mask blending) dipisah ke beauty.ts karena
 * butuh MediaPipe landmarks.
 */

import type { FilterPreset, FilterPresetId } from '$lib/types';
import { FILTER_PRESETS } from '$lib/constants';

const PRESET_MAP: Record<FilterPresetId, FilterPreset> = Object.fromEntries(
  FILTER_PRESETS.map((p) => [p.id, p])
) as Record<FilterPresetId, FilterPreset>;

export function getPreset(id: FilterPresetId): FilterPreset {
  return PRESET_MAP[id] ?? PRESET_MAP.none;
}

export interface RenderOptions {
  mirror?: boolean;
  /** Jika true, post-effects (grain/vignette) tidak digambar untuk menghemat CPU di preview. */
  skipPostEffects?: boolean;
}

/**
 * Gambar satu frame video ke canvas target dengan preset filter.
 * Canvas harus sudah disetel ke ukuran yang diinginkan sebelum dipanggil.
 */
export function renderFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  presetId: FilterPresetId,
  options: RenderOptions = {}
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const preset = getPreset(presetId);
  const { width, height } = canvas;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Mirror untuk tampilan selfie.
  if (options.mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  // Apply CSS filter string.
  ctx.filter = preset.cssFilter;
  drawVideoCover(ctx, video, width, height);
  ctx.filter = 'none';

  ctx.restore();

  // Tint overlay.
  if (preset.tint) {
    ctx.save();
    ctx.globalCompositeOperation = preset.tint.blend;
    ctx.globalAlpha = preset.tint.alpha;
    ctx.fillStyle = preset.tint.color;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  if (!options.skipPostEffects && preset.postEffects) {
    if (preset.postEffects.includes('vignette')) drawVignette(ctx, width, height);
    if (preset.postEffects.includes('grain')) drawGrain(ctx, width, height);
  }
}

/**
 * Gambar video mirip CSS `object-fit: cover` - crop tengah kalau aspect mismatch.
 */
function drawVideoCover(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  targetW: number,
  targetH: number
) {
  const sourceW = video.videoWidth || targetW;
  const sourceH = video.videoHeight || targetH;
  if (sourceW === 0 || sourceH === 0) return;

  const targetRatio = targetW / targetH;
  const sourceRatio = sourceW / sourceH;

  let sx = 0;
  let sy = 0;
  let sw = sourceW;
  let sh = sourceH;

  if (sourceRatio > targetRatio) {
    // Source lebih lebar - crop kiri/kanan.
    sw = sourceH * targetRatio;
    sx = (sourceW - sw) / 2;
  } else if (sourceRatio < targetRatio) {
    // Source lebih tinggi - crop atas/bawah.
    sh = sourceW / targetRatio;
    sy = (sourceH - sh) / 2;
  }

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, targetW, targetH);
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const gradient = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Grain ringan - sample noise pattern per frame. Dibatasi ukuran 512 untuk
 * menghemat CPU; di-tile via pattern.
 */
let grainPattern: CanvasPattern | null = null;
let grainPatternForKey = '';

function getOrCreateGrain(): CanvasPattern | null {
  const key = 'static';
  if (grainPattern && grainPatternForKey === key) return grainPattern;
  const size = 128;
  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const offCtx = off.getContext('2d');
  if (!offCtx) return null;
  const img = offCtx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() * 64 - 32);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 24; // alpha rendah biar halus.
  }
  offCtx.putImageData(img, 0, 0);
  const target = document.createElement('canvas').getContext('2d');
  if (!target) return null;
  grainPattern = target.createPattern(off, 'repeat');
  grainPatternForKey = key;
  return grainPattern;
}

function drawGrain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const pattern = getOrCreateGrain();
  if (!pattern) return;
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
