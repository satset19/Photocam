/**
 * Beauty pass - smoothing kulit di area wajah saja.
 *
 * Strategi: render versi blurred dari frame, lalu composite ke frame asli
 * dengan face mask sebagai alpha gate. Blur kernel pakai ctx.filter='blur(Npx)'
 * karena GPU-accelerated di browser modern.
 *
 * Level (0-100) mengatur radius blur + strength brightening.
 */

import { drawFaceMask } from './faceMask';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

const maskCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
const blurCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;

export interface BeautyOptions {
  level: number; // 0..100
  landmarks: NormalizedLandmark[] | null;
  sourceCanvas: HTMLCanvasElement;
}

/**
 * Apply beauty pass in-place pada sourceCanvas.
 * Kalau tidak ada landmarks (wajah tidak terdeteksi), apply global soft blur
 * dengan strength lebih rendah supaya hasil tetap mulus.
 */
export function applyBeauty(opts: BeautyOptions): void {
  if (!maskCanvas || !blurCanvas) return;
  const { sourceCanvas, landmarks, level } = opts;
  if (level <= 0) return;

  const { width, height } = sourceCanvas;
  const ctx = sourceCanvas.getContext('2d');
  if (!ctx) return;

  const strength = level / 100;
  const blurRadius = 3 + strength * 7; // 3..10 px

  // Render blurred copy.
  blurCanvas.width = width;
  blurCanvas.height = height;
  const blurCtx = blurCanvas.getContext('2d');
  if (!blurCtx) return;
  blurCtx.save();
  blurCtx.filter = `blur(${blurRadius}px) brightness(${1 + strength * 0.08}) saturate(${1 + strength * 0.05})`;
  blurCtx.drawImage(sourceCanvas, 0, 0);
  blurCtx.restore();

  if (landmarks && landmarks.length > 0) {
    // Mode face-aware: gate blur ke area wajah.
    maskCanvas.width = width;
    maskCanvas.height = height;
    const drawn = drawFaceMask(maskCanvas, landmarks, { dilate: 1.08, feather: Math.round(16 * strength) + 6 });
    if (drawn) {
      // Clip blurCanvas ke mask wajah. Pakai destination-in: keep blurCanvas piksel
      // yang overlap dengan mask alpha.
      blurCtx.save();
      blurCtx.globalCompositeOperation = 'destination-in';
      blurCtx.drawImage(maskCanvas, 0, 0);
      blurCtx.restore();
    }
  }

  // Blend hasil (blur yang sudah ter-mask) kembali ke source.
  ctx.save();
  ctx.globalAlpha = 0.85; // bukan 1 supaya masih ada texture asli.
  ctx.drawImage(blurCanvas, 0, 0);
  ctx.restore();
}
