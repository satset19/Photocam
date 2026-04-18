/**
 * Bootstrap MediaPipe Tasks Vision (FaceLandmarker + ImageSegmenter selfie).
 *
 * Di-load on-demand: bundle tasks-vision ~1MB, model ~3-5MB via CDN Google.
 * FilesetResolver.forVisionTasks mengembalikan WASM untuk backend GPU/CPU
 * (MediaPipe auto-pilih GPU kalau device mendukung WebGL2).
 *
 * Cache instance di module-level supaya tidak re-initialize antar navigasi.
 */

import {
  FaceLandmarker,
  FilesetResolver,
  ImageSegmenter,
  type FaceLandmarkerResult,
  type ImageSegmenterResult
} from '@mediapipe/tasks-vision';
import {
  FACE_LANDMARKER_MODEL,
  MEDIAPIPE_WASM_BASE,
  SELFIE_SEGMENTER_MODEL
} from '$lib/constants';

let faceLandmarker: FaceLandmarker | null = null;
let selfieSegmenter: ImageSegmenter | null = null;
let fileset: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>> | null = null;
let bootPromise: Promise<void> | null = null;

async function ensureFileset() {
  if (!fileset) fileset = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_BASE);
  return fileset;
}

/**
 * Prime face landmarker (idempotent). Kalau gagal (misal WASM tidak bisa load),
 * throw supaya caller bisa fallback ke non-face-aware pipeline.
 */
export async function ensureFaceLandmarker(): Promise<FaceLandmarker> {
  if (faceLandmarker) return faceLandmarker;
  const fs = await ensureFileset();
  faceLandmarker = await FaceLandmarker.createFromOptions(fs, {
    baseOptions: {
      modelAssetPath: FACE_LANDMARKER_MODEL,
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false
  });
  return faceLandmarker;
}

export async function ensureSelfieSegmenter(): Promise<ImageSegmenter> {
  if (selfieSegmenter) return selfieSegmenter;
  const fs = await ensureFileset();
  selfieSegmenter = await ImageSegmenter.createFromOptions(fs, {
    baseOptions: {
      modelAssetPath: SELFIE_SEGMENTER_MODEL,
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    outputCategoryMask: false,
    outputConfidenceMasks: true
  });
  return selfieSegmenter;
}

/**
 * Boot keduanya sekaligus. Return promise tunggal yang reuse kalau dipanggil berkali-kali.
 */
export function ensurePipelineLoaded(): Promise<void> {
  if (!bootPromise) {
    bootPromise = Promise.all([ensureFaceLandmarker(), ensureSelfieSegmenter()]).then(
      () => undefined
    );
  }
  return bootPromise;
}

/** Utility wrapper: detect faces untuk frame tertentu. */
export function detectFacesForVideo(
  video: HTMLVideoElement,
  timestampMs: number
): FaceLandmarkerResult | null {
  if (!faceLandmarker) return null;
  try {
    return faceLandmarker.detectForVideo(video, timestampMs);
  } catch {
    return null;
  }
}

export function segmentForVideo(
  video: HTMLVideoElement,
  timestampMs: number
): ImageSegmenterResult | null {
  if (!selfieSegmenter) return null;
  try {
    return selfieSegmenter.segmentForVideo(video, timestampMs);
  } catch {
    return null;
  }
}

export function releasePipeline() {
  faceLandmarker?.close();
  selfieSegmenter?.close();
  faceLandmarker = null;
  selfieSegmenter = null;
  bootPromise = null;
}
