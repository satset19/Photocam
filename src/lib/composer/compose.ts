/**
 * Komposisi final: susun shots ke template layout jadi single image (PNG) atau GIF.
 *
 * Tiap theme boleh override per-layout: slot positions, rotation, aspect, deco tambahan,
 * header + footer text. Ini yang membuat setiap theme punya "rasa" sendiri
 * (mis. Polaroid tilted, Newspaper headline, K-idol 1+3 hero layout).
 *
 * GIF tetap fullscreen tanpa theme (per-frame akan flicker).
 */

import type { CapturedShot, ComposedOutput, FilterPresetId, LayoutId } from '$lib/types';
import { LAYOUT_SPECS, type LayoutSpec } from './layouts';
import { OUTPUT_BASE_WIDTH } from '$lib/constants';
import { encodeGif } from '$lib/capture/gifCapture';
import { makeId } from '$lib/utils/id';
import type {
  Decoration,
  ImageDecoration,
  LayoutOverride,
  SlotOverride,
  StripTheme,
  StripThemeId
} from '$lib/stripThemes/types';
import { getStripTheme } from '$lib/stripThemes/registry';

export interface ComposeOptions {
  layout: LayoutId;
  shots: CapturedShot[];
  filterId: FilterPresetId;
  stripThemeId?: StripThemeId;
  caption?: string;
  accentColor?: string;
}

export async function composeOutput(opts: ComposeOptions): Promise<ComposedOutput> {
  if (opts.layout === 'gif') {
    return composeGif(opts);
  }
  return composeStatic(opts);
}

async function composeStatic(opts: ComposeOptions): Promise<ComposedOutput> {
  const theme = getStripTheme(opts.stripThemeId ?? 'classic');
  const spec = LAYOUT_SPECS[opts.layout];
  const override = getLayoutOverride(theme, opts.layout);

  const aspect = override?.aspect ?? spec.aspect;
  const width = OUTPUT_BASE_WIDTH;
  const height = Math.round(OUTPUT_BASE_WIDTH / aspect);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context tidak tersedia.');

  // 1. Background (override > theme > fallback).
  const bgSource = override?.background ?? theme.background;
  paintBackground(ctx, bgSource, width, height);

  // Consolidated decoration list (theme + layout override).
  const allDecorations: Decoration[] = [
    ...theme.decorations,
    ...(override?.decorations ?? [])
  ];

  // 2. Load semua asset paralel.
  const [shotImages, decorationImages] = await Promise.all([
    Promise.all(opts.shots.map((s) => blobToBitmap(s.blob))),
    loadDecorations(allDecorations)
  ]);

  // 3. Background-placement decorations.
  drawDecorations(
    ctx,
    allDecorations,
    decorationImages,
    'background',
    width,
    height,
    theme.caption.color
  );

  // 4. Header text (sebelum slot di-draw).
  if (override?.header) {
    const h = override.header;
    ctx.save();
    ctx.fillStyle = h.color;
    ctx.font = scaleFont(h.font, height / 1600);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(resolveCaption(h.text), width / 2, h.y * height);
    ctx.restore();
  }

  // 5. Draw slots (dengan override kalau ada).
  const slots = override?.slots ?? spec.slots.map((s) => ({ ...s } as SlotOverride));
  for (let i = 0; i < slots.length; i += 1) {
    const slot = slots[i];
    const img = shotImages[i] ?? shotImages[shotImages.length - 1];
    if (!img) continue;
    drawSlot(ctx, img, slot, width, height, theme);
    // Per-slot decoration (masking tape, film hole, speech bubble).
    if (slot.perSlotDecorations && slot.perSlotDecorations.length > 0) {
      await drawPerSlotDecorations(ctx, slot, slot.perSlotDecorations, width, height, theme.caption.color);
    }
  }

  // 6. Foreground decorations di atas semua slot.
  drawDecorations(
    ctx,
    allDecorations,
    decorationImages,
    'foreground',
    width,
    height,
    theme.caption.color
  );

  // 7. Footer / caption.
  if (!override?.skipCaption) {
    const footer = override?.footer;
    const captionText = footer
      ? resolveCaption(footer.text)
      : opts.caption ?? resolveCaption(theme.caption.text);
    const captionFont = footer?.font ?? theme.caption.font;
    const captionColor = footer?.color ?? theme.caption.color;
    const captionY =
      footer?.y !== undefined ? footer.y : spec.captionArea ? spec.captionArea.y + spec.captionArea.h / 2 : 0.96;

    ctx.save();
    ctx.fillStyle = captionColor;
    ctx.font = scaleFont(captionFont, height / 1600);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(captionText.trim(), width / 2, captionY * height);
    ctx.restore();
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png', 0.95)
  );
  if (!blob) throw new Error('Gagal encode output PNG.');

  return {
    id: makeId('out'),
    layout: opts.layout,
    blob,
    mimeType: 'image/png',
    width,
    height,
    createdAt: Date.now(),
    shotIds: opts.shots.map((s) => s.id),
    filterId: opts.filterId,
    stripThemeId: theme.id
  };
}

async function composeGif(opts: ComposeOptions): Promise<ComposedOutput> {
  const size = OUTPUT_BASE_WIDTH;
  const frames: HTMLCanvasElement[] = [];
  const images = await Promise.all(opts.shots.map((s) => blobToBitmap(s.blob)));
  for (const img of images) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) continue;
    drawSlot(ctx, img, { x: 0, y: 0, w: 1, h: 1 }, size, size);
    frames.push(c);
  }

  const blob = await encodeGif(frames, {
    delay: 100,
    quality: 12,
    width: size,
    height: size,
    boomerang: true
  });

  return {
    id: makeId('out'),
    layout: 'gif',
    blob,
    mimeType: 'image/gif',
    width: size,
    height: size,
    createdAt: Date.now(),
    shotIds: opts.shots.map((s) => s.id),
    filterId: opts.filterId,
    stripThemeId: opts.stripThemeId
  };
}

/* ---------------- helpers ---------------- */

function getLayoutOverride(theme: StripTheme, layout: LayoutId): LayoutOverride | undefined {
  if (layout === 'gif') return undefined;
  return theme.layouts?.[layout];
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  bg: { kind: 'solid' | 'linear'; value: string },
  width: number,
  height: number
) {
  ctx.save();
  if (bg.kind === 'solid') {
    ctx.fillStyle = bg.value;
    ctx.fillRect(0, 0, width, height);
  } else {
    const parsed = parseGradient(bg.value);
    if (parsed) {
      const grad = ctx.createLinearGradient(
        parsed.x1 * width,
        parsed.y1 * height,
        parsed.x2 * width,
        parsed.y2 * height
      );
      for (const stop of parsed.stops) grad.addColorStop(stop.offset, stop.color);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

interface ParsedGradient {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: Array<{ offset: number; color: string }>;
}

function parseGradient(css: string): ParsedGradient | null {
  const match = css.match(/linear-gradient\(([^)]+)\)/i);
  if (!match) return null;
  const parts = splitTopLevelCommas(match[1]);
  if (parts.length < 2) return null;

  let angleDeg = 180;
  let stopStart = 0;
  const first = parts[0].trim();
  if (/deg$/i.test(first) || /^to\s/i.test(first)) {
    if (/deg$/i.test(first)) angleDeg = parseFloat(first);
    stopStart = 1;
  }

  const stops: Array<{ offset: number; color: string }> = [];
  const stopParts = parts.slice(stopStart);
  for (let i = 0; i < stopParts.length; i += 1) {
    const seg = stopParts[i].trim();
    const pctMatch = seg.match(/(.+?)\s+(-?\d+(?:\.\d+)?)%\s*$/);
    let color = seg;
    let offset = i / Math.max(1, stopParts.length - 1);
    if (pctMatch) {
      color = pctMatch[1].trim();
      offset = Math.max(0, Math.min(1, parseFloat(pctMatch[2]) / 100));
    }
    stops.push({ offset, color });
  }

  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const cx = 0.5;
  const cy = 0.5;
  const dx = Math.cos(rad) * 0.5;
  const dy = Math.sin(rad) * 0.5;
  return { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy, stops };
}

function splitTopLevelCommas(input: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let buf = '';
  for (const ch of input) {
    if (ch === '(') depth += 1;
    else if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      out.push(buf);
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf) out.push(buf);
  return out;
}

const EMOJI_FONT_STACK =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", system-ui, sans-serif';

async function loadDecorations(
  decorations: readonly Decoration[]
): Promise<Array<HTMLImageElement | null>> {
  return Promise.all(
    decorations.map((d) => {
      if (d.kind !== 'image') return Promise.resolve(null);
      const dec = d as ImageDecoration;
      return new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = dec.src;
      });
    })
  );
}

function drawDecorations(
  ctx: CanvasRenderingContext2D,
  decorations: readonly Decoration[],
  images: Array<HTMLImageElement | null>,
  placement: Decoration['placement'],
  width: number,
  height: number,
  themeFallbackColor: string
) {
  decorations.forEach((dec, i) => {
    if (dec.placement !== placement) return;
    renderDecoration(ctx, dec, images[i] ?? null, width, height, themeFallbackColor);
  });
}

/** Draw decorations yang koordinatnya relatif slot (0..1 → slot local). */
async function drawPerSlotDecorations(
  ctx: CanvasRenderingContext2D,
  slot: SlotOverride,
  decorations: readonly Decoration[],
  canvasW: number,
  canvasH: number,
  themeFallbackColor: string
) {
  const slotX = slot.x * canvasW;
  const slotY = slot.y * canvasH;
  const slotW = slot.w * canvasW;
  const slotH = slot.h * canvasH;

  // Resolve image sources paralel (sync kalau emoji).
  const images = await loadDecorations(decorations);

  // Apply slot rotation kalau ada — supaya deco ikut miring bersama foto.
  ctx.save();
  if (slot.rotation) {
    const cx = slotX + slotW / 2;
    const cy = slotY + slotH / 2;
    ctx.translate(cx, cy);
    ctx.rotate((slot.rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  decorations.forEach((dec, i) => {
    // Koordinat dec relatif slot (0..1 di local space) → konversi ke koordinat canvas.
    // Scale faktor dipakai canvas-relative supaya ukuran konsisten.
    let absolute: Decoration;
    const mappedX = slot.x + dec.x * slot.w;
    const mappedY = slot.y + dec.y * slot.h;
    if (dec.kind === 'rect') {
      absolute = {
        ...dec,
        x: mappedX,
        y: mappedY,
        w: dec.w * slot.w,
        h: dec.h * slot.h
      };
    } else {
      absolute = {
        ...dec,
        x: mappedX,
        y: mappedY,
        size: dec.size * slot.w
      };
    }
    renderDecoration(ctx, absolute, images[i] ?? null, canvasW, canvasH, themeFallbackColor);
  });

  ctx.restore();
}

function renderDecoration(
  ctx: CanvasRenderingContext2D,
  dec: Decoration,
  img: HTMLImageElement | null,
  width: number,
  height: number,
  themeFallbackColor: string
) {
  ctx.save();
  ctx.globalAlpha = dec.opacity ?? 1;

  if (dec.kind === 'image') {
    if (!img || !img.complete || img.naturalWidth === 0) {
      ctx.restore();
      return;
    }
    const drawW = dec.size * width;
    const ratio = img.naturalHeight / img.naturalWidth;
    const drawH = drawW * ratio;
    const cx = dec.x * width + drawW / 2;
    const cy = dec.y * height + drawH / 2;
    ctx.translate(cx, cy);
    if (dec.rotation) ctx.rotate((dec.rotation * Math.PI) / 180);
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  } else if (dec.kind === 'text') {
    const fontPx = Math.max(10, dec.size * width);
    const family = dec.fontFamily ?? EMOJI_FONT_STACK;
    const weight = dec.fontWeight ?? 400;
    ctx.font = `${weight} ${fontPx}px ${family}`;
    ctx.fillStyle = dec.color ?? themeFallbackColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cx = dec.x * width;
    const cy = dec.y * height;
    ctx.translate(cx, cy);
    if (dec.rotation) ctx.rotate((dec.rotation * Math.PI) / 180);
    ctx.fillText(dec.text, 0, 0);
  } else {
    // rect
    const w = dec.w * width;
    const h = dec.h * height;
    const cx = dec.x * width;
    const cy = dec.y * height;
    ctx.translate(cx, cy);
    if (dec.rotation) ctx.rotate((dec.rotation * Math.PI) / 180);
    const r = Math.min(w, h) * (dec.radius ?? 0);
    roundedRectPath(ctx, -w / 2, -h / 2, w, h, r);
    ctx.fillStyle = dec.color;
    ctx.fill();
    if (dec.stroke && dec.stroke.width > 0) {
      ctx.strokeStyle = dec.stroke.color;
      ctx.lineWidth = dec.stroke.width;
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawSlot(
  ctx: CanvasRenderingContext2D,
  img: ImageBitmap,
  slot: SlotOverride | { x: number; y: number; w: number; h: number },
  canvasW: number,
  canvasH: number,
  theme?: StripTheme
) {
  const dx = slot.x * canvasW;
  const dy = slot.y * canvasH;
  const dw = slot.w * canvasW;
  const dh = slot.h * canvasH;
  const so = slot as SlotOverride;
  const radiusFrac =
    so.radius !== undefined ? so.radius : theme?.slotBorder?.radius ?? 0.04;
  const radius = Math.min(dw, dh) * radiusFrac;
  const rotation = so.rotation ?? 0;

  ctx.save();
  // Rotate around slot center kalau ada rotation.
  if (rotation) {
    const cx = dx + dw / 2;
    const cy = dy + dh / 2;
    ctx.translate(cx, cy);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  // Clip rounded rect.
  ctx.save();
  roundedRectPath(ctx, dx, dy, dw, dh, radius);
  ctx.clip();

  // Cover-fit.
  const sourceRatio = img.width / img.height;
  const slotRatio = dw / dh;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;
  if (sourceRatio > slotRatio) {
    sw = img.height * slotRatio;
    sx = (img.width - sw) / 2;
  } else if (sourceRatio < slotRatio) {
    sh = img.width / slotRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.restore();

  // Border.
  const effectiveBorder = so.border === null ? null : so.border ?? theme?.slotBorder ?? null;
  if (effectiveBorder && effectiveBorder.width > 0) {
    ctx.strokeStyle = effectiveBorder.color;
    ctx.lineWidth = effectiveBorder.width;
    roundedRectPath(ctx, dx, dy, dw, dh, radius);
    ctx.stroke();
  }

  ctx.restore();
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function blobToBitmap(blob: Blob): Promise<ImageBitmap> {
  return createImageBitmap(blob);
}

function resolveCaption(template: string): string {
  return template.replace('{date}', formatDate());
}

function scaleFont(fontCss: string, scale: number): string {
  return fontCss.replace(/(\d+(?:\.\d+)?)px/, (_m, n) => {
    const scaled = Math.max(14, Math.round(parseFloat(n) * scale * 1.6));
    return `${scaled}px`;
  });
}

function formatDate(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}
