import type { FilterPreset, LayoutDef } from './types';

export const LAYOUTS: readonly LayoutDef[] = [
  {
    id: 'single',
    label: 'Single',
    description: '1 foto tunggal dengan frame.',
    shotCount: 1,
    outputAspect: 4 / 5,
    shotIntervalMs: 0
  },
  {
    id: 'strip',
    label: 'Strip 4',
    description: '4 foto vertikal klasik photobooth.',
    shotCount: 4,
    outputAspect: 2 / 6,
    shotIntervalMs: 1200
  },
  {
    id: 'grid',
    label: 'Grid 2x2',
    description: '4 foto disusun 2x2.',
    shotCount: 4,
    outputAspect: 1,
    shotIntervalMs: 1200
  },
  {
    id: 'gif',
    label: 'GIF',
    description: 'Boomerang animasi loop.',
    shotCount: 12,
    outputAspect: 1,
    shotIntervalMs: 120
  }
] as const;

export const FILTER_PRESETS: readonly FilterPreset[] = [
  { id: 'none', label: 'None', cssFilter: 'none' },
  {
    id: 'natural',
    label: 'Natural',
    cssFilter: 'saturate(1.08) contrast(1.05) brightness(1.03)'
  },
  {
    id: 'beauty',
    label: 'Beauty',
    cssFilter: 'saturate(1.05) brightness(1.06) contrast(0.98)',
    requiresFaceMask: true
  },
  {
    id: 'glow',
    label: 'Glow',
    cssFilter: 'brightness(1.12) saturate(1.1) contrast(1.02)',
    tint: { color: '#fff4c2', alpha: 0.12, blend: 'soft-light' }
  },
  {
    id: 'vintage',
    label: 'Vintage',
    cssFilter: 'sepia(0.45) contrast(1.1) saturate(0.9) brightness(0.95)',
    postEffects: ['grain', 'vignette']
  },
  {
    id: 'mono',
    label: 'Mono',
    cssFilter: 'grayscale(1) contrast(1.15) brightness(1.02)'
  },
  {
    id: 'pinky',
    label: 'Pinky',
    cssFilter: 'hue-rotate(-8deg) saturate(1.2) brightness(1.05)',
    tint: { color: '#ffb5d0', alpha: 0.18, blend: 'multiply' }
  },
  {
    id: 'film',
    label: 'Film',
    cssFilter: 'contrast(1.12) saturate(0.92) brightness(0.98)',
    tint: { color: '#c9a876', alpha: 0.1, blend: 'overlay' },
    postEffects: ['grain']
  },
  {
    id: 'cool',
    label: 'Cool',
    cssFilter: 'hue-rotate(12deg) saturate(0.9) brightness(1.02)',
    tint: { color: '#9ec9ff', alpha: 0.14, blend: 'multiply' }
  }
] as const;

export const DEFAULT_COUNTDOWN_SECONDS = 3;

/** Ukuran output final — diambil dari layout outputAspect. Basis 1080. */
export const OUTPUT_BASE_WIDTH = 1080;

/** MediaPipe CDN paths. */
export const MEDIAPIPE_WASM_BASE =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm';
export const FACE_LANDMARKER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
export const SELFIE_SEGMENTER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite';

/** PeerJS config — pakai cloud signaling default. */
export const PEERJS_OPTIONS = {
  debug: 1
};

/** Session gallery: item auto-prune setelah durasi ini. */
export const GALLERY_TTL_MS = 24 * 60 * 60 * 1000;
