// Domain types yang dipakai lintas modul.
// Dipisah dari stores supaya bisa diimport tanpa menarik side-effect Svelte 5 runes.

export type LayoutId = 'single' | 'strip' | 'grid' | 'gif';

export interface LayoutDef {
  id: LayoutId;
  label: string;
  description: string;
  /** Jumlah shot yang harus diambil untuk menghasilkan 1 output. */
  shotCount: number;
  /** Rasio aspek output final (w:h). */
  outputAspect: number;
  /** Jeda antar shot (ms) untuk mode multi-shot. */
  shotIntervalMs: number;
}

export type FilterPresetId =
  | 'none'
  | 'natural'
  | 'beauty'
  | 'glow'
  | 'vintage'
  | 'mono'
  | 'pinky'
  | 'film'
  | 'cool';

export interface FilterPreset {
  id: FilterPresetId;
  label: string;
  /** CSS filter string, applied cepat ke ctx.filter. "none" kalau tidak ada. */
  cssFilter: string;
  /** Butuh face-aware pipeline (beauty pass). */
  requiresFaceMask?: boolean;
  /** Overlay tint hex + opacity, optional. */
  tint?: { color: string; alpha: number; blend: GlobalCompositeOperation };
  /** Tambahan grain/vignette. */
  postEffects?: Array<'grain' | 'vignette'>;
}

export interface CapturedShot {
  id: string;
  /** PNG Blob hasil capture, sudah termasuk filter + overlay saat capture. */
  blob: Blob;
  /** Data URL cache untuk preview cepat. */
  dataUrl: string;
  /** Ukuran piksel source. */
  width: number;
  height: number;
  takenAt: number;
}

export interface ComposedOutput {
  id: string;
  layout: LayoutId;
  blob: Blob;
  mimeType: 'image/png' | 'image/jpeg' | 'image/gif';
  width: number;
  height: number;
  createdAt: number;
  /** Referensi shot yang dipakai (untuk recompose / edit). */
  shotIds: string[];
  /** Preset yang dipakai saat capture. */
  filterId: FilterPresetId;
  /** Strip theme yang diterapkan ke output. */
  stripThemeId?: import('./stripThemes/types').StripThemeId;
}

export type ThemeId = 'minimalist' | 'kawaii' | 'playful';

export interface StickerDef {
  id: string;
  label: string;
  category: 'cute' | 'accessory' | 'text' | 'seasonal';
  src: string;
  /** Anchor landmark index (MediaPipe 468-point) — kalau ada, sticker auto-follow face. */
  anchorLandmark?: number;
  /** Ukuran relatif terhadap lebar wajah. */
  scaleRelative?: number;
}

export interface FrameDef {
  id: string;
  label: string;
  /** PNG dengan transparent center, akan di-stretch ke ukuran output. */
  src: string;
  /** Margin dalam px untuk area foto (biar tidak terpotong frame). */
  photoInset: { top: number; right: number; bottom: number; left: number };
}
