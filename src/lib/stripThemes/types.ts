/**
 * Strip theme = skin dekoratif untuk layout output (strip, grid, single).
 *
 * Decoration dua tipe:
 *   - kind='image': asset SVG/PNG via `src`.
 *   - kind='text': glyph (emoji, huruf) dirender via Canvas2D fillText.
 * Text decorations jauh lebih ringan (tidak perlu asset file) - cocok untuk
 * menambah puluhan theme tanpa mengembang bundle.
 *
 * Koordinat semua dec relatif canvas output (0..1) supaya kompatibel lintas layout.
 */

export type StripThemeId = string;

export type DecorationPlacement = 'background' | 'foreground';

/**
 * Override slot per-theme. Koordinat x/y/w/h relatif terhadap canvas (0..1).
 * rotation dalam derajat, radius fraction 0..1 dari min(w,h).
 * perSlotDecorations koordinat relatif TERHADAP slot (0..1 dari slot w/h).
 */
export interface SlotOverride {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  radius?: number;
  /** Override border khusus slot. null = tanpa border, undefined = ikut theme. */
  border?: { color: string; width: number } | null;
  perSlotDecorations?: Decoration[];
}

/** Override per-layout (strip/grid/single). */
export interface LayoutOverride {
  /** Slot custom (harus jumlah sama dengan default layout, kecuali kalau ditambah shotCount=1 untuk single). */
  slots?: SlotOverride[];
  /** Override aspect ratio output: width/height. */
  aspect?: number;
  /** Background color/gradient override per-layout. */
  background?: { kind: 'solid' | 'linear'; value: string };
  /** Decoration tambahan yang hanya muncul di layout ini. */
  decorations?: Decoration[];
  /** Header area di atas slot (opsional). */
  header?: {
    text: string;
    font: string;
    color: string;
    /** Posisi y relatif (0..1). x selalu center. */
    y: number;
  };
  /** Footer / caption override. */
  footer?: {
    text: string;
    font: string;
    color: string;
    y?: number;
  };
  /** Skip caption default (kalau layout sudah punya text tersendiri). */
  skipCaption?: boolean;
}

interface PositionedDecoration {
  /** Posisi x relatif 0..1 (anchor titik tengah). */
  x: number;
  /** Posisi y relatif 0..1 (anchor titik tengah). */
  y: number;
  rotation?: number;
  opacity?: number;
  placement: DecorationPlacement;
}

export interface ImageDecoration extends PositionedDecoration {
  kind: 'image';
  /** Ukuran (width) relatif thd lebar canvas; height auto dari aspect ratio gambar. */
  size: number;
  src: string;
}

export interface TextDecoration extends PositionedDecoration {
  kind: 'text';
  /** Font-size relatif thd lebar canvas. */
  size: number;
  text: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: number | string;
}

/**
 * Rectangle/bar - untuk washi tape, polaroid card bg, rainbow stripe,
 * film rail, ticket perforasi, dll. w/h independen (tidak pakai field `size`).
 */
export interface RectDecoration extends PositionedDecoration {
  kind: 'rect';
  /** Lebar relatif thd lebar canvas. */
  w: number;
  /** Tinggi relatif thd tinggi canvas. */
  h: number;
  color: string;
  stroke?: { color: string; width: number };
  /** Corner radius fraction 0..1 dari min(w*canvasW, h*canvasH). */
  radius?: number;
}

export type Decoration = ImageDecoration | TextDecoration | RectDecoration;

export type ThemeCategory =
  | 'minimalist'
  | 'cute'
  | 'aesthetic'
  | 'seasonal'
  | 'fandom'
  | 'nature'
  | 'travel'
  | 'retro'
  | 'bold'
  | 'dark'
  | 'food'
  | 'pride';

export interface StripTheme {
  id: StripThemeId;
  label: string;
  tagline: string;
  /** CSS preview untuk thumbnail fallback (dipakai kalau canvas thumbnail belum ready). */
  preview: string;
  /** Tag untuk filtering/search. */
  tags: ThemeCategory[];
  /** Extra search keywords (nama asosiasi, trend, dll). */
  keywords?: string[];
  /** Background canvas saat rendering (CSS color / linear-gradient). */
  background: {
    kind: 'solid' | 'linear';
    value: string;
  };
  caption: {
    text: string; // support token {date}
    font: string; // CSS font shorthand
    color: string;
  };
  decorations: Decoration[];
  /** Border default di sekeliling slot foto. */
  slotBorder?: {
    color: string;
    width: number;
    radius: number;
  };
  /** Override per-layout: memungkinkan tiap layout punya geometri, aspect, dan deco unik. */
  layouts?: {
    strip?: LayoutOverride;
    grid?: LayoutOverride;
    single?: LayoutOverride;
  };
}
