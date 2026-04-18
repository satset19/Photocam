/**
 * Registry 57 strip theme. 7 theme orisinal pakai SVG assets; 50 theme tambahan
 * pakai emoji decorations (text kind) supaya bundle tetap kecil.
 *
 * Pattern design:
 *   - Background gradient dipilih agar kontras dengan glyph.
 *   - 3-6 decoration per theme (biar tidak crowded di strip aspect 2:6).
 *   - Caption template selalu ber-token `{date}` untuk dinamis.
 *   - Tags mendukung filter kategori di picker.
 */

import type { Decoration, StripTheme, StripThemeId } from './types';

// Helper untuk text decoration (emoji-based) supaya deklarasi ringkas.
function emoji(
  text: string,
  x: number,
  y: number,
  size: number,
  placement: 'background' | 'foreground' = 'foreground',
  rotation = 0,
  opacity = 1,
  color?: string
): Decoration {
  return { kind: 'text', text, x, y, size, placement, rotation, opacity, color };
}

function img(
  src: string,
  x: number,
  y: number,
  size: number,
  placement: 'background' | 'foreground' = 'foreground',
  rotation = 0,
  opacity = 1
): Decoration {
  return { kind: 'image', src, x, y, size, placement, rotation, opacity };
}

/** Rectangle block — helpful buat card bg, stripe, tape, ticket perforation. */
function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  opts: {
    placement?: 'background' | 'foreground';
    rotation?: number;
    opacity?: number;
    radius?: number;
    stroke?: { color: string; width: number };
  } = {}
): Decoration {
  return {
    kind: 'rect',
    x,
    y,
    w,
    h,
    color,
    placement: opts.placement ?? 'background',
    rotation: opts.rotation ?? 0,
    opacity: opts.opacity ?? 1,
    radius: opts.radius,
    stroke: opts.stroke
  };
}

export const STRIP_THEMES: readonly StripTheme[] = [
  // ---------------- original 7 ----------------
  {
    id: 'classic',
    label: 'Classic',
    tagline: 'Polos, rapi, minimalist.',
    preview: 'linear-gradient(135deg,#ffffff,#f3f4f6)',
    tags: ['minimalist'],
    keywords: ['polos', 'simple', 'white'],
    background: { kind: 'solid', value: '#ffffff' },
    caption: {
      text: 'Photobooth · {date}',
      font: "bold 22px 'Inter', sans-serif",
      color: '#111827'
    },
    decorations: [],
    slotBorder: { color: '#111827', width: 2, radius: 0.04 }
  },
  {
    id: 'zootopia',
    label: 'Zootopia',
    tagline: 'Animal sidekick + pastel warm.',
    preview: 'linear-gradient(135deg,#ffe4b5,#f8b4a0,#ffc9d6)',
    tags: ['cute', 'fandom'],
    keywords: ['zootopia', 'rabbit', 'fox', 'animal'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(180deg,#fff1dc 0%,#ffd7c2 50%,#ffc4d6 100%)'
    },
    caption: {
      text: 'Try Everything · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#4a2218'
    },
    decorations: [
      img('/themes/zootopia/rabbit-ears.svg', 0.02, 0.0, 0.22, 'foreground', -8, 1),
      img('/themes/zootopia/fox-tail.svg', 0.72, 0.82, 0.28, 'foreground', 12, 0.9),
      img('/themes/zootopia/paw.svg', 0.04, 0.32, 0.08, 'background', -20, 0.55),
      img('/themes/zootopia/paw.svg', 0.86, 0.5, 0.07, 'background', 15, 0.55),
      img('/themes/zootopia/paw.svg', 0.05, 0.75, 0.06, 'background', 8, 0.45)
    ],
    slotBorder: { color: '#4a2218', width: 3, radius: 0.05 }
  },
  {
    id: 'cartoon',
    label: 'Cartoon',
    tagline: 'Pop-art dots + comic POW.',
    preview: 'linear-gradient(135deg,#fff176,#ff7043,#ec407a)',
    tags: ['bold'],
    keywords: ['cartoon', 'comic', 'pop'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#ffd93a 0%,#ff7b3a 55%,#ff3a7b 100%)'
    },
    caption: {
      text: 'WOW! · {date}',
      font: "900 24px 'Space Grotesk', Impact, sans-serif",
      color: '#111111'
    },
    decorations: [
      img('/themes/cartoon/halftone.svg', 0, 0, 1, 'background', 0, 0.18),
      img('/themes/cartoon/star-burst.svg', 0.72, 0.02, 0.24, 'foreground', 12, 1),
      img('/themes/cartoon/speech.svg', 0.02, 0.85, 0.4, 'foreground', -5, 1)
    ],
    slotBorder: { color: '#111111', width: 5, radius: 0.05 }
  },
  {
    id: 'anime',
    label: 'Anime',
    tagline: 'Sakura + kirakira sparkles.',
    preview: 'linear-gradient(135deg,#ffd5e5,#b3d4ff,#d9b3ff)',
    tags: ['cute', 'aesthetic'],
    keywords: ['anime', 'manga', 'japan', 'sakura'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(160deg,#ffe4f2 0%,#e2d1ff 40%,#cfe4ff 70%,#ffe4f2 100%)'
    },
    caption: {
      text: 'Kimi to Iru Hi · {date}',
      font: "italic bold 22px 'Space Grotesk', serif",
      color: '#6b2a8a'
    },
    decorations: [
      img('/themes/anime/sakura.svg', 0.04, 0.02, 0.12, 'background', -20, 0.9),
      img('/themes/anime/sakura.svg', 0.82, 0.08, 0.1, 'background', 30, 1),
      img('/themes/anime/sakura.svg', 0.75, 0.6, 0.08, 'background', 10, 0.85),
      img('/themes/anime/sakura.svg', 0.06, 0.78, 0.09, 'background', -10, 0.85),
      img('/themes/anime/sparkle.svg', 0.9, 0.3, 0.06, 'foreground', 0, 1),
      img('/themes/anime/sparkle.svg', 0.03, 0.45, 0.05, 'foreground', 0, 1),
      img('/themes/anime/sparkle.svg', 0.88, 0.88, 0.07, 'foreground', 0, 1),
      img('/themes/anime/heart.svg', 0.05, 0.92, 0.09, 'foreground', -15, 1)
    ],
    slotBorder: { color: '#ff6fa5', width: 3, radius: 0.06 },
    layouts: {
      strip: {
        aspect: 0.55,
        // Slot asimetri: kiri-kanan bergantian dengan sakura di pojok kosong.
        slots: [
          {
            x: 0.08, y: 0.1, w: 0.62, h: 0.19, radius: 0.08,
            border: { color: '#ff6fa5', width: 3 },
            perSlotDecorations: [
              img('/themes/anime/sakura.svg', 1.05, -0.05, 0.3, 'foreground', -15, 1)
            ]
          },
          {
            x: 0.3, y: 0.31, w: 0.62, h: 0.19, radius: 0.08,
            border: { color: '#ff6fa5', width: 3 },
            perSlotDecorations: [
              img('/themes/anime/sakura.svg', -0.1, -0.05, 0.28, 'foreground', 20, 1)
            ]
          },
          {
            x: 0.08, y: 0.52, w: 0.62, h: 0.19, radius: 0.08,
            border: { color: '#ff6fa5', width: 3 },
            perSlotDecorations: [
              img('/themes/anime/heart.svg', 1.04, 0.9, 0.22, 'foreground', 15, 1)
            ]
          },
          {
            x: 0.3, y: 0.73, w: 0.62, h: 0.19, radius: 0.08,
            border: { color: '#ff6fa5', width: 3 },
            perSlotDecorations: [
              img('/themes/anime/sparkle.svg', -0.08, 0.85, 0.18, 'foreground', 0, 1)
            ]
          }
        ],
        decorations: [
          img('/themes/anime/sakura.svg', 0.01, 0.01, 0.1, 'background', -20, 0.9),
          img('/themes/anime/sakura.svg', 0.92, 0.94, 0.1, 'background', 40, 0.85)
        ],
        header: {
          text: '✿ 花見 · HANAMI ✿',
          font: "italic 900 20px 'Playfair Display', serif",
          color: '#6b2a8a',
          y: 0.055
        }
      }
    }
  },
  {
    id: 'kawaii',
    label: 'Kawaii',
    tagline: 'Pink bow + cute blush.',
    preview: 'linear-gradient(135deg,#ffd5e5,#ffebf3)',
    tags: ['cute'],
    keywords: ['kawaii', 'cute', 'pink', 'bow'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#fff0f6 0%,#ffd5e5 100%)' },
    caption: {
      text: 'So Cute · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#a6436a'
    },
    decorations: [
      img('/themes/kawaii/cloud.svg', 0.55, 0.03, 0.4, 'background', 0, 0.85),
      img('/themes/kawaii/cloud.svg', -0.05, 0.72, 0.35, 'background', 0, 0.7),
      img('/themes/kawaii/bow.svg', 0.04, 0.01, 0.28, 'foreground', -10, 1),
      img('/themes/kawaii/face.svg', 0.86, 0.88, 0.12, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#ff9ec1', width: 3, radius: 0.08 }
  },
  {
    id: 'y2k',
    label: 'Y2K',
    tagline: 'Tilted slots + holo butterflies.',
    preview: 'linear-gradient(135deg,#9c5bff,#ff5bd1,#5bcfff)',
    tags: ['retro', 'bold'],
    keywords: ['y2k', '2000s', 'butterfly', 'holo', 'chrome'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#9c5bff 0%,#ff5bd1 50%,#5bcfff 100%)'
    },
    caption: {
      text: '♡ 2K 4EVR ♡ {date}',
      font: "900 20px 'Space Grotesk', sans-serif",
      color: '#ffffff'
    },
    decorations: [],
    slotBorder: { color: '#fff', width: 3, radius: 0.12 },
    layouts: {
      strip: {
        aspect: 0.55,
        slots: [
          // Slot zig-zag berselang rotation.
          { x: 0.1, y: 0.11, w: 0.8, h: 0.2, rotation: -4, radius: 0.12, border: { color: '#fff', width: 3 } },
          { x: 0.1, y: 0.33, w: 0.8, h: 0.2, rotation: 4, radius: 0.12, border: { color: '#fff', width: 3 } },
          { x: 0.1, y: 0.55, w: 0.8, h: 0.2, rotation: -4, radius: 0.12, border: { color: '#fff', width: 3 } },
          { x: 0.1, y: 0.77, w: 0.8, h: 0.09, rotation: 4, radius: 0.12, border: { color: '#fff', width: 3 } }
        ],
        decorations: [
          img('/themes/y2k/butterfly.svg', 0.72, 0.015, 0.22, 'foreground', -12, 1),
          img('/themes/y2k/butterfly.svg', 0.02, 0.86, 0.2, 'foreground', 18, 0.95),
          img('/themes/y2k/star.svg', 0.04, 0.03, 0.08, 'foreground', 0, 1),
          img('/themes/y2k/star.svg', 0.9, 0.94, 0.07, 'foreground', 0, 1),
          emoji('♡', 0.04, 0.55, 0.04, 'foreground', 0, 1, '#fff'),
          emoji('♡', 0.96, 0.55, 0.04, 'foreground', 0, 1, '#fff')
        ],
        header: {
          text: '☆ ~*~ BFF 4EVER ~*~ ☆',
          font: "900 18px 'Space Grotesk', sans-serif",
          color: '#fff',
          y: 0.065
        }
      }
    }
  },
  {
    id: 'retro',
    label: 'Retro Film',
    tagline: '35mm film sprockets + sepia.',
    preview: 'linear-gradient(135deg,#2e241c,#704b2e)',
    tags: ['retro'],
    keywords: ['film', 'polaroid', '35mm', 'vintage'],
    background: { kind: 'solid', value: '#2e241c' },
    caption: {
      text: 'SHOT ON FILM · {date}',
      font: "bold 20px 'Space Grotesk', monospace",
      color: '#f5e8d0'
    },
    decorations: [
      // film holes kiri
      img('/themes/retro/film-hole.svg', 0.005, 0.03, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.005, 0.12, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.005, 0.21, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.005, 0.3, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.005, 0.39, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.005, 0.48, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.005, 0.57, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.005, 0.66, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.005, 0.75, 0.045, 'background'),
      // film holes kanan
      img('/themes/retro/film-hole.svg', 0.95, 0.03, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.95, 0.12, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.95, 0.21, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.95, 0.3, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.95, 0.39, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.95, 0.48, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.95, 0.57, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.95, 0.66, 0.045, 'background'),
      img('/themes/retro/film-hole.svg', 0.95, 0.75, 0.045, 'background'),
      img('/themes/retro/stamp.svg', 0.62, 0.88, 0.22, 'foreground', -12, 0.85)
    ],
    slotBorder: { color: '#f5e8d0', width: 2, radius: 0.02 }
  },

  // ---------------- 50 theme tambahan (emoji-based) ----------------

  {
    id: 'cottagecore',
    label: 'Cottagecore',
    tagline: 'Sage forest + wildflowers.',
    preview: 'linear-gradient(135deg,#d9e3c8,#b7c4a1)',
    tags: ['aesthetic', 'nature'],
    keywords: ['cottage', 'farm', 'garden', 'forest', 'sage'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#e9efd8 0%,#b7c4a1 100%)' },
    caption: {
      text: 'In the meadow · {date}',
      font: "italic 700 22px 'Space Grotesk', serif",
      color: '#3b4a2a'
    },
    decorations: [
      emoji('🌿', 0.08, 0.08, 0.08, 'background', -10, 0.9),
      emoji('🌻', 0.88, 0.15, 0.1, 'foreground', 12, 1),
      emoji('🍄', 0.1, 0.9, 0.09, 'foreground', -8, 1),
      emoji('🌱', 0.86, 0.88, 0.07, 'foreground', 5, 0.95)
    ],
    slotBorder: { color: '#3b4a2a', width: 2, radius: 0.05 }
  },
  {
    id: 'dark-academia',
    label: 'Dark Academia',
    tagline: 'Library candles + burgundy.',
    preview: 'linear-gradient(135deg,#2b1d14,#5b2a22)',
    tags: ['aesthetic', 'dark'],
    keywords: ['academia', 'books', 'library', 'burgundy'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#2a1a14 0%,#5b2a22 100%)' },
    caption: {
      text: 'Ex Libris · {date}',
      font: "italic 700 20px Georgia, serif",
      color: '#e6d3a3'
    },
    decorations: [
      emoji('📚', 0.06, 0.05, 0.09, 'foreground', -10, 0.95, '#c69a5c'),
      emoji('🕯️', 0.88, 0.1, 0.1, 'foreground', 0, 1),
      emoji('🖋️', 0.92, 0.9, 0.08, 'foreground', -15, 0.9),
      emoji('🏛️', 0.05, 0.88, 0.09, 'foreground', 0, 0.85)
    ],
    slotBorder: { color: '#e6d3a3', width: 2, radius: 0.03 }
  },
  {
    id: 'light-academia',
    label: 'Light Academia',
    tagline: 'Cream pages + morning coffee.',
    preview: 'linear-gradient(135deg,#f3e9d2,#d9c7a6)',
    tags: ['aesthetic', 'minimalist'],
    keywords: ['academia', 'coffee', 'books', 'cream'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#f7edd6 0%,#d9c7a6 100%)' },
    caption: {
      text: 'Studying Forever · {date}',
      font: "italic 600 20px Georgia, serif",
      color: '#5a4631'
    },
    decorations: [
      emoji('📖', 0.06, 0.05, 0.1, 'foreground', -8, 0.95),
      emoji('☕', 0.88, 0.12, 0.09, 'foreground', 10, 1),
      emoji('🌿', 0.05, 0.92, 0.08, 'foreground', 0, 0.9),
      emoji('✒️', 0.9, 0.9, 0.08, 'foreground', -12, 0.95)
    ],
    slotBorder: { color: '#5a4631', width: 2, radius: 0.04 }
  },
  {
    id: 'fairy-tale',
    label: 'Fairy Tale',
    tagline: 'Lavender magic + tiny fairies.',
    preview: 'linear-gradient(135deg,#e3d5ff,#b9a4eb)',
    tags: ['cute', 'aesthetic'],
    keywords: ['fairy', 'magic', 'lavender', 'fantasy'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#ecdfff 0%,#b9a4eb 100%)' },
    caption: {
      text: 'Once Upon a Time · {date}',
      font: "italic 700 22px 'Space Grotesk', serif",
      color: '#4c2a7a'
    },
    decorations: [
      emoji('🧚', 0.05, 0.03, 0.11, 'foreground', -10, 1),
      emoji('✨', 0.9, 0.06, 0.07, 'foreground', 0, 1),
      emoji('🌙', 0.88, 0.88, 0.1, 'foreground', 10, 0.95),
      emoji('🪄', 0.05, 0.9, 0.09, 'foreground', -20, 0.95)
    ],
    slotBorder: { color: '#4c2a7a', width: 2, radius: 0.06 }
  },
  {
    id: 'unicorn',
    label: 'Unicorn',
    tagline: 'Rainbow pastel magic.',
    preview: 'linear-gradient(135deg,#ffd1e8,#c4e0ff,#d4f0ff,#e5ffd4,#fff5c4)',
    tags: ['cute', 'bold'],
    keywords: ['unicorn', 'rainbow', 'pastel'],
    background: {
      kind: 'linear',
      value:
        'linear-gradient(135deg,#ffd1e8 0%,#c4e0ff 25%,#d4f0ff 50%,#e5ffd4 75%,#fff5c4 100%)'
    },
    caption: {
      text: 'Stay Magical · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#6b2ea8'
    },
    decorations: [
      emoji('🦄', 0.05, 0.03, 0.12, 'foreground', -12, 1),
      emoji('🌈', 0.85, 0.04, 0.13, 'foreground', 5, 1),
      emoji('⭐', 0.92, 0.9, 0.08, 'foreground', 0, 1),
      emoji('⭐', 0.05, 0.92, 0.06, 'foreground', -10, 0.9)
    ],
    slotBorder: { color: '#6b2ea8', width: 3, radius: 0.08 }
  },
  {
    id: 'mermaid',
    label: 'Mermaid',
    tagline: 'Ocean scales + pearl shells.',
    preview: 'linear-gradient(135deg,#8fd3e0,#c5a3ff)',
    tags: ['aesthetic', 'nature'],
    keywords: ['mermaid', 'ocean', 'scales', 'shell'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(160deg,#8fd3e0 0%,#5fc8c8 40%,#c5a3ff 100%)'
    },
    caption: {
      text: 'Siren Song · {date}',
      font: "italic 700 22px 'Space Grotesk', serif",
      color: '#14335a'
    },
    decorations: [
      emoji('🧜‍♀️', 0.05, 0.03, 0.12, 'foreground', 0, 1),
      emoji('🐚', 0.88, 0.1, 0.1, 'foreground', 15, 1),
      emoji('🌊', 0.9, 0.88, 0.1, 'foreground', 0, 0.95),
      emoji('🫧', 0.05, 0.9, 0.08, 'foreground', 0, 0.9)
    ],
    slotBorder: { color: '#14335a', width: 2, radius: 0.06 }
  },
  {
    id: 'dragon',
    label: 'Dragon Legend',
    tagline: 'Fierce crimson + golden flame.',
    preview: 'linear-gradient(135deg,#2a0a0a,#ff3a00,#ffb400)',
    tags: ['bold', 'dark'],
    keywords: ['dragon', 'fire', 'fantasy'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#1a0606 0%,#c52c00 60%,#ffa400 100%)' },
    caption: {
      text: 'Here Be Dragons · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fff1c4'
    },
    decorations: [
      emoji('🐉', 0.04, 0.03, 0.13, 'foreground', 0, 1),
      emoji('🔥', 0.88, 0.1, 0.1, 'foreground', 5, 1),
      emoji('⚔️', 0.9, 0.88, 0.1, 'foreground', -20, 0.95),
      emoji('🛡️', 0.05, 0.9, 0.09, 'foreground', 15, 0.95)
    ],
    slotBorder: { color: '#ffb400', width: 3, radius: 0.04 }
  },
  {
    id: 'space',
    label: 'Space',
    tagline: 'Portholes + starmap constellation.',
    preview: 'linear-gradient(135deg,#0a0e2e,#3a1b6e)',
    tags: ['aesthetic', 'dark'],
    keywords: ['space', 'galaxy', 'cosmos', 'planets', 'nasa', 'astronaut'],
    background: {
      kind: 'linear',
      value: 'radial-gradient(#fff 1px,transparent 1px) ,linear-gradient(160deg,#060c2b 0%,#2a1566 100%)'
    },
    caption: {
      text: 'Mission · {date}',
      font: "900 18px monospace",
      color: '#ffe6a0'
    },
    decorations: [],
    slotBorder: { color: '#ffe6a0', width: 3, radius: 0.5 },
    layouts: {
      strip: {
        aspect: 0.42,
        background: { kind: 'linear', value: 'linear-gradient(160deg,#060c2b 0%,#2a1566 100%)' },
        // 4 porthole bulat (radius tinggi).
        slots: [
          { x: 0.1, y: 0.07, w: 0.35, h: 0.2, radius: 0.5, border: { color: '#fbbf24', width: 4 } },
          { x: 0.55, y: 0.07, w: 0.35, h: 0.2, radius: 0.5, border: { color: '#fbbf24', width: 4 } },
          { x: 0.1, y: 0.3, w: 0.35, h: 0.2, radius: 0.5, border: { color: '#fbbf24', width: 4 } },
          { x: 0.55, y: 0.3, w: 0.35, h: 0.2, radius: 0.5, border: { color: '#fbbf24', width: 4 } }
        ],
        decorations: [
          // Bintang scatter.
          emoji('⭐', 0.08, 0.58, 0.025, 'background', 0, 0.8, '#fff'),
          emoji('⭐', 0.25, 0.62, 0.018, 'background', 0, 0.7, '#fff'),
          emoji('⭐', 0.4, 0.6, 0.022, 'background', 0, 0.85, '#fff'),
          emoji('⭐', 0.55, 0.64, 0.02, 'background', 0, 0.75, '#fff'),
          emoji('⭐', 0.72, 0.58, 0.025, 'background', 0, 0.9, '#fff'),
          emoji('⭐', 0.88, 0.62, 0.018, 'background', 0, 0.7, '#fff'),
          emoji('⭐', 0.15, 0.73, 0.022, 'background', 0, 0.8, '#fff'),
          emoji('⭐', 0.5, 0.77, 0.03, 'background', 0, 1, '#fff'),
          emoji('⭐', 0.82, 0.73, 0.02, 'background', 0, 0.7, '#fff'),
          // Planets + rocket.
          emoji('🪐', 0.12, 0.68, 0.08, 'foreground', 0, 1),
          emoji('🌙', 0.8, 0.68, 0.08, 'foreground', 0, 1),
          emoji('🚀', 0.5, 0.85, 0.09, 'foreground', -15, 1)
        ],
        header: {
          text: '◆ APOLLO · CH 03 · 2026 ◆',
          font: "900 18px monospace",
          color: '#ffe6a0',
          y: 0.028
        },
        footer: {
          text: 'Δ 384,400 km from home · {date}',
          font: "900 14px monospace",
          color: '#ffe6a0',
          y: 0.97
        }
      }
    }
  },
  {
    id: 'galaxy',
    label: 'Galaxy Glow',
    tagline: 'Deep purple + sparkling dust.',
    preview: 'linear-gradient(135deg,#2c0249,#6b21a8,#f472b6)',
    tags: ['aesthetic', 'dark', 'bold'],
    keywords: ['galaxy', 'stardust', 'purple', 'nebula'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#2c0249 0%,#6b21a8 60%,#f472b6 100%)' },
    caption: {
      text: 'Stardust · {date}',
      font: "italic 700 22px 'Space Grotesk', sans-serif",
      color: '#ffe9f7'
    },
    decorations: [
      emoji('✨', 0.06, 0.04, 0.08, 'foreground', 0, 1),
      emoji('🌠', 0.88, 0.08, 0.12, 'foreground', -20, 1),
      emoji('💫', 0.9, 0.88, 0.1, 'foreground', 15, 1),
      emoji('✨', 0.07, 0.92, 0.07, 'foreground', 0, 0.9)
    ],
    slotBorder: { color: '#ffe9f7', width: 2, radius: 0.06 }
  },
  {
    id: 'ocean',
    label: 'Ocean Deep',
    tagline: 'Wavy slots + marine creatures.',
    preview: 'linear-gradient(135deg,#0a2a4a,#4fc3f7)',
    tags: ['nature', 'aesthetic'],
    keywords: ['ocean', 'sea', 'blue', 'water', 'wave', 'underwater'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#0a2a4a 0%,#0891b2 50%,#4fc3f7 100%)' },
    caption: {
      text: '〜 Under the Sea · {date} 〜',
      font: "italic 700 20px 'Space Grotesk', sans-serif",
      color: '#fff5e5'
    },
    decorations: [],
    slotBorder: { color: '#fff5e5', width: 2, radius: 0.08 },
    layouts: {
      strip: {
        aspect: 0.55,
        slots: [
          // Gelombang: slot bergeser horizontal bergantian.
          { x: 0.16, y: 0.11, w: 0.7, h: 0.18, rotation: -2, radius: 0.1, border: { color: '#fff5e5', width: 3 } },
          { x: 0.1, y: 0.32, w: 0.7, h: 0.18, rotation: 2, radius: 0.1, border: { color: '#fff5e5', width: 3 } },
          { x: 0.2, y: 0.53, w: 0.7, h: 0.18, rotation: -2, radius: 0.1, border: { color: '#fff5e5', width: 3 } },
          { x: 0.1, y: 0.74, w: 0.7, h: 0.18, rotation: 2, radius: 0.1, border: { color: '#fff5e5', width: 3 } }
        ],
        decorations: [
          // Bubbles background.
          emoji('🫧', 0.06, 0.25, 0.03, 'background', 0, 0.7),
          emoji('🫧', 0.94, 0.16, 0.025, 'background', 0, 0.6),
          emoji('🫧', 0.05, 0.46, 0.02, 'background', 0, 0.6),
          emoji('🫧', 0.95, 0.48, 0.035, 'background', 0, 0.7),
          emoji('🫧', 0.04, 0.67, 0.022, 'background', 0, 0.6),
          emoji('🫧', 0.96, 0.68, 0.028, 'background', 0, 0.65),
          // Fish.
          emoji('🐠', 0.05, 0.15, 0.05, 'foreground', 10, 1),
          emoji('🐡', 0.93, 0.38, 0.045, 'foreground', -15, 1),
          emoji('🐙', 0.07, 0.95, 0.07, 'foreground', 0, 1),
          emoji('🐚', 0.93, 0.95, 0.06, 'foreground', 15, 1),
          emoji('🐢', 0.5, 0.04, 0.06, 'foreground', 0, 0.95)
        ],
        header: {
          text: '🌊 DEEP DIVE 🌊',
          font: "900 20px 'Space Grotesk', sans-serif",
          color: '#fff5e5',
          y: 0.055
        }
      }
    }
  },
  {
    id: 'sakura',
    label: 'Sakura Spring',
    tagline: 'Cherry blossoms + hanami.',
    preview: 'linear-gradient(135deg,#ffe4ec,#ffb6d3)',
    tags: ['cute', 'seasonal', 'nature'],
    keywords: ['sakura', 'cherry', 'spring', 'blossom', 'japan'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#fff0f5 0%,#ffb6d3 100%)' },
    caption: {
      text: 'Hanami · {date}',
      font: "italic 700 22px 'Space Grotesk', serif",
      color: '#8a2e54'
    },
    decorations: [
      emoji('🌸', 0.06, 0.03, 0.1, 'foreground', -15, 1),
      emoji('🌸', 0.88, 0.08, 0.09, 'foreground', 20, 1),
      emoji('🌸', 0.04, 0.88, 0.08, 'foreground', 10, 0.9),
      emoji('🦋', 0.9, 0.88, 0.09, 'foreground', -10, 1),
      emoji('🌷', 0.5, 0.9, 0.07, 'background', 0, 0.8)
    ],
    slotBorder: { color: '#8a2e54', width: 2, radius: 0.07 }
  },
  {
    id: 'autumn',
    label: 'Autumn Leaves',
    tagline: 'Pumpkin spice + maple.',
    preview: 'linear-gradient(135deg,#c75a1e,#f3b23e)',
    tags: ['seasonal', 'nature'],
    keywords: ['autumn', 'fall', 'leaves', 'pumpkin', 'maple'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#f3b23e 0%,#c75a1e 100%)' },
    caption: {
      text: 'Fall Feels · {date}',
      font: "bold 22px 'Space Grotesk', serif",
      color: '#3b1a08'
    },
    decorations: [
      emoji('🍂', 0.05, 0.04, 0.1, 'foreground', -20, 1),
      emoji('🍁', 0.88, 0.07, 0.11, 'foreground', 15, 1),
      emoji('🎃', 0.04, 0.88, 0.11, 'foreground', 0, 1),
      emoji('🍂', 0.9, 0.88, 0.09, 'foreground', 25, 0.95)
    ],
    slotBorder: { color: '#3b1a08', width: 2, radius: 0.05 }
  },
  {
    id: 'winter',
    label: 'Winter Snow',
    tagline: 'Frosty blue + snowflakes.',
    preview: 'linear-gradient(135deg,#dbeafe,#60a5fa)',
    tags: ['seasonal', 'nature'],
    keywords: ['winter', 'snow', 'ice', 'cold'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#dbeafe 0%,#93c5fd 100%)' },
    caption: {
      text: 'Let It Snow · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#0b254a'
    },
    decorations: [
      emoji('❄️', 0.06, 0.05, 0.09, 'foreground', 0, 1),
      emoji('❄️', 0.9, 0.1, 0.08, 'foreground', 0, 1),
      emoji('❄️', 0.08, 0.88, 0.07, 'foreground', 0, 0.9),
      emoji('☃️', 0.88, 0.88, 0.11, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#0b254a', width: 2, radius: 0.05 }
  },
  {
    id: 'christmas',
    label: 'Christmas',
    tagline: 'Ornament garland + gift tag.',
    preview: 'linear-gradient(135deg,#991b1b,#14532d)',
    tags: ['seasonal'],
    keywords: ['christmas', 'xmas', 'natal', 'tree', 'gift', 'santa'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#7f1d1d 0%,#14532d 100%)' },
    caption: {
      text: '🎄 Merry Christmas · {date}',
      font: "900 20px 'Space Grotesk', serif",
      color: '#fef3c7'
    },
    decorations: [],
    slotBorder: { color: '#fef3c7', width: 3, radius: 0.06 },
    layouts: {
      strip: {
        aspect: 0.55,
        background: { kind: 'linear', value: 'linear-gradient(180deg,#7f1d1d 0%,#14532d 100%)' },
        slots: [
          { x: 0.14, y: 0.14, w: 0.72, h: 0.17, radius: 0.06, border: { color: '#fef3c7', width: 3 } },
          { x: 0.14, y: 0.335, w: 0.72, h: 0.17, radius: 0.06, border: { color: '#fef3c7', width: 3 } },
          { x: 0.14, y: 0.53, w: 0.72, h: 0.17, radius: 0.06, border: { color: '#fef3c7', width: 3 } },
          { x: 0.14, y: 0.725, w: 0.72, h: 0.17, radius: 0.06, border: { color: '#fef3c7', width: 3 } }
        ],
        decorations: [
          // Garland atas.
          rect(0.5, 0.09, 0.95, 0.004, '#fef3c7', { placement: 'foreground' }),
          emoji('🎄', 0.05, 0.09, 0.04, 'foreground', 0, 1),
          emoji('⭐', 0.2, 0.09, 0.03, 'foreground', 0, 1, '#facc15'),
          emoji('🔔', 0.35, 0.09, 0.035, 'foreground', -10, 1),
          emoji('❄️', 0.5, 0.09, 0.035, 'foreground', 0, 1),
          emoji('🎁', 0.65, 0.09, 0.035, 'foreground', 10, 1),
          emoji('⭐', 0.8, 0.09, 0.03, 'foreground', 0, 1, '#facc15'),
          emoji('🎅', 0.95, 0.09, 0.04, 'foreground', 0, 1),
          // Ornament antar slot (kiri-kanan bergantian warna).
          emoji('🔴', 0.05, 0.245, 0.035, 'foreground', 0, 1),
          emoji('🟢', 0.95, 0.245, 0.035, 'foreground', 0, 1),
          emoji('🟢', 0.05, 0.44, 0.035, 'foreground', 0, 1),
          emoji('🔴', 0.95, 0.44, 0.035, 'foreground', 0, 1),
          emoji('🔴', 0.05, 0.635, 0.035, 'foreground', 0, 1),
          emoji('🟢', 0.95, 0.635, 0.035, 'foreground', 0, 1),
          emoji('⛄', 0.08, 0.95, 0.06, 'foreground', 0, 1),
          emoji('🎁', 0.92, 0.95, 0.06, 'foreground', -10, 1)
        ],
        header: {
          text: '✦ HO HO HO ✦',
          font: "900 22px 'Playfair Display', Georgia, serif",
          color: '#fef3c7',
          y: 0.04
        }
      }
    }
  },
  {
    id: 'halloween',
    label: 'Halloween',
    tagline: 'Spooky orange + ghost.',
    preview: 'linear-gradient(135deg,#111,#ea580c)',
    tags: ['seasonal', 'dark'],
    keywords: ['halloween', 'pumpkin', 'ghost', 'spooky'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#0b0b0b 0%,#c2410c 100%)' },
    caption: {
      text: 'Spooky Szn · {date}',
      font: "900 22px 'Space Grotesk', monospace",
      color: '#fb923c'
    },
    decorations: [
      emoji('🎃', 0.05, 0.04, 0.13, 'foreground', -10, 1),
      emoji('👻', 0.88, 0.08, 0.11, 'foreground', 0, 1),
      emoji('🦇', 0.08, 0.88, 0.1, 'foreground', 10, 1),
      emoji('🕸️', 0.88, 0.88, 0.12, 'foreground', 0, 0.9)
    ],
    slotBorder: { color: '#fb923c', width: 3, radius: 0.04 }
  },
  {
    id: 'valentine',
    label: 'Valentine',
    tagline: 'Love letter with heart seal.',
    preview: 'linear-gradient(135deg,#ff5e87,#ffbfd3)',
    tags: ['seasonal', 'cute'],
    keywords: ['valentine', 'love', 'heart', 'romance', 'pacar'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#ffe4ec 0%,#ff5e87 100%)' },
    caption: {
      text: '♡ Be Mine · {date} ♡',
      font: "italic 700 22px 'Playfair Display', serif",
      color: '#6b0f2d'
    },
    decorations: [],
    slotBorder: { color: '#fff', width: 3, radius: 0.08 },
    layouts: {
      strip: {
        aspect: 0.55,
        slots: [
          {
            x: 0.12, y: 0.14, w: 0.76, h: 0.18, radius: 0.1,
            border: { color: '#fff', width: 3 },
            perSlotDecorations: [emoji('♡', 0.95, 0.1, 0.12, 'foreground', 0, 1, '#ff5e87')]
          },
          {
            x: 0.12, y: 0.34, w: 0.76, h: 0.18, radius: 0.1,
            border: { color: '#fff', width: 3 },
            perSlotDecorations: [emoji('♡', 0.05, 0.1, 0.1, 'foreground', 0, 1, '#ff5e87')]
          },
          {
            x: 0.12, y: 0.54, w: 0.76, h: 0.18, radius: 0.1,
            border: { color: '#fff', width: 3 },
            perSlotDecorations: [emoji('♡', 0.95, 0.85, 0.11, 'foreground', 0, 1, '#ff5e87')]
          },
          {
            x: 0.12, y: 0.74, w: 0.76, h: 0.18, radius: 0.1,
            border: { color: '#fff', width: 3 },
            perSlotDecorations: [emoji('♡', 0.05, 0.85, 0.1, 'foreground', 0, 1, '#ff5e87')]
          }
        ],
        decorations: [
          emoji('❤', 0.05, 0.06, 0.05, 'foreground', -15, 1, '#dc2626'),
          emoji('💐', 0.92, 0.05, 0.065, 'foreground', 0, 1),
          emoji('🌹', 0.05, 0.96, 0.06, 'foreground', 15, 1),
          emoji('💌', 0.93, 0.96, 0.055, 'foreground', -10, 1),
          // Love letter envelope background streak.
          rect(0.5, 0.09, 0.88, 0.02, '#fff', { placement: 'background', opacity: 0.3 })
        ],
        header: {
          text: '❥ XOXO ❥',
          font: "italic 900 20px 'Playfair Display', serif",
          color: '#fff',
          y: 0.055
        }
      }
    }
  },
  {
    id: 'easter',
    label: 'Easter',
    tagline: 'Bunnies + pastel eggs.',
    preview: 'linear-gradient(135deg,#fef08a,#bbf7d0,#fbcfe8)',
    tags: ['seasonal', 'cute'],
    keywords: ['easter', 'bunny', 'egg', 'spring'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#fef08a 0%,#bbf7d0 50%,#fbcfe8 100%)'
    },
    caption: {
      text: 'Hoppy Easter · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#4a2c6a'
    },
    decorations: [
      emoji('🐰', 0.05, 0.04, 0.12, 'foreground', -10, 1),
      emoji('🥚', 0.88, 0.08, 0.1, 'foreground', 5, 1),
      emoji('🌷', 0.05, 0.88, 0.1, 'foreground', 10, 1),
      emoji('🐣', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#4a2c6a', width: 2, radius: 0.06 }
  },
  {
    id: 'birthday',
    label: 'Birthday',
    tagline: 'Confetti rain + party banner.',
    preview: 'linear-gradient(135deg,#fbcfe8,#93c5fd,#fde68a)',
    tags: ['seasonal', 'cute'],
    keywords: ['birthday', 'cake', 'party', 'balloon', 'ultah'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#fbcfe8 0%,#93c5fd 50%,#fde68a 100%)'
    },
    caption: {
      text: '🎂 Happy Birthday · {date}',
      font: "900 20px 'Space Grotesk', sans-serif",
      color: '#6b21a8'
    },
    decorations: [],
    slotBorder: { color: '#6b21a8', width: 3, radius: 0.07 },
    layouts: {
      strip: {
        aspect: 0.52,
        slots: [
          { x: 0.06, y: 0.17, w: 0.88, h: 0.17, radius: 0.08, border: { color: '#6b21a8', width: 3 } },
          { x: 0.06, y: 0.36, w: 0.88, h: 0.17, radius: 0.08, border: { color: '#6b21a8', width: 3 } },
          { x: 0.06, y: 0.55, w: 0.88, h: 0.17, radius: 0.08, border: { color: '#6b21a8', width: 3 } },
          { x: 0.06, y: 0.74, w: 0.88, h: 0.17, radius: 0.08, border: { color: '#6b21a8', width: 3 } }
        ],
        decorations: [
          // Confetti scatter background.
          emoji('✦', 0.08, 0.28, 0.02, 'background', 15, 0.8, '#ec4899'),
          emoji('✦', 0.22, 0.47, 0.025, 'background', -20, 0.8, '#3b82f6'),
          emoji('✦', 0.78, 0.3, 0.022, 'background', 30, 0.8, '#f59e0b'),
          emoji('✦', 0.92, 0.5, 0.02, 'background', 0, 0.8, '#22c55e'),
          emoji('✦', 0.12, 0.65, 0.025, 'background', 45, 0.8, '#a855f7'),
          emoji('✦', 0.88, 0.7, 0.023, 'background', -15, 0.8, '#ec4899'),
          emoji('•', 0.3, 0.25, 0.015, 'background', 0, 0.7, '#3b82f6'),
          emoji('•', 0.7, 0.26, 0.015, 'background', 0, 0.7, '#ec4899'),
          emoji('•', 0.35, 0.77, 0.015, 'background', 0, 0.7, '#f59e0b'),
          emoji('•', 0.62, 0.78, 0.015, 'background', 0, 0.7, '#22c55e'),
          // Balloon string atas.
          emoji('🎈', 0.1, 0.04, 0.06, 'foreground', -10, 1),
          emoji('🎈', 0.24, 0.05, 0.055, 'foreground', 10, 1),
          emoji('🎂', 0.5, 0.04, 0.07, 'foreground', 0, 1),
          emoji('🎈', 0.76, 0.05, 0.055, 'foreground', -10, 1),
          emoji('🎈', 0.9, 0.04, 0.06, 'foreground', 10, 1),
          // Bottom.
          emoji('🎉', 0.08, 0.95, 0.06, 'foreground', -10, 1),
          emoji('🎁', 0.92, 0.95, 0.06, 'foreground', 10, 1)
        ],
        header: {
          text: '♡ PARTY TIME ♡',
          font: "900 22px 'Space Grotesk', sans-serif",
          color: '#6b21a8',
          y: 0.125
        }
      }
    }
  },
  {
    id: 'wedding',
    label: 'Wedding',
    tagline: 'Ivory + gold elegance.',
    preview: 'linear-gradient(135deg,#fef3c7,#eab308)',
    tags: ['seasonal', 'minimalist'],
    keywords: ['wedding', 'marry', 'love', 'gold'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#fef9e7 0%,#eab308 100%)' },
    caption: {
      text: 'Forever & Always · {date}',
      font: "italic 600 22px Georgia, serif",
      color: '#4a3a0a'
    },
    decorations: [
      emoji('💍', 0.05, 0.04, 0.11, 'foreground', 0, 1),
      emoji('🥂', 0.88, 0.08, 0.1, 'foreground', -5, 1),
      emoji('🕊️', 0.05, 0.88, 0.1, 'foreground', 15, 0.95),
      emoji('💐', 0.88, 0.88, 0.11, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#eab308', width: 2, radius: 0.04 }
  },
  {
    id: 'graduation',
    label: 'Graduation',
    tagline: 'Navy cap + golden tassel.',
    preview: 'linear-gradient(135deg,#1e3a8a,#facc15)',
    tags: ['seasonal'],
    keywords: ['graduation', 'school', 'degree', 'cap'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#1e3a8a 0%,#312e81 100%)' },
    caption: {
      text: 'Class of · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#facc15'
    },
    decorations: [
      emoji('🎓', 0.05, 0.04, 0.12, 'foreground', -10, 1),
      emoji('📜', 0.88, 0.08, 0.11, 'foreground', 10, 1),
      emoji('🌟', 0.05, 0.88, 0.09, 'foreground', 0, 1),
      emoji('🎊', 0.88, 0.88, 0.11, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#facc15', width: 3, radius: 0.04 }
  },
  {
    id: 'baby',
    label: 'Baby Shower',
    tagline: 'Soft pastel + teddy.',
    preview: 'linear-gradient(135deg,#fecaca,#bae6fd)',
    tags: ['cute', 'seasonal'],
    keywords: ['baby', 'shower', 'teddy', 'soft'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#ffe4e6 0%,#e0f2fe 100%)' },
    caption: {
      text: 'Welcome, Little One · {date}',
      font: "italic 700 22px 'Space Grotesk', serif",
      color: '#7c2d50'
    },
    decorations: [
      emoji('👶', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🍼', 0.88, 0.08, 0.1, 'foreground', -10, 1),
      emoji('🧸', 0.05, 0.88, 0.11, 'foreground', 10, 1),
      emoji('🎀', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#7c2d50', width: 2, radius: 0.07 }
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    tagline: 'Diagonal neon glitch cards.',
    preview: 'linear-gradient(135deg,#0d0028,#ff00ea)',
    tags: ['bold', 'dark', 'retro'],
    keywords: ['cyberpunk', 'neon', 'futuristic', 'tech', '2077', 'glitch'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#0d0028 0%,#1a0a3a 60%,#2e0658 100%)' },
    caption: {
      text: '> RUN THE NET · {date}',
      font: "900 18px monospace",
      color: '#00eaff'
    },
    decorations: [],
    slotBorder: { color: '#00eaff', width: 3, radius: 0 },
    layouts: {
      strip: {
        aspect: 0.48,
        slots: [
          // 4 slot miring bergantian.
          { x: 0.08, y: 0.1, w: 0.84, h: 0.17, rotation: -3, radius: 0, border: { color: '#ff00ea', width: 3 } },
          { x: 0.08, y: 0.3, w: 0.84, h: 0.17, rotation: 3, radius: 0, border: { color: '#00eaff', width: 3 } },
          { x: 0.08, y: 0.5, w: 0.84, h: 0.17, rotation: -3, radius: 0, border: { color: '#ff00ea', width: 3 } },
          { x: 0.08, y: 0.7, w: 0.84, h: 0.17, rotation: 3, radius: 0, border: { color: '#00eaff', width: 3 } }
        ],
        decorations: [
          // Glitch bar.
          rect(0.5, 0.056, 0.8, 0.012, '#ff00ea', { placement: 'foreground', opacity: 0.9 }),
          rect(0.45, 0.07, 0.7, 0.005, '#00eaff', { placement: 'foreground', opacity: 0.8 }),
          emoji('[ SYS_BREACH::01 ]', 0.5, 0.095, 0.03, 'foreground', 0, 1, '#00eaff'),
          emoji('◀◀', 0.06, 0.95, 0.03, 'foreground', 0, 1, '#ff00ea'),
          emoji('▶▶', 0.94, 0.95, 0.03, 'foreground', 0, 1, '#00eaff'),
          emoji('⚠', 0.1, 0.05, 0.03, 'foreground', 0, 1, '#facc15')
        ]
      }
    }
  },
  {
    id: 'vaporwave',
    label: 'Vaporwave',
    tagline: 'Teal + pink palm bust.',
    preview: 'linear-gradient(135deg,#ff71ce,#01cdfe,#05ffa1)',
    tags: ['retro', 'aesthetic', 'bold'],
    keywords: ['vaporwave', '80s', '90s', 'aesthetic'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(180deg,#ff71ce 0%,#01cdfe 50%,#05ffa1 100%)'
    },
    caption: {
      text: 'A E S T H E T I C · {date}',
      font: "900 20px 'Space Grotesk', monospace",
      color: '#2a0a4a'
    },
    decorations: [
      emoji('🌴', 0.05, 0.04, 0.13, 'foreground', -10, 1),
      emoji('🗿', 0.88, 0.08, 0.12, 'foreground', 0, 1),
      emoji('🎮', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('📼', 0.88, 0.88, 0.11, 'foreground', -15, 1)
    ],
    slotBorder: { color: '#2a0a4a', width: 3, radius: 0.03 }
  },
  {
    id: 'memphis',
    label: 'Memphis 80s',
    tagline: 'Geometric shapes + squiggles.',
    preview: 'linear-gradient(135deg,#fde047,#f472b6,#22d3ee)',
    tags: ['bold', 'retro'],
    keywords: ['memphis', '80s', 'geometric', 'shapes'],
    background: { kind: 'solid', value: '#fef3c7' },
    caption: {
      text: '⟲ FUNKY FRESH ⟳ {date}',
      font: "900 20px 'Space Grotesk', sans-serif",
      color: '#0f172a'
    },
    decorations: [],
    slotBorder: { color: '#0f172a', width: 4, radius: 0 },
    layouts: {
      strip: {
        aspect: 0.52,
        background: { kind: 'solid', value: '#fef3c7' },
        slots: [
          { x: 0.08, y: 0.13, w: 0.84, h: 0.18, radius: 0, border: { color: '#0f172a', width: 4 }, rotation: -2 },
          { x: 0.08, y: 0.33, w: 0.84, h: 0.18, radius: 0, border: { color: '#0f172a', width: 4 }, rotation: 2 },
          { x: 0.08, y: 0.53, w: 0.84, h: 0.18, radius: 0, border: { color: '#0f172a', width: 4 }, rotation: -2 },
          { x: 0.08, y: 0.73, w: 0.84, h: 0.18, radius: 0, border: { color: '#0f172a', width: 4 }, rotation: 2 }
        ],
        decorations: [
          // Geometric shapes scatter background.
          rect(0.06, 0.08, 0.08, 0.04, '#f472b6', { placement: 'background', rotation: 25 }),
          rect(0.94, 0.2, 0.05, 0.05, '#22d3ee', { placement: 'background', radius: 0.5 }),
          rect(0.04, 0.32, 0.04, 0.03, '#0f172a', { placement: 'background' }),
          rect(0.96, 0.44, 0.06, 0.03, '#f472b6', { placement: 'background', rotation: 45 }),
          rect(0.05, 0.56, 0.05, 0.03, '#22d3ee', { placement: 'background' }),
          rect(0.94, 0.68, 0.05, 0.05, '#fde047', {
            placement: 'background',
            radius: 0.5,
            stroke: { color: '#0f172a', width: 2 }
          }),
          rect(0.06, 0.82, 0.06, 0.04, '#0f172a', { placement: 'background', rotation: -20 }),
          emoji('⌇', 0.5, 0.22, 0.05, 'background', 0, 1, '#22d3ee'),
          emoji('⌇', 0.5, 0.52, 0.05, 'background', 0, 1, '#f472b6'),
          emoji('●', 0.05, 0.5, 0.02, 'foreground', 0, 1, '#ef4444'),
          emoji('●', 0.95, 0.5, 0.02, 'foreground', 0, 1, '#22c55e'),
          emoji('▲', 0.08, 0.06, 0.04, 'foreground', 0, 1, '#ef4444'),
          emoji('●', 0.5, 0.06, 0.035, 'foreground', 0, 1, '#22d3ee'),
          emoji('▲', 0.92, 0.06, 0.04, 'foreground', 0, 1, '#f472b6')
        ]
      }
    }
  },
  {
    id: 'grunge',
    label: 'Grunge',
    tagline: 'Distorted dark guitar.',
    preview: 'linear-gradient(135deg,#1f2937,#4b5563)',
    tags: ['dark', 'retro'],
    keywords: ['grunge', '90s', 'rock', 'dark'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#1f2937 0%,#4b5563 100%)' },
    caption: {
      text: 'Stay Loud · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fbbf24'
    },
    decorations: [
      emoji('🎸', 0.05, 0.04, 0.13, 'foreground', -20, 1),
      emoji('🖤', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('⚡', 0.05, 0.88, 0.1, 'foreground', 10, 1),
      emoji('🎧', 0.88, 0.88, 0.11, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fbbf24', width: 3, radius: 0.02 }
  },
  {
    id: 'goth',
    label: 'Goth',
    tagline: 'Black lace + blood roses.',
    preview: 'linear-gradient(135deg,#000,#7f1d1d)',
    tags: ['dark'],
    keywords: ['goth', 'dark', 'black', 'vampire'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#000 0%,#450a0a 100%)' },
    caption: {
      text: 'Night Dwellers · {date}',
      font: "italic 700 22px Georgia, serif",
      color: '#dc2626'
    },
    decorations: [
      emoji('🦇', 0.05, 0.04, 0.12, 'foreground', -10, 1),
      emoji('🖤', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🕷️', 0.05, 0.88, 0.1, 'foreground', 10, 1),
      emoji('🌹', 0.88, 0.88, 0.11, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#dc2626', width: 2, radius: 0.03 }
  },
  {
    id: 'pastel-goth',
    label: 'Pastel Goth',
    tagline: 'Black + pastel lavender.',
    preview: 'linear-gradient(135deg,#1e1b4b,#c4b5fd)',
    tags: ['dark', 'aesthetic'],
    keywords: ['pastel', 'goth', 'purple', 'kawaii dark'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#1e1b4b 0%,#c4b5fd 100%)' },
    caption: {
      text: 'Soft + Spooky · {date}',
      font: "italic 700 22px 'Space Grotesk', serif",
      color: '#f0abfc'
    },
    decorations: [
      emoji('🦇', 0.05, 0.04, 0.1, 'foreground', -10, 1),
      emoji('💜', 0.88, 0.08, 0.09, 'foreground', 0, 1),
      emoji('🌙', 0.05, 0.88, 0.1, 'foreground', 10, 1),
      emoji('🕸️', 0.88, 0.88, 0.11, 'foreground', 0, 0.85)
    ],
    slotBorder: { color: '#f0abfc', width: 2, radius: 0.05 }
  },
  {
    id: 'bollywood',
    label: 'Bollywood',
    tagline: 'Mandala gold + jewel borders.',
    preview: 'linear-gradient(135deg,#a21caf,#facc15)',
    tags: ['bold', 'fandom'],
    keywords: ['bollywood', 'india', 'magenta', 'gold', 'mandala', 'henna'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#7c1d6f 0%,#db2777 60%,#facc15 100%)' },
    caption: {
      text: '❋ JHOOM ❋ {date}',
      font: "900 22px 'Playfair Display', serif",
      color: '#fff7ed'
    },
    decorations: [],
    slotBorder: { color: '#facc15', width: 5, radius: 0.25 },
    layouts: {
      strip: {
        aspect: 0.58,
        slots: [
          { x: 0.1, y: 0.12, w: 0.8, h: 0.19, radius: 0.2, border: { color: '#facc15', width: 5 } },
          { x: 0.1, y: 0.33, w: 0.8, h: 0.19, radius: 0.2, border: { color: '#facc15', width: 5 } },
          { x: 0.1, y: 0.54, w: 0.8, h: 0.19, radius: 0.2, border: { color: '#facc15', width: 5 } },
          { x: 0.1, y: 0.75, w: 0.8, h: 0.19, radius: 0.2, border: { color: '#facc15', width: 5 } }
        ],
        decorations: [
          // Mandala pattern jewels di border slot.
          emoji('❋', 0.05, 0.215, 0.04, 'foreground', 0, 1, '#facc15'),
          emoji('❋', 0.95, 0.215, 0.04, 'foreground', 0, 1, '#facc15'),
          emoji('❋', 0.05, 0.425, 0.04, 'foreground', 0, 1, '#facc15'),
          emoji('❋', 0.95, 0.425, 0.04, 'foreground', 0, 1, '#facc15'),
          emoji('❋', 0.05, 0.635, 0.04, 'foreground', 0, 1, '#facc15'),
          emoji('❋', 0.95, 0.635, 0.04, 'foreground', 0, 1, '#facc15'),
          emoji('❋', 0.05, 0.845, 0.04, 'foreground', 0, 1, '#facc15'),
          emoji('❋', 0.95, 0.845, 0.04, 'foreground', 0, 1, '#facc15'),
          emoji('💃', 0.1, 0.05, 0.06, 'foreground', -5, 1),
          emoji('👑', 0.5, 0.05, 0.06, 'foreground', 0, 1),
          emoji('🕉️', 0.9, 0.05, 0.055, 'foreground', 5, 1),
          emoji('🪔', 0.1, 0.96, 0.055, 'foreground', 0, 1),
          emoji('💎', 0.5, 0.96, 0.045, 'foreground', 0, 1),
          emoji('🪔', 0.9, 0.96, 0.055, 'foreground', 0, 1)
        ]
      }
    }
  },
  {
    id: 'tropical',
    label: 'Tropical',
    tagline: 'Palm + hibiscus + pineapple.',
    preview: 'linear-gradient(135deg,#14b8a6,#f97316)',
    tags: ['nature', 'travel'],
    keywords: ['tropical', 'summer', 'beach', 'hawaii'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#14b8a6 0%,#f97316 100%)' },
    caption: {
      text: 'Aloha · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fff7ed'
    },
    decorations: [
      emoji('🌴', 0.05, 0.04, 0.13, 'foreground', -10, 1),
      emoji('🌺', 0.88, 0.08, 0.11, 'foreground', 10, 1),
      emoji('🍍', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('🥥', 0.88, 0.88, 0.1, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#fff7ed', width: 3, radius: 0.05 }
  },
  {
    id: 'hawaii',
    label: 'Hawaii',
    tagline: 'Surf + shave ice.',
    preview: 'linear-gradient(135deg,#0891b2,#f43f5e)',
    tags: ['travel', 'nature'],
    keywords: ['hawaii', 'beach', 'surf'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#0891b2 0%,#f43f5e 100%)' },
    caption: {
      text: 'Mahalo · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#fff1f2'
    },
    decorations: [
      emoji('🌺', 0.05, 0.04, 0.12, 'foreground', -10, 1),
      emoji('🏄', 0.88, 0.08, 0.11, 'foreground', 0, 1),
      emoji('🍹', 0.05, 0.88, 0.1, 'foreground', 10, 1),
      emoji('🌊', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fff1f2', width: 3, radius: 0.05 }
  },
  {
    id: 'beach',
    label: 'Beach Day',
    tagline: 'Sand + sunset vibes.',
    preview: 'linear-gradient(135deg,#fde68a,#60a5fa)',
    tags: ['travel', 'nature'],
    keywords: ['beach', 'summer', 'sunset', 'sand'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#fde68a 0%,#60a5fa 100%)' },
    caption: {
      text: 'Salty Hair · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#0b254a'
    },
    decorations: [
      emoji('⛱️', 0.05, 0.04, 0.12, 'foreground', -5, 1),
      emoji('🐚', 0.88, 0.08, 0.09, 'foreground', 10, 1),
      emoji('🩴', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('🌅', 0.88, 0.88, 0.12, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#0b254a', width: 2, radius: 0.05 }
  },
  {
    id: 'jungle',
    label: 'Jungle',
    tagline: 'Dark green + parrot calls.',
    preview: 'linear-gradient(135deg,#064e3b,#84cc16)',
    tags: ['nature'],
    keywords: ['jungle', 'forest', 'animals', 'amazon'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#064e3b 0%,#365314 100%)' },
    caption: {
      text: 'Wild Side · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#bef264'
    },
    decorations: [
      emoji('🌴', 0.05, 0.04, 0.12, 'foreground', -5, 1),
      emoji('🦜', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🐒', 0.05, 0.88, 0.11, 'foreground', 10, 1),
      emoji('🌿', 0.88, 0.88, 0.11, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#bef264', width: 2, radius: 0.04 }
  },
  {
    id: 'safari',
    label: 'Safari',
    tagline: 'Khaki + golden lion sun.',
    preview: 'linear-gradient(135deg,#ca8a04,#a16207)',
    tags: ['nature', 'travel'],
    keywords: ['safari', 'africa', 'animals'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#ca8a04 0%,#78350f 100%)' },
    caption: {
      text: 'On Safari · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#fef9c3'
    },
    decorations: [
      emoji('🦒', 0.05, 0.04, 0.13, 'foreground', 0, 1),
      emoji('🦁', 0.88, 0.08, 0.11, 'foreground', 0, 1),
      emoji('🐘', 0.05, 0.88, 0.12, 'foreground', 0, 1),
      emoji('🌾', 0.88, 0.88, 0.1, 'foreground', -15, 1)
    ],
    slotBorder: { color: '#fef9c3', width: 2, radius: 0.04 }
  },
  {
    id: 'farm',
    label: 'Farm Life',
    tagline: 'Red barn + fresh hay.',
    preview: 'linear-gradient(135deg,#dc2626,#84cc16)',
    tags: ['nature'],
    keywords: ['farm', 'barn', 'country', 'animals'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#fca5a5 0%,#bef264 100%)' },
    caption: {
      text: 'Down on the Farm · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#5a1818'
    },
    decorations: [
      emoji('🐄', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🌽', 0.88, 0.08, 0.1, 'foreground', 5, 1),
      emoji('🚜', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('🐔', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#5a1818', width: 2, radius: 0.05 }
  },
  {
    id: 'pride',
    label: 'Pride',
    tagline: 'Rainbow stripes behind photos.',
    preview:
      'linear-gradient(180deg,#ef4444 0 16%,#f97316 16% 32%,#eab308 32% 48%,#22c55e 48% 64%,#3b82f6 64% 82%,#a855f7 82% 100%)',
    tags: ['pride', 'bold'],
    keywords: ['pride', 'lgbtq', 'rainbow', 'love'],
    background: { kind: 'solid', value: '#111827' },
    caption: {
      text: '♥ LOVE IS LOVE · {date}',
      font: "900 18px 'Space Grotesk', sans-serif",
      color: '#fff'
    },
    decorations: [],
    slotBorder: { color: '#fff', width: 4, radius: 0.06 },
    layouts: {
      strip: {
        aspect: 0.5,
        background: { kind: 'solid', value: '#111827' },
        slots: [
          { x: 0.14, y: 0.12, w: 0.72, h: 0.17, radius: 0.06, border: { color: '#fff', width: 4 } },
          { x: 0.14, y: 0.32, w: 0.72, h: 0.17, radius: 0.06, border: { color: '#fff', width: 4 } },
          { x: 0.14, y: 0.52, w: 0.72, h: 0.17, radius: 0.06, border: { color: '#fff', width: 4 } },
          { x: 0.14, y: 0.72, w: 0.72, h: 0.17, radius: 0.06, border: { color: '#fff', width: 4 } }
        ],
        decorations: [
          // Rainbow stripes as background decorations.
          rect(0.5, 0.035, 1, 0.07, '#ef4444', { placement: 'background' }),
          rect(0.5, 0.105, 1, 0.07, '#f97316', { placement: 'background' }),
          rect(0.06, 0.5, 0.06, 0.85, '#eab308', { placement: 'background' }),
          rect(0.94, 0.5, 0.06, 0.85, '#22c55e', { placement: 'background' }),
          rect(0.5, 0.89, 1, 0.07, '#3b82f6', { placement: 'background' }),
          rect(0.5, 0.955, 1, 0.07, '#a855f7', { placement: 'background' }),
          emoji('🏳️‍🌈', 0.08, 0.06, 0.05, 'foreground', 0, 1),
          emoji('🏳️‍🌈', 0.92, 0.06, 0.05, 'foreground', 0, 1),
          emoji('♥', 0.5, 0.1, 0.04, 'foreground', 0, 1, '#fff')
        ],
        header: {
          text: '✦ PROUD AS F ✦',
          font: "900 22px 'Space Grotesk', sans-serif",
          color: '#fff',
          y: 0.075
        }
      }
    }
  },
  {
    id: 'polaroid',
    label: 'Polaroid Pack',
    tagline: 'Scattered instant photos + tape.',
    preview: 'linear-gradient(135deg,#e7e5e4,#d6d3d1)',
    tags: ['retro', 'minimalist'],
    keywords: ['polaroid', 'instant', 'film', 'scattered'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#a8a29e 0%,#78716c 100%)' },
    caption: {
      text: 'Moments · {date}',
      font: "italic 600 20px Georgia, serif",
      color: '#292524'
    },
    decorations: [],
    slotBorder: { color: '#fafaf9', width: 0, radius: 0.01 },
    layouts: {
      strip: {
        aspect: 0.62,
        // 4 polaroid miring, tiap slot punya "frame" putih via perSlotDecorations.
        slots: [
          {
            x: 0.12, y: 0.05, w: 0.62, h: 0.2, rotation: -6, radius: 0.02,
            border: { color: '#1f1e1c', width: 2 },
            perSlotDecorations: [
              // Kartu putih di belakang slot (card besar sedikit lebih besar).
              rect(0.5, 0.52, 1.12, 1.3, '#fafaf9', {
                placement: 'background',
                radius: 0.015,
                stroke: { color: '#d6d3d1', width: 1 }
              }),
              // Washi tape di atas.
              rect(0.35, -0.04, 0.4, 0.08, '#fbbf24', { placement: 'foreground', opacity: 0.85, rotation: -8 })
            ]
          },
          {
            x: 0.3, y: 0.27, w: 0.62, h: 0.2, rotation: 4, radius: 0.02,
            border: { color: '#1f1e1c', width: 2 },
            perSlotDecorations: [
              rect(0.5, 0.52, 1.12, 1.3, '#fafaf9', {
                placement: 'background',
                radius: 0.015,
                stroke: { color: '#d6d3d1', width: 1 }
              }),
              rect(0.65, -0.04, 0.45, 0.08, '#06b6d4', { placement: 'foreground', opacity: 0.82, rotation: 10 })
            ]
          },
          {
            x: 0.08, y: 0.49, w: 0.62, h: 0.2, rotation: -3, radius: 0.02,
            border: { color: '#1f1e1c', width: 2 },
            perSlotDecorations: [
              rect(0.5, 0.52, 1.12, 1.3, '#fafaf9', {
                placement: 'background',
                radius: 0.015,
                stroke: { color: '#d6d3d1', width: 1 }
              }),
              rect(0.3, -0.04, 0.5, 0.09, '#f472b6', { placement: 'foreground', opacity: 0.85, rotation: -12 })
            ]
          },
          {
            x: 0.3, y: 0.71, w: 0.62, h: 0.2, rotation: 7, radius: 0.02,
            border: { color: '#1f1e1c', width: 2 },
            perSlotDecorations: [
              rect(0.5, 0.52, 1.12, 1.3, '#fafaf9', {
                placement: 'background',
                radius: 0.015,
                stroke: { color: '#d6d3d1', width: 1 }
              }),
              rect(0.7, -0.04, 0.4, 0.08, '#a3e635', { placement: 'foreground', opacity: 0.85, rotation: 15 })
            ]
          }
        ],
        decorations: [
          emoji('📎', 0.06, 0.93, 0.06, 'foreground', -25, 0.9),
          emoji('✉️', 0.9, 0.94, 0.06, 'foreground', 15, 0.9)
        ],
        footer: {
          text: '· Polaroid · {date} ·',
          font: "italic 600 22px Georgia, serif",
          color: '#fafaf9',
          y: 0.975
        }
      }
    }
  },
  {
    id: 'risograph',
    label: 'Risograph',
    tagline: 'Mint + magenta zine.',
    preview: 'linear-gradient(135deg,#67e8f9,#f472b6)',
    tags: ['aesthetic', 'retro'],
    keywords: ['riso', 'print', 'zine', 'duotone'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#67e8f9 0%,#f472b6 100%)' },
    caption: {
      text: 'RISO PRINT · {date}',
      font: "900 20px 'Space Grotesk', monospace",
      color: '#1e1b4b'
    },
    decorations: [
      emoji('🖨️', 0.05, 0.04, 0.11, 'foreground', 0, 1),
      emoji('🎨', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('📰', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('✂️', 0.88, 0.88, 0.1, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#1e1b4b', width: 3, radius: 0.02 }
  },
  {
    id: 'disco',
    label: 'Disco Glitter',
    tagline: 'Mirror ball + silver sparkle.',
    preview: 'linear-gradient(135deg,#6d28d9,#d1d5db)',
    tags: ['bold', 'retro'],
    keywords: ['disco', 'glitter', 'dance', '70s'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#4c1d95 0%,#d4d4d8 100%)' },
    caption: {
      text: 'Dance Floor · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fde68a'
    },
    decorations: [
      emoji('🪩', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('💃', 0.88, 0.08, 0.11, 'foreground', 0, 1),
      emoji('✨', 0.05, 0.88, 0.08, 'foreground', 0, 1),
      emoji('🎶', 0.88, 0.88, 0.1, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#fde68a', width: 3, radius: 0.04 }
  },
  {
    id: 'vhs',
    label: 'VHS 90s',
    tagline: 'CRT scanlines + REC badge.',
    preview: 'linear-gradient(135deg,#000,#06b6d4)',
    tags: ['retro'],
    keywords: ['vhs', '90s', 'tape', 'crt', 'rec', 'tracking'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#000 0%,#134e4a 100%)' },
    caption: {
      text: 'SP · {date} · 01:23:45',
      font: "900 18px monospace",
      color: '#39ff14'
    },
    decorations: [],
    slotBorder: { color: '#39ff14', width: 3, radius: 0 },
    layouts: {
      strip: {
        aspect: 0.55,
        background: { kind: 'solid', value: '#040404' },
        // 4 slot berjarak rapat seperti tracking preview di VCR.
        slots: [
          { x: 0.08, y: 0.1, w: 0.84, h: 0.19, radius: 0, border: { color: '#39ff14', width: 3 } },
          { x: 0.08, y: 0.305, w: 0.84, h: 0.19, radius: 0, border: { color: '#39ff14', width: 3 } },
          { x: 0.08, y: 0.51, w: 0.84, h: 0.19, radius: 0, border: { color: '#39ff14', width: 3 } },
          { x: 0.08, y: 0.715, w: 0.84, h: 0.19, radius: 0, border: { color: '#39ff14', width: 3 } }
        ],
        decorations: [
          // Scanline horizontal atas (faint).
          rect(0.5, 0.03, 1, 0.002, '#39ff14', { placement: 'foreground', opacity: 0.4 }),
          rect(0.5, 0.97, 1, 0.002, '#39ff14', { placement: 'foreground', opacity: 0.4 }),
          // REC circle di pojok atas.
          rect(0.1, 0.045, 0.02, 0.012, '#ef4444', {
            placement: 'foreground',
            radius: 0.5
          }),
          emoji('REC', 0.15, 0.045, 0.022, 'foreground', 0, 1, '#ef4444'),
          emoji('▶ PLAY', 0.85, 0.045, 0.022, 'foreground', 0, 1, '#39ff14'),
          emoji('📼', 0.1, 0.95, 0.035, 'foreground', 0, 0.9)
        ],
        header: {
          text: 'CH 03 · VHS HOME VIDEO',
          font: "900 18px monospace",
          color: '#39ff14',
          y: 0.076
        }
      }
    }
  },
  {
    id: 'cafe',
    label: 'Coffee Cafe',
    tagline: 'Menu board + receipt ticket.',
    preview: 'linear-gradient(135deg,#3c1a09,#d6a46e)',
    tags: ['food', 'aesthetic'],
    keywords: ['coffee', 'cafe', 'pastry', 'bakery', 'kopi'],
    background: { kind: 'solid', value: '#1f120a' },
    caption: {
      text: '· LATTE ART · {date} ·',
      font: "italic 700 18px Georgia, serif",
      color: '#fbe9c8'
    },
    decorations: [],
    slotBorder: { color: '#fbe9c8', width: 2, radius: 0.02 },
    layouts: {
      strip: {
        aspect: 0.55,
        background: { kind: 'solid', value: '#1f120a' },
        slots: [
          { x: 0.08, y: 0.14, w: 0.84, h: 0.18, radius: 0.02, border: { color: '#fbe9c8', width: 2 } },
          { x: 0.08, y: 0.34, w: 0.84, h: 0.18, radius: 0.02, border: { color: '#fbe9c8', width: 2 } },
          { x: 0.08, y: 0.54, w: 0.84, h: 0.18, radius: 0.02, border: { color: '#fbe9c8', width: 2 } },
          { x: 0.08, y: 0.74, w: 0.84, h: 0.18, radius: 0.02, border: { color: '#fbe9c8', width: 2 } }
        ],
        decorations: [
          // Menu board style: garis "menu item" di bawah.
          rect(0.5, 0.95, 0.84, 0.001, '#fbe9c8', { placement: 'foreground', opacity: 0.7 }),
          emoji('· ESPRESSO · LATTE · MOCHA ·', 0.5, 0.97, 0.022, 'foreground', 0, 0.9, '#d6a46e'),
          // Perforated edge top (receipt).
          emoji('· · · · · · · · · · · · · · ·', 0.5, 0.105, 0.018, 'foreground', 0, 0.6, '#fbe9c8'),
          emoji('☕', 0.05, 0.055, 0.06, 'foreground', -8, 1),
          emoji('🥐', 0.95, 0.055, 0.055, 'foreground', 10, 1),
          emoji('❤', 0.5, 0.06, 0.03, 'foreground', 0, 1, '#ef4444')
        ],
        header: {
          text: '— CAFÉ PHOTOGRAFE —',
          font: "900 18px 'Playfair Display', Georgia, serif",
          color: '#fbe9c8',
          y: 0.025
        }
      }
    }
  },
  {
    id: 'sushi',
    label: 'Sushi Bar',
    tagline: 'Red torii + fresh salmon.',
    preview: 'linear-gradient(135deg,#b91c1c,#fff)',
    tags: ['food', 'travel'],
    keywords: ['sushi', 'japan', 'tokyo', 'torii'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#fff 0%,#fecaca 100%)' },
    caption: {
      text: 'Itadakimasu · {date}',
      font: "bold 22px 'Space Grotesk', serif",
      color: '#991b1b'
    },
    decorations: [
      emoji('🍣', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('⛩️', 0.88, 0.08, 0.12, 'foreground', 0, 1),
      emoji('🌸', 0.05, 0.88, 0.1, 'foreground', -10, 1),
      emoji('🥢', 0.88, 0.88, 0.1, 'foreground', 15, 1)
    ],
    slotBorder: { color: '#991b1b', width: 3, radius: 0.04 }
  },
  {
    id: 'macaron',
    label: 'Macaron',
    tagline: 'Pastel multi-dessert.',
    preview: 'linear-gradient(135deg,#fbcfe8,#a7f3d0,#fde68a,#bae6fd)',
    tags: ['food', 'cute'],
    keywords: ['macaron', 'dessert', 'pastel', 'sweet'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#fbcfe8 0%,#a7f3d0 33%,#fde68a 66%,#bae6fd 100%)'
    },
    caption: {
      text: 'Sweet Tooth · {date}',
      font: "italic 700 22px 'Space Grotesk', serif",
      color: '#6b21a8'
    },
    decorations: [
      emoji('🧁', 0.05, 0.04, 0.11, 'foreground', 0, 1),
      emoji('🍰', 0.88, 0.08, 0.12, 'foreground', -5, 1),
      emoji('🎀', 0.05, 0.88, 0.1, 'foreground', 10, 1),
      emoji('🍭', 0.88, 0.88, 0.11, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#6b21a8', width: 2, radius: 0.07 }
  },
  {
    id: 'candy',
    label: 'Candy',
    tagline: 'Hot pink + lollipop swirl.',
    preview: 'linear-gradient(135deg,#ec4899,#fbbf24)',
    tags: ['cute', 'bold'],
    keywords: ['candy', 'sweet', 'pink', 'lollipop'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#ec4899 0%,#fbbf24 100%)' },
    caption: {
      text: 'Sugar Rush · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fff1f2'
    },
    decorations: [
      emoji('🍭', 0.05, 0.04, 0.13, 'foreground', -15, 1),
      emoji('🍬', 0.88, 0.08, 0.1, 'foreground', 10, 1),
      emoji('🧁', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('🍩', 0.88, 0.88, 0.11, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#fff1f2', width: 3, radius: 0.07 }
  },
  {
    id: 'korean-milk',
    label: 'Korean Milk',
    tagline: 'Pastel blue + soft bear.',
    preview: 'linear-gradient(135deg,#dbeafe,#f0f9ff)',
    tags: ['cute', 'aesthetic'],
    keywords: ['korean', 'milk', 'soft', 'bear'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#f0f9ff 0%,#bfdbfe 100%)' },
    caption: {
      text: 'Annyeong · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#1e40af'
    },
    decorations: [
      emoji('🥛', 0.05, 0.04, 0.11, 'foreground', 0, 1),
      emoji('🐻', 0.88, 0.08, 0.11, 'foreground', 0, 1),
      emoji('🌸', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('☁️', 0.88, 0.88, 0.11, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#1e40af', width: 2, radius: 0.07 }
  },
  {
    id: 'k-idol',
    label: 'K-Idol',
    tagline: 'Hero photocard + 3 B-sides.',
    preview: 'linear-gradient(135deg,#a855f7,#ec4899)',
    tags: ['fandom', 'cute'],
    keywords: ['kpop', 'idol', 'photocard', 'bias', 'seventeen', 'newjeans', 'pc'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#5b21b6 0%,#ec4899 60%,#f59e0b 100%)' },
    caption: {
      text: '♡ BIAS WRECKER ♡ · {date}',
      font: "900 18px 'Space Grotesk', sans-serif",
      color: '#fff'
    },
    decorations: [],
    slotBorder: { color: '#fff', width: 3, radius: 0.06 },
    layouts: {
      strip: {
        aspect: 0.58,
        slots: [
          // Hero besar atas (photocard A).
          {
            x: 0.12, y: 0.12, w: 0.76, h: 0.44, radius: 0.06,
            border: { color: '#fff', width: 4 },
            perSlotDecorations: [
              emoji('♡', 0.9, 0.08, 0.06, 'foreground', 0, 1, '#fff'),
              emoji('01', 0.1, 0.08, 0.045, 'foreground', 0, 1, '#fff')
            ]
          },
          // 3 thumbnail kecil di bawah.
          { x: 0.04, y: 0.6, w: 0.285, h: 0.28, radius: 0.05, border: { color: '#fff', width: 2 } },
          { x: 0.355, y: 0.6, w: 0.285, h: 0.28, radius: 0.05, border: { color: '#fff', width: 2 } },
          { x: 0.675, y: 0.6, w: 0.285, h: 0.28, radius: 0.05, border: { color: '#fff', width: 2 } }
        ],
        decorations: [
          emoji('⭐', 0.06, 0.04, 0.05, 'foreground', 0, 1),
          emoji('💜', 0.93, 0.04, 0.05, 'foreground', 0, 1),
          emoji('♬', 0.5, 0.58, 0.035, 'foreground', 0, 0.9, '#fff')
        ],
        header: {
          text: '★ FAN MEETING · 2026 ★',
          font: "900 20px 'Space Grotesk', sans-serif",
          color: '#fff',
          y: 0.055
        }
      }
    }
  },
  {
    id: 'ballet',
    label: 'Ballet',
    tagline: 'Tulle pink + ballerina.',
    preview: 'linear-gradient(135deg,#fecaca,#fbcfe8)',
    tags: ['cute', 'aesthetic'],
    keywords: ['ballet', 'ballerina', 'tulle', 'pink'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#fff1f5 0%,#fbcfe8 100%)' },
    caption: {
      text: 'Pointe Shoes · {date}',
      font: "italic 600 22px Georgia, serif",
      color: '#9d174d'
    },
    decorations: [
      emoji('🩰', 0.05, 0.04, 0.12, 'foreground', -10, 1),
      emoji('💕', 0.88, 0.08, 0.09, 'foreground', 0, 1),
      emoji('🌸', 0.05, 0.88, 0.09, 'foreground', 10, 1),
      emoji('🎀', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#9d174d', width: 2, radius: 0.07 }
  },
  {
    id: 'emo',
    label: 'Emo',
    tagline: 'Black + electric pink.',
    preview: 'linear-gradient(135deg,#000,#ec4899)',
    tags: ['dark'],
    keywords: ['emo', '2000s', 'myspace', 'pink'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#000 0%,#ec4899 100%)' },
    caption: {
      text: 'XOXO · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fbcfe8'
    },
    decorations: [
      emoji('🖤', 0.05, 0.04, 0.1, 'foreground', 0, 1),
      emoji('⛓️', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🎸', 0.05, 0.88, 0.11, 'foreground', -20, 1),
      emoji('💔', 0.88, 0.88, 0.1, 'foreground', 15, 1)
    ],
    slotBorder: { color: '#fbcfe8', width: 3, radius: 0.03 }
  },
  {
    id: 'paris',
    label: 'Paris',
    tagline: 'Eiffel + croissant chic.',
    preview: 'linear-gradient(135deg,#fafaf9,#111827)',
    tags: ['travel', 'minimalist'],
    keywords: ['paris', 'france', 'eiffel', 'chic'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#fafaf9 0%,#e7e5e4 100%)' },
    caption: {
      text: 'Bonjour, Paris · {date}',
      font: "italic 700 22px Georgia, serif",
      color: '#111827'
    },
    decorations: [
      emoji('🗼', 0.05, 0.04, 0.13, 'foreground', 0, 1),
      emoji('🥐', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🎀', 0.05, 0.88, 0.1, 'foreground', 10, 1),
      emoji('☕', 0.88, 0.88, 0.09, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#111827', width: 2, radius: 0.04 }
  },
  {
    id: 'tokyo',
    label: 'Tokyo Night',
    tagline: 'Neon signs + ramen steam.',
    preview: 'linear-gradient(135deg,#1e1b4b,#ec4899)',
    tags: ['travel', 'bold'],
    keywords: ['tokyo', 'japan', 'neon', 'night'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#1e1b4b 0%,#ec4899 100%)' },
    caption: {
      text: 'Tokyo Nights · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fcd34d'
    },
    decorations: [
      emoji('🏯', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🍜', 0.88, 0.08, 0.11, 'foreground', 0, 1),
      emoji('🎌', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('🍥', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fcd34d', width: 3, radius: 0.04 }
  },
  {
    id: 'nyc',
    label: 'NYC',
    tagline: 'Yellow cab + skyline.',
    preview: 'linear-gradient(135deg,#fbbf24,#111827)',
    tags: ['travel', 'bold'],
    keywords: ['nyc', 'new york', 'big apple', 'taxi'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#111827 0%,#fbbf24 100%)' },
    caption: {
      text: 'Empire State · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fff'
    },
    decorations: [
      emoji('🗽', 0.05, 0.04, 0.13, 'foreground', 0, 1),
      emoji('🌆', 0.88, 0.08, 0.12, 'foreground', 0, 1),
      emoji('🚕', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('🍕', 0.88, 0.88, 0.1, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#fff', width: 2, radius: 0.03 }
  },
  {
    id: 'london',
    label: 'London',
    tagline: 'Red bus + foggy charm.',
    preview: 'linear-gradient(135deg,#991b1b,#94a3b8)',
    tags: ['travel'],
    keywords: ['london', 'uk', 'bus', 'queen'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#94a3b8 0%,#991b1b 100%)' },
    caption: {
      text: 'Mind the Gap · {date}',
      font: "bold 22px 'Space Grotesk', serif",
      color: '#fff'
    },
    decorations: [
      emoji('🇬🇧', 0.05, 0.04, 0.11, 'foreground', 0, 1),
      emoji('☂️', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🚌', 0.05, 0.88, 0.12, 'foreground', 0, 1),
      emoji('🕰️', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fff', width: 2, radius: 0.04 }
  },
  {
    id: 'ramadan',
    label: 'Ramadan',
    tagline: 'Hanging lanterns + arch frame.',
    preview: 'linear-gradient(135deg,#064e3b,#facc15)',
    tags: ['seasonal'],
    keywords: ['ramadan', 'eid', 'lantern', 'muslim', 'lebaran'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#052e2b 0%,#1e3a8a 100%)' },
    caption: {
      text: '☪ Ramadan Kareem · {date}',
      font: "italic 700 20px Georgia, serif",
      color: '#facc15'
    },
    decorations: [],
    slotBorder: { color: '#facc15', width: 2, radius: 0.5 },
    layouts: {
      strip: {
        aspect: 0.48,
        slots: [
          // Slot dengan radius besar meniru arch/dome.
          { x: 0.12, y: 0.14, w: 0.76, h: 0.17, radius: 0.5, border: { color: '#facc15', width: 3 } },
          { x: 0.12, y: 0.335, w: 0.76, h: 0.17, radius: 0.5, border: { color: '#facc15', width: 3 } },
          { x: 0.12, y: 0.53, w: 0.76, h: 0.17, radius: 0.5, border: { color: '#facc15', width: 3 } },
          { x: 0.12, y: 0.725, w: 0.76, h: 0.17, radius: 0.5, border: { color: '#facc15', width: 3 } }
        ],
        decorations: [
          // Lantern hanging kiri-kanan bergantian.
          rect(0.06, 0, 0.002, 0.12, '#facc15', { placement: 'foreground', opacity: 0.6 }),
          emoji('🪔', 0.06, 0.13, 0.055, 'foreground', 0, 1),
          rect(0.94, 0, 0.002, 0.09, '#facc15', { placement: 'foreground', opacity: 0.6 }),
          emoji('🪔', 0.94, 0.1, 0.05, 'foreground', 0, 1),
          rect(0.06, 0, 0.002, 0.3, '#facc15', { placement: 'foreground', opacity: 0.6 }),
          emoji('🪔', 0.06, 0.32, 0.045, 'foreground', 0, 1),
          rect(0.94, 0, 0.002, 0.32, '#facc15', { placement: 'foreground', opacity: 0.6 }),
          emoji('🪔', 0.94, 0.33, 0.05, 'foreground', 0, 1),
          emoji('🌙', 0.1, 0.055, 0.055, 'foreground', -15, 1),
          emoji('⭐', 0.22, 0.03, 0.025, 'foreground', 0, 1, '#facc15'),
          emoji('⭐', 0.78, 0.04, 0.03, 'foreground', 0, 1, '#facc15'),
          emoji('🕌', 0.9, 0.055, 0.055, 'foreground', 0, 1),
          emoji('⭐', 0.5, 0.03, 0.02, 'foreground', 0, 1, '#facc15')
        ],
        header: {
          text: '۞ رمضان كريم ۞',
          font: "900 22px 'Amiri', Georgia, serif",
          color: '#facc15',
          y: 0.082
        }
      }
    }
  },
  {
    id: 'lunar',
    label: 'Lunar New Year',
    tagline: 'Red + gold lanterns.',
    preview: 'linear-gradient(135deg,#b91c1c,#facc15)',
    tags: ['seasonal', 'bold'],
    keywords: ['lunar', 'chinese', 'new year', 'imlek'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#b91c1c 0%,#facc15 100%)' },
    caption: {
      text: 'Gong Xi Fa Cai · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fff'
    },
    decorations: [
      emoji('🏮', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🧧', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🐉', 0.05, 0.88, 0.12, 'foreground', 0, 1),
      emoji('🎆', 0.88, 0.88, 0.11, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fff', width: 3, radius: 0.04 }
  },
  {
    id: 'newspaper',
    label: 'Newspaper',
    tagline: 'Big headline + column grid.',
    preview: 'linear-gradient(135deg,#fafaf9,#e5e5e5)',
    tags: ['retro', 'minimalist'],
    keywords: ['newspaper', 'news', 'press', 'vintage', 'tabloid'],
    background: { kind: 'solid', value: '#f5f5f4' },
    caption: {
      text: 'PRINTED TODAY · {date}',
      font: "900 20px Georgia, serif",
      color: '#111'
    },
    decorations: [],
    slotBorder: { color: '#111', width: 2, radius: 0 },
    layouts: {
      strip: {
        aspect: 0.5,
        background: { kind: 'solid', value: '#f7f5ef' },
        // Masthead area atas, slot besar + 3 kolom bawah.
        slots: [
          // Hero (besar atas).
          { x: 0.05, y: 0.1, w: 0.9, h: 0.38, radius: 0, border: { color: '#111', width: 3 } },
          // Kolom kiri, tengah, kanan.
          { x: 0.05, y: 0.52, w: 0.29, h: 0.34, radius: 0, border: { color: '#111', width: 2 } },
          { x: 0.355, y: 0.52, w: 0.29, h: 0.34, radius: 0, border: { color: '#111', width: 2 } },
          { x: 0.66, y: 0.52, w: 0.29, h: 0.34, radius: 0, border: { color: '#111', width: 2 } }
        ],
        decorations: [
          // Double rule (masthead separator).
          rect(0.5, 0.075, 0.9, 0.003, '#111', { placement: 'foreground' }),
          rect(0.5, 0.088, 0.9, 0.001, '#111', { placement: 'foreground' }),
          // Ornament kecil di bawah masthead.
          emoji('⚜️', 0.5, 0.065, 0.018, 'foreground', 0, 0.8, '#111'),
          // Caption kecil di setiap kolom (imitasi dateline).
          emoji('•', 0.195, 0.885, 0.015, 'foreground', 0, 1, '#111'),
          emoji('•', 0.5, 0.885, 0.015, 'foreground', 0, 1, '#111'),
          emoji('•', 0.805, 0.885, 0.015, 'foreground', 0, 1, '#111')
        ],
        header: {
          text: 'THE DAILY TIMES',
          font: "900 56px 'Playfair Display', Georgia, serif",
          color: '#111',
          y: 0.045
        },
        footer: {
          text: 'Vol.1 · No.1 · {date} · Price 5¢',
          font: "italic 600 16px Georgia, serif",
          color: '#111',
          y: 0.94
        }
      }
    }
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    tagline: 'Soft painted wash.',
    preview: 'linear-gradient(135deg,#dbeafe,#fecaca,#bbf7d0)',
    tags: ['aesthetic', 'minimalist'],
    keywords: ['watercolor', 'paint', 'soft'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#dbeafe 0%,#fecaca 50%,#bbf7d0 100%)'
    },
    caption: {
      text: 'Painted Moments · {date}',
      font: "italic 600 22px Georgia, serif",
      color: '#334155'
    },
    decorations: [
      emoji('🎨', 0.05, 0.04, 0.11, 'foreground', -10, 1),
      emoji('🖌️', 0.88, 0.08, 0.1, 'foreground', 15, 1),
      emoji('🌺', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('🌈', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#334155', width: 2, radius: 0.06 }
  },
  {
    id: 'indonesia',
    label: 'Nusantara',
    tagline: 'Batik merah + wayang.',
    preview: 'linear-gradient(135deg,#b91c1c,#facc15)',
    tags: ['travel', 'bold'],
    keywords: ['indonesia', 'batik', 'nusantara', 'wayang'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#b91c1c 0%,#facc15 100%)' },
    caption: {
      text: 'Nusantara · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fff'
    },
    decorations: [
      emoji('🇮🇩', 0.05, 0.04, 0.11, 'foreground', 0, 1),
      emoji('🌺', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🏯', 0.05, 0.88, 0.12, 'foreground', 0, 1),
      emoji('🥁', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fff', width: 3, radius: 0.04 }
  },
  {
    id: 'music-fest',
    label: 'Music Festival',
    tagline: 'Neon stage + crowd glow.',
    preview: 'linear-gradient(135deg,#f97316,#db2777,#7c3aed)',
    tags: ['bold'],
    keywords: ['music', 'festival', 'concert', 'coachella'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#f97316 0%,#db2777 50%,#7c3aed 100%)'
    },
    caption: {
      text: 'Festival Szn · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fff'
    },
    decorations: [
      emoji('🎪', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🎤', 0.88, 0.08, 0.1, 'foreground', 10, 1),
      emoji('🎶', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('🎫', 0.88, 0.88, 0.1, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#fff', width: 3, radius: 0.05 }
  },
  {
    id: 'pixel-game',
    label: 'Pixel Game',
    tagline: 'Arcade screen + HUD score.',
    preview: 'linear-gradient(135deg,#0f172a,#a855f7)',
    tags: ['retro', 'bold'],
    keywords: ['pixel', '8bit', 'game', 'arcade', 'chiptune'],
    background: { kind: 'solid', value: '#0a0214' },
    caption: {
      text: '© 1986 · {date}',
      font: "900 18px monospace",
      color: '#22d3ee'
    },
    decorations: [],
    slotBorder: { color: '#fbbf24', width: 0, radius: 0 },
    layouts: {
      strip: {
        aspect: 0.55,
        background: { kind: 'solid', value: '#0a0214' },
        slots: [
          { x: 0.08, y: 0.18, w: 0.84, h: 0.16, radius: 0, border: { color: '#fbbf24', width: 4 } },
          { x: 0.08, y: 0.36, w: 0.84, h: 0.16, radius: 0, border: { color: '#22d3ee', width: 4 } },
          { x: 0.08, y: 0.54, w: 0.84, h: 0.16, radius: 0, border: { color: '#f472b6', width: 4 } },
          { x: 0.08, y: 0.72, w: 0.84, h: 0.16, radius: 0, border: { color: '#a3e635', width: 4 } }
        ],
        decorations: [
          // HUD score bar atas.
          rect(0.5, 0.12, 0.84, 0.035, '#1e1b4b', {
            placement: 'background',
            stroke: { color: '#fbbf24', width: 2 }
          }),
          emoji('1P', 0.14, 0.12, 0.025, 'foreground', 0, 1, '#fbbf24'),
          emoji('SCORE 999900', 0.38, 0.12, 0.025, 'foreground', 0, 1, '#fff'),
          emoji('♥♥♥', 0.68, 0.12, 0.025, 'foreground', 0, 1, '#ef4444'),
          emoji('⏱ 00:59', 0.85, 0.12, 0.025, 'foreground', 0, 1, '#22d3ee'),
          // Sprite invader kiri-kanan bawah.
          emoji('👾', 0.1, 0.935, 0.05, 'foreground', 0, 1),
          emoji('👾', 0.9, 0.935, 0.05, 'foreground', 0, 1),
          emoji('🪙', 0.92, 0.065, 0.04, 'foreground', 0, 1)
        ],
        header: {
          text: '★ HIGH SCORE PHOTOBOOTH ★',
          font: "900 18px monospace",
          color: '#fbbf24',
          y: 0.055
        }
      }
    }
  },
  {
    id: 'minimal-mono',
    label: 'Mono Minimal',
    tagline: 'Pure black & white.',
    preview: 'linear-gradient(135deg,#fff,#000)',
    tags: ['minimalist'],
    keywords: ['mono', 'black', 'white', 'clean'],
    background: { kind: 'solid', value: '#ffffff' },
    caption: {
      text: '{date}',
      font: "300 22px 'Inter', sans-serif",
      color: '#000'
    },
    decorations: [emoji('•', 0.5, 0.95, 0.04, 'foreground', 0, 1, '#000')],
    slotBorder: { color: '#000', width: 1, radius: 0 }
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    tagline: 'Warm peach dawn.',
    preview: 'linear-gradient(135deg,#fde68a,#fb7185,#f472b6)',
    tags: ['aesthetic', 'nature'],
    keywords: ['sunrise', 'dawn', 'warm', 'peach'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(180deg,#fde68a 0%,#fb7185 50%,#f472b6 100%)'
    },
    caption: {
      text: 'Golden Hour · {date}',
      font: "italic 700 22px Georgia, serif",
      color: '#7c2d12'
    },
    decorations: [
      emoji('🌅', 0.05, 0.04, 0.13, 'foreground', 0, 1),
      emoji('☀️', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🌸', 0.05, 0.88, 0.09, 'foreground', 0, 1),
      emoji('🕊️', 0.88, 0.88, 0.1, 'foreground', 0, 0.95)
    ],
    slotBorder: { color: '#7c2d12', width: 2, radius: 0.06 }
  },
  {
    id: 'neon-city',
    label: 'Neon City',
    tagline: 'Glowing streets + rain.',
    preview: 'linear-gradient(135deg,#0f172a,#22d3ee,#a855f7)',
    tags: ['bold', 'dark', 'travel'],
    keywords: ['neon', 'city', 'night', 'rain'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(160deg,#0f172a 0%,#22d3ee 50%,#a855f7 100%)'
    },
    caption: {
      text: 'After Dark · {date}',
      font: "900 22px 'Space Grotesk', monospace",
      color: '#fff'
    },
    decorations: [
      emoji('🌃', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('💡', 0.88, 0.08, 0.09, 'foreground', 0, 1),
      emoji('🌧️', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('🚦', 0.88, 0.88, 0.09, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fff', width: 3, radius: 0.02 }
  },
  {
    id: 'zen-garden',
    label: 'Zen Garden',
    tagline: 'Minimal ink calligraphy.',
    preview: 'linear-gradient(135deg,#fafaf9,#9ca3af)',
    tags: ['minimalist', 'nature'],
    keywords: ['zen', 'japan', 'garden', 'bamboo', 'sand', 'ink', 'calligraphy'],
    background: { kind: 'solid', value: '#f8f5ed' },
    caption: {
      text: '— 静 —  {date}',
      font: "italic 300 22px Georgia, serif",
      color: '#1a1a1a'
    },
    decorations: [],
    slotBorder: { color: '#1a1a1a', width: 1, radius: 0 },
    layouts: {
      strip: {
        aspect: 0.48,
        background: { kind: 'solid', value: '#f8f5ed' },
        // Slot kecil di sisi kanan, ruang negatif besar di kiri (wabi-sabi).
        slots: [
          { x: 0.45, y: 0.08, w: 0.5, h: 0.2, radius: 0, border: { color: '#1a1a1a', width: 1 } },
          { x: 0.45, y: 0.3, w: 0.5, h: 0.2, radius: 0, border: { color: '#1a1a1a', width: 1 } },
          { x: 0.45, y: 0.52, w: 0.5, h: 0.2, radius: 0, border: { color: '#1a1a1a', width: 1 } },
          { x: 0.45, y: 0.74, w: 0.5, h: 0.2, radius: 0, border: { color: '#1a1a1a', width: 1 } }
        ],
        decorations: [
          // Kaligrafi kanji besar kiri.
          emoji('静', 0.2, 0.2, 0.18, 'foreground', 0, 1, '#1a1a1a'),
          emoji('寂', 0.2, 0.45, 0.18, 'foreground', 0, 1, '#1a1a1a'),
          emoji('空', 0.2, 0.7, 0.18, 'foreground', 0, 1, '#1a1a1a'),
          // Enso ring kecil di bawah.
          emoji('◯', 0.2, 0.88, 0.12, 'foreground', 0, 0.9, '#1a1a1a'),
          // Red seal/hanko (stempel).
          rect(0.26, 0.88, 0.04, 0.025, '#b91c1c', { placement: 'foreground', radius: 0.1 }),
          emoji('印', 0.26, 0.88, 0.02, 'foreground', 0, 1, '#fff')
        ]
      }
    }
  }
] as const;

const MAP: Record<StripThemeId, StripTheme> = Object.fromEntries(
  STRIP_THEMES.map((t) => [t.id, t])
) as Record<StripThemeId, StripTheme>;

export function getStripTheme(id: StripThemeId): StripTheme {
  return MAP[id] ?? MAP.classic;
}

/** Daftar semua kategori tag yang tersedia di registry (untuk UI filter chips). */
export const THEME_TAG_LIST = [
  'minimalist',
  'cute',
  'aesthetic',
  'seasonal',
  'fandom',
  'nature',
  'travel',
  'retro',
  'bold',
  'dark',
  'food',
  'pride'
] as const;
