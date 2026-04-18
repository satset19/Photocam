/**
 * Konstruksi face mask dari hasil FaceLandmarker (468 landmark MediaPipe).
 *
 * Kita pakai subset indeks "silhouette" (outline wajah) untuk path utama,
 * lalu feather edge pakai shadowBlur supaya batas mask halus (tidak seperti stiker kasar).
 *
 * Index silhouette dari dokumentasi resmi MediaPipe FaceMesh:
 * https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
 */

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

// Silhouette = outline wajah searah jarum jam, 36 titik.
const SILHOUETTE_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
  176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
];

export interface FaceMaskOptions {
  /** Skala ekspansi mask (1.0 = persis silhouette). Sedikit > 1 untuk menutup tepi rambut. */
  dilate?: number;
  /** Lebar feather edge dalam piksel. */
  feather?: number;
}

/**
 * Gambar face mask ke canvas putih-di-hitam. Canvas harus sudah disetel ukuran
 * sesuai target (width/height). Return true kalau mask berhasil digambar.
 */
export function drawFaceMask(
  canvas: HTMLCanvasElement,
  landmarks: NormalizedLandmark[] | null | undefined,
  options: FaceMaskOptions = {}
): boolean {
  const ctx = canvas.getContext('2d');
  if (!ctx || !landmarks || landmarks.length === 0) return false;

  const { width, height } = canvas;
  const dilate = options.dilate ?? 1.05;
  const feather = options.feather ?? 12;

  // Hitung centroid untuk dilate dari titik pusat wajah.
  let cx = 0;
  let cy = 0;
  for (const idx of SILHOUETTE_INDICES) {
    cx += landmarks[idx].x;
    cy += landmarks[idx].y;
  }
  cx /= SILHOUETTE_INDICES.length;
  cy /= SILHOUETTE_INDICES.length;

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  for (let i = 0; i < SILHOUETTE_INDICES.length; i += 1) {
    const idx = SILHOUETTE_INDICES[i];
    const lm = landmarks[idx];
    // Dilate keluar dari centroid.
    const x = (cx + (lm.x - cx) * dilate) * width;
    const y = (cy + (lm.y - cy) * dilate) * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Feather lewat shadowBlur - paint fill putih berjejak ke shadow biru sebagai haze.
  ctx.shadowBlur = feather;
  ctx.shadowColor = '#ffffff';
  ctx.fillStyle = '#ffffff';
  // Gambar beberapa kali supaya shadowBlur akumulatif (halus).
  for (let i = 0; i < 3; i += 1) ctx.fill();
  ctx.restore();

  return true;
}
