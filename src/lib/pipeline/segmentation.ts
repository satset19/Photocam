/**
 * Background replace - pakai confidence mask dari MediaPipe ImageSegmenter
 * (selfie segmenter). Mask adalah Float32Array/Uint8Array per piksel.
 */

import type { ImageSegmenterResult, MPMask } from '@mediapipe/tasks-vision';

const maskCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;

export interface SegmentOptions {
  sourceCanvas: HTMLCanvasElement;
  segmentation: ImageSegmenterResult | null;
  /** Background image (ukuran apapun, akan di-cover). Null = gradient fallback. */
  background: HTMLImageElement | HTMLCanvasElement | null;
}

function maskToAlpha(mask: MPMask, width: number, height: number): ImageData | null {
  if (!maskCanvas) return null;
  const ctx = maskCanvas.getContext('2d');
  if (!ctx) return null;

  maskCanvas.width = width;
  maskCanvas.height = height;
  const imageData = ctx.createImageData(width, height);

  // MPMask has methods to access underlying data; versi web expose getAsFloat32Array.
  let data: Float32Array | Uint8Array | null = null;
  try {
    data = mask.getAsFloat32Array();
  } catch {
    try {
      data = mask.getAsUint8Array();
    } catch {
      data = null;
    }
  }
  if (!data) return null;

  const isFloat = data instanceof Float32Array;
  for (let i = 0, p = 0; i < data.length; i += 1, p += 4) {
    const raw = data[i];
    const alpha = isFloat ? Math.round(raw * 255) : raw;
    imageData.data[p] = 255;
    imageData.data[p + 1] = 255;
    imageData.data[p + 2] = 255;
    imageData.data[p + 3] = alpha;
  }
  return imageData;
}

/**
 * Composite foreground (source) di atas background menggunakan mask.
 * Hasil ditulis kembali ke sourceCanvas.
 */
export function applyBackgroundReplace(opts: SegmentOptions): void {
  if (!maskCanvas) return;
  const { sourceCanvas, segmentation, background } = opts;
  const ctx = sourceCanvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = sourceCanvas;

  if (!segmentation || !segmentation.confidenceMasks?.length) return;
  const mask = segmentation.confidenceMasks[0];
  const alphaImage = maskToAlpha(mask, width, height);
  if (!alphaImage) return;

  // Step 1: tulis source ke cache canvas, lalu clip via destination-in pakai mask alpha.
  const fg = document.createElement('canvas');
  fg.width = width;
  fg.height = height;
  const fgCtx = fg.getContext('2d');
  if (!fgCtx) return;
  fgCtx.drawImage(sourceCanvas, 0, 0);

  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return;
  maskCtx.putImageData(alphaImage, 0, 0);

  fgCtx.globalCompositeOperation = 'destination-in';
  fgCtx.drawImage(maskCanvas, 0, 0);
  fgCtx.globalCompositeOperation = 'source-over';

  // Step 2: gambar background baru ke sourceCanvas, lalu tempel fg di atasnya.
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  if (background) {
    drawCover(ctx, background, width, height);
  } else {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#8b5cf6');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(fg, 0, 0);
  ctx.restore();
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  targetW: number,
  targetH: number
) {
  const sourceW = 'naturalWidth' in img ? img.naturalWidth : img.width;
  const sourceH = 'naturalHeight' in img ? img.naturalHeight : img.height;
  if (!sourceW || !sourceH) return;
  const sourceRatio = sourceW / sourceH;
  const targetRatio = targetW / targetH;
  let sx = 0,
    sy = 0,
    sw = sourceW,
    sh = sourceH;
  if (sourceRatio > targetRatio) {
    sw = sourceH * targetRatio;
    sx = (sourceW - sw) / 2;
  } else if (sourceRatio < targetRatio) {
    sh = sourceW / targetRatio;
    sy = (sourceH - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
}
