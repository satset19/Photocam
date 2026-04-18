/**
 * Definisi geometri layout output. Ukuran basis = OUTPUT_BASE_WIDTH × (OUTPUT_BASE_WIDTH/outputAspect).
 * Semua koordinat relatif 0..1 terhadap canvas final, dikalikan ukuran render saat composing.
 */

import type { LayoutId } from '$lib/types';

export interface LayoutSlot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutSpec {
  id: LayoutId;
  aspect: number;
  background: string; // CSS color / gradient
  padding: number; // sebagai fraction of width
  slots: LayoutSlot[];
  captionArea?: LayoutSlot;
}

export const LAYOUT_SPECS: Record<LayoutId, LayoutSpec> = {
  single: {
    id: 'single',
    aspect: 4 / 5,
    background: '#ffffff',
    padding: 0.03,
    slots: [{ x: 0.03, y: 0.03, w: 0.94, h: 0.84 }],
    captionArea: { x: 0.03, y: 0.88, w: 0.94, h: 0.08 }
  },
  strip: {
    id: 'strip',
    aspect: 2 / 6,
    background: '#ffffff',
    padding: 0.04,
    // 4 slot vertikal, tiap slot tinggi sekitar 22% + celah.
    slots: [
      { x: 0.06, y: 0.03, w: 0.88, h: 0.215 },
      { x: 0.06, y: 0.255, w: 0.88, h: 0.215 },
      { x: 0.06, y: 0.48, w: 0.88, h: 0.215 },
      { x: 0.06, y: 0.705, w: 0.88, h: 0.215 }
    ],
    captionArea: { x: 0.06, y: 0.93, w: 0.88, h: 0.05 }
  },
  grid: {
    id: 'grid',
    aspect: 1,
    background: '#ffffff',
    padding: 0.03,
    slots: [
      { x: 0.03, y: 0.03, w: 0.465, h: 0.465 },
      { x: 0.505, y: 0.03, w: 0.465, h: 0.465 },
      { x: 0.03, y: 0.505, w: 0.465, h: 0.465 },
      { x: 0.505, y: 0.505, w: 0.465, h: 0.465 }
    ]
  },
  gif: {
    id: 'gif',
    aspect: 1,
    background: '#000000',
    padding: 0,
    slots: [{ x: 0, y: 0, w: 1, h: 1 }]
  }
};
