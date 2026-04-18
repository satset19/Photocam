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
    slotBorder: { color: '#ff6fa5', width: 3, radius: 0.06 }
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
    tagline: 'Butterflies + holographic.',
    preview: 'linear-gradient(135deg,#9c5bff,#ff5bd1,#5bcfff)',
    tags: ['retro', 'bold'],
    keywords: ['y2k', '2000s', 'butterfly'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#9c5bff 0%,#ff5bd1 50%,#5bcfff 100%)'
    },
    caption: {
      text: '*・゜ 2K FOREVER ゜・*  {date}',
      font: "900 20px 'Space Grotesk', sans-serif",
      color: '#ffffff'
    },
    decorations: [
      img('/themes/y2k/star.svg', 0.03, 0.04, 0.1, 'background', 0, 0.9),
      img('/themes/y2k/star.svg', 0.9, 0.35, 0.08, 'background', 0, 0.85),
      img('/themes/y2k/star.svg', 0.08, 0.68, 0.07, 'background', 0, 1),
      img('/themes/y2k/butterfly.svg', 0.72, 0.02, 0.22, 'foreground', -12, 1),
      img('/themes/y2k/butterfly.svg', 0.02, 0.88, 0.2, 'foreground', 18, 0.95)
    ],
    slotBorder: { color: '#ffffff', width: 3, radius: 0.07 }
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
    tagline: 'Cosmos planets + rocket trail.',
    preview: 'linear-gradient(135deg,#0a0e2e,#3a1b6e,#0a0e2e)',
    tags: ['aesthetic', 'dark'],
    keywords: ['space', 'galaxy', 'cosmos', 'planets'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#060c2b 0%,#2a1566 50%,#060c2b 100%)' },
    caption: {
      text: 'To the Stars · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#ffe6a0'
    },
    decorations: [
      emoji('🌌', 0.04, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🪐', 0.9, 0.06, 0.12, 'foreground', 0, 1),
      emoji('🚀', 0.05, 0.9, 0.1, 'foreground', -30, 1),
      emoji('✨', 0.9, 0.88, 0.07, 'foreground', 0, 1),
      emoji('⭐', 0.5, 0.05, 0.04, 'background', 0, 0.9)
    ],
    slotBorder: { color: '#ffe6a0', width: 2, radius: 0.04 }
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
    tagline: 'Azure waves + marine life.',
    preview: 'linear-gradient(135deg,#0a5a8a,#4fc3f7)',
    tags: ['nature', 'aesthetic'],
    keywords: ['ocean', 'sea', 'blue', 'water'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#0a5a8a 0%,#4fc3f7 100%)' },
    caption: {
      text: 'Under the Sea · {date}',
      font: "bold 22px 'Space Grotesk', sans-serif",
      color: '#fff5e5'
    },
    decorations: [
      emoji('🌊', 0.05, 0.04, 0.11, 'foreground', 0, 1),
      emoji('🐠', 0.88, 0.08, 0.1, 'foreground', -10, 1),
      emoji('🐚', 0.9, 0.88, 0.09, 'foreground', 20, 1),
      emoji('🐙', 0.05, 0.88, 0.1, 'foreground', 0, 0.95)
    ],
    slotBorder: { color: '#fff5e5', width: 2, radius: 0.05 }
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
    tagline: 'Red + green merry cheer.',
    preview: 'linear-gradient(135deg,#b91c1c,#166534)',
    tags: ['seasonal'],
    keywords: ['christmas', 'xmas', 'natal', 'tree', 'gift'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#991b1b 0%,#14532d 100%)' },
    caption: {
      text: 'Merry Christmas · {date}',
      font: "900 22px 'Space Grotesk', serif",
      color: '#fef3c7'
    },
    decorations: [
      emoji('🎄', 0.05, 0.04, 0.13, 'foreground', 0, 1),
      emoji('🎁', 0.88, 0.08, 0.11, 'foreground', 5, 1),
      emoji('⛄', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('🔔', 0.9, 0.88, 0.09, 'foreground', -15, 1)
    ],
    slotBorder: { color: '#fef3c7', width: 3, radius: 0.04 }
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
    tagline: 'Red hearts + romance.',
    preview: 'linear-gradient(135deg,#ff5e87,#ffbfd3)',
    tags: ['seasonal', 'cute'],
    keywords: ['valentine', 'love', 'heart', 'romance'],
    background: { kind: 'linear', value: 'linear-gradient(160deg,#ffbfd3 0%,#ff5e87 100%)' },
    caption: {
      text: 'Be My Valentine · {date}',
      font: "italic 700 22px 'Space Grotesk', serif",
      color: '#6b0f2d'
    },
    decorations: [
      emoji('❤️', 0.05, 0.04, 0.1, 'foreground', -10, 1),
      emoji('💐', 0.88, 0.07, 0.11, 'foreground', 0, 1),
      emoji('🌹', 0.06, 0.88, 0.1, 'foreground', 15, 1),
      emoji('💌', 0.88, 0.88, 0.1, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#6b0f2d', width: 2, radius: 0.07 }
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
    tagline: 'Cake + confetti + balloons.',
    preview: 'linear-gradient(135deg,#fbcfe8,#93c5fd,#fde68a)',
    tags: ['seasonal', 'cute'],
    keywords: ['birthday', 'cake', 'party', 'balloon'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#fbcfe8 0%,#93c5fd 50%,#fde68a 100%)'
    },
    caption: {
      text: 'Happy Birthday · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#6b21a8'
    },
    decorations: [
      emoji('🎂', 0.06, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🎈', 0.88, 0.06, 0.12, 'foreground', -10, 1),
      emoji('🎉', 0.05, 0.88, 0.12, 'foreground', 15, 1),
      emoji('🎁', 0.88, 0.88, 0.11, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#6b21a8', width: 3, radius: 0.07 }
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
    tagline: 'Neon magenta + cyan grid.',
    preview: 'linear-gradient(135deg,#ff00ea,#00eaff)',
    tags: ['bold', 'dark', 'retro'],
    keywords: ['cyberpunk', 'neon', 'futuristic', 'tech'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#0d0028 0%,#ff00ea 50%,#00eaff 100%)' },
    caption: {
      text: 'RUN THE NET · {date}',
      font: "900 22px 'Space Grotesk', monospace",
      color: '#00eaff'
    },
    decorations: [
      emoji('🌆', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('⚡', 0.88, 0.08, 0.1, 'foreground', -15, 1),
      emoji('🤖', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('💾', 0.88, 0.88, 0.1, 'foreground', 10, 1)
    ],
    slotBorder: { color: '#00eaff', width: 3, radius: 0.03 }
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
    tagline: 'Bold geometric + squiggles.',
    preview: 'linear-gradient(135deg,#fde047,#f472b6,#22d3ee)',
    tags: ['bold', 'retro'],
    keywords: ['memphis', '80s', 'geometric'],
    background: {
      kind: 'linear',
      value: 'linear-gradient(135deg,#fde047 0%,#f472b6 50%,#22d3ee 100%)'
    },
    caption: {
      text: 'Funky Fresh · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#0f172a'
    },
    decorations: [
      emoji('🎨', 0.05, 0.04, 0.11, 'foreground', -10, 1),
      emoji('📺', 0.88, 0.08, 0.1, 'foreground', 5, 1),
      emoji('📻', 0.05, 0.88, 0.1, 'foreground', -10, 1),
      emoji('🎯', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#0f172a', width: 4, radius: 0.03 }
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
    tagline: 'Magenta + gold jewels.',
    preview: 'linear-gradient(135deg,#a21caf,#facc15)',
    tags: ['bold', 'fandom'],
    keywords: ['bollywood', 'india', 'magenta', 'gold'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#a21caf 0%,#facc15 100%)' },
    caption: {
      text: 'Jhoom · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#fff7ed'
    },
    decorations: [
      emoji('💃', 0.05, 0.04, 0.12, 'foreground', -10, 1),
      emoji('👑', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🪔', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('💎', 0.88, 0.88, 0.09, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fff7ed', width: 3, radius: 0.05 }
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
    tagline: 'Rainbow love flag.',
    preview:
      'linear-gradient(180deg,#ef4444 0 16%,#f97316 16% 32%,#eab308 32% 48%,#22c55e 48% 64%,#3b82f6 64% 82%,#a855f7 82% 100%)',
    tags: ['pride', 'bold'],
    keywords: ['pride', 'lgbtq', 'rainbow', 'love'],
    background: {
      kind: 'linear',
      value:
        'linear-gradient(180deg,#ef4444 0%,#ef4444 16%,#f97316 16%,#f97316 32%,#eab308 32%,#eab308 48%,#22c55e 48%,#22c55e 64%,#3b82f6 64%,#3b82f6 82%,#a855f7 82%,#a855f7 100%)'
    },
    caption: {
      text: 'Love is Love · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#ffffff'
    },
    decorations: [
      emoji('🏳️‍🌈', 0.05, 0.04, 0.14, 'foreground', -10, 1),
      emoji('❤️', 0.88, 0.06, 0.08, 'foreground', 0, 1),
      emoji('🌈', 0.05, 0.9, 0.12, 'foreground', 0, 1),
      emoji('✨', 0.9, 0.9, 0.07, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#ffffff', width: 3, radius: 0.05 }
  },
  {
    id: 'polaroid',
    label: 'Polaroid Pack',
    tagline: 'Cream white + instant film.',
    preview: 'linear-gradient(135deg,#f5f5f4,#d6d3d1)',
    tags: ['retro', 'minimalist'],
    keywords: ['polaroid', 'instant', 'film'],
    background: { kind: 'solid', value: '#f7f3ea' },
    caption: {
      text: 'Moments · {date}',
      font: "italic 600 20px Georgia, serif",
      color: '#44403c'
    },
    decorations: [
      emoji('📸', 0.05, 0.04, 0.1, 'foreground', -10, 1),
      emoji('🎞️', 0.88, 0.08, 0.1, 'foreground', 10, 1),
      emoji('✉️', 0.05, 0.88, 0.09, 'foreground', 0, 1),
      emoji('📝', 0.88, 0.88, 0.09, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#44403c', width: 2, radius: 0.02 }
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
    tagline: 'CRT teal + rewind.',
    preview: 'linear-gradient(135deg,#134e4a,#06b6d4)',
    tags: ['retro'],
    keywords: ['vhs', '90s', 'tape', 'crt'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#134e4a 0%,#06b6d4 100%)' },
    caption: {
      text: 'REC · {date}',
      font: "900 22px monospace",
      color: '#fefce8'
    },
    decorations: [
      emoji('📼', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('📺', 0.88, 0.08, 0.12, 'foreground', 0, 1),
      emoji('🕹️', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('⏯️', 0.88, 0.88, 0.09, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fefce8', width: 3, radius: 0.02 }
  },
  {
    id: 'cafe',
    label: 'Coffee Cafe',
    tagline: 'Brown espresso + pastries.',
    preview: 'linear-gradient(135deg,#78350f,#fde68a)',
    tags: ['food', 'aesthetic'],
    keywords: ['coffee', 'cafe', 'pastry', 'bakery'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#78350f 0%,#fcd34d 100%)' },
    caption: {
      text: 'Latte Art · {date}',
      font: "italic 700 22px Georgia, serif",
      color: '#fffbeb'
    },
    decorations: [
      emoji('☕', 0.05, 0.04, 0.12, 'foreground', -5, 1),
      emoji('🧁', 0.88, 0.08, 0.1, 'foreground', 10, 1),
      emoji('🥐', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('📖', 0.88, 0.88, 0.09, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#fffbeb', width: 2, radius: 0.04 }
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
    tagline: 'Purple + photocard heart.',
    preview: 'linear-gradient(135deg,#a855f7,#ec4899)',
    tags: ['fandom', 'cute'],
    keywords: ['kpop', 'idol', 'photocard', 'bias'],
    background: { kind: 'linear', value: 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)' },
    caption: {
      text: 'Bias Wrecker · {date}',
      font: "900 22px 'Space Grotesk', sans-serif",
      color: '#ffffff'
    },
    decorations: [
      emoji('💜', 0.05, 0.04, 0.1, 'foreground', 0, 1),
      emoji('🎤', 0.88, 0.08, 0.11, 'foreground', 0, 1),
      emoji('🎧', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('⭐', 0.88, 0.88, 0.09, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#ffffff', width: 3, radius: 0.07 }
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
    tagline: 'Crescent moon + lantern.',
    preview: 'linear-gradient(135deg,#064e3b,#facc15)',
    tags: ['seasonal'],
    keywords: ['ramadan', 'eid', 'lantern', 'muslim'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#064e3b 0%,#1e3a8a 100%)' },
    caption: {
      text: 'Ramadan Kareem · {date}',
      font: "italic 700 22px Georgia, serif",
      color: '#facc15'
    },
    decorations: [
      emoji('🌙', 0.05, 0.04, 0.12, 'foreground', -10, 1),
      emoji('🕌', 0.88, 0.08, 0.12, 'foreground', 0, 1),
      emoji('🪔', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('⭐', 0.88, 0.88, 0.09, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#facc15', width: 2, radius: 0.05 }
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
    tagline: 'Black & white vintage press.',
    preview: 'linear-gradient(135deg,#fafafa,#e5e5e5)',
    tags: ['retro', 'minimalist'],
    keywords: ['newspaper', 'news', 'press', 'vintage'],
    background: { kind: 'solid', value: '#f5f5f4' },
    caption: {
      text: 'THE DAILY PRESS · {date}',
      font: "900 22px Georgia, serif",
      color: '#111'
    },
    decorations: [
      emoji('📰', 0.05, 0.04, 0.11, 'foreground', -5, 1, '#111'),
      emoji('✒️', 0.88, 0.08, 0.09, 'foreground', -15, 1, '#111'),
      emoji('📎', 0.05, 0.88, 0.08, 'foreground', 0, 1, '#111'),
      emoji('☕', 0.88, 0.88, 0.09, 'foreground', 0, 1, '#111')
    ],
    slotBorder: { color: '#111', width: 3, radius: 0.01 }
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
    tagline: '8-bit coin + sprite.',
    preview: 'linear-gradient(135deg,#0f172a,#22c55e)',
    tags: ['retro', 'bold'],
    keywords: ['pixel', '8bit', 'game', 'arcade'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#0f172a 0%,#22c55e 100%)' },
    caption: {
      text: 'PRESS START · {date}',
      font: "900 22px monospace",
      color: '#fff'
    },
    decorations: [
      emoji('🎮', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🕹️', 0.88, 0.08, 0.11, 'foreground', 0, 1),
      emoji('👾', 0.05, 0.88, 0.11, 'foreground', 0, 1),
      emoji('🏆', 0.88, 0.88, 0.1, 'foreground', 0, 1)
    ],
    slotBorder: { color: '#fff', width: 3, radius: 0.02 }
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
    tagline: 'Sand ripple + bamboo.',
    preview: 'linear-gradient(135deg,#f5f5f4,#a7c5a0)',
    tags: ['minimalist', 'nature'],
    keywords: ['zen', 'japan', 'garden', 'bamboo', 'sand'],
    background: { kind: 'linear', value: 'linear-gradient(180deg,#fafaf9 0%,#a7c5a0 100%)' },
    caption: {
      text: 'Mindful · {date}',
      font: "italic 600 22px Georgia, serif",
      color: '#365314'
    },
    decorations: [
      emoji('🎋', 0.05, 0.04, 0.12, 'foreground', 0, 1),
      emoji('🍵', 0.88, 0.08, 0.1, 'foreground', 0, 1),
      emoji('🪨', 0.05, 0.88, 0.1, 'foreground', 0, 1),
      emoji('🐟', 0.88, 0.88, 0.1, 'foreground', -10, 1)
    ],
    slotBorder: { color: '#365314', width: 2, radius: 0.04 }
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
