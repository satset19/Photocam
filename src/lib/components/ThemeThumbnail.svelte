<script lang="ts">
  import type { Decoration, StripTheme } from '$lib/stripThemes/types';

  interface Props {
    theme: StripTheme;
    /** Aspect ratio default kalau theme tidak override. */
    aspect?: number;
  }

  let { theme, aspect: defaultAspect = 0.42 }: Props = $props();

  // Effective aspect: theme.layouts.strip.aspect > default.
  const aspect = $derived(theme.layouts?.strip?.aspect ?? defaultAspect);
  const vbW = 200;
  const vbH = $derived(Math.round(vbW / aspect));

  function gradientStops(css: string) {
    const match = css.match(/linear-gradient\(([^)]+)\)/i);
    if (!match) return null;
    const parts: string[] = [];
    let depth = 0;
    let buf = '';
    for (const ch of match[1]) {
      if (ch === '(') depth += 1;
      else if (ch === ')') depth -= 1;
      if (ch === ',' && depth === 0) {
        parts.push(buf);
        buf = '';
      } else buf += ch;
    }
    if (buf) parts.push(buf);

    let angle = 180;
    let start = 0;
    const first = parts[0]?.trim() ?? '';
    if (/deg$/i.test(first)) {
      angle = parseFloat(first);
      start = 1;
    } else if (/^to\s/i.test(first)) {
      start = 1;
    }
    const stopParts = parts.slice(start);
    const stops = stopParts.map((seg, i) => {
      const s = seg.trim();
      const m = s.match(/(.+?)\s+(-?\d+(?:\.\d+)?)%\s*$/);
      if (m) return { color: m[1].trim(), offset: parseFloat(m[2]) / 100 };
      return { color: s, offset: i / Math.max(1, stopParts.length - 1) };
    });
    return { angle, stops };
  }

  function gradientAngleToCoords(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    const dx = Math.cos(rad) * 0.5;
    const dy = Math.sin(rad) * 0.5;
    return { x1: 0.5 - dx, y1: 0.5 - dy, x2: 0.5 + dx, y2: 0.5 + dy };
  }

  // Background: layout override > theme default.
  const bg = $derived(theme.layouts?.strip?.background ?? theme.background);
  const gradient = $derived(bg.kind === 'linear' ? gradientStops(bg.value) : null);
  const gradCoords = $derived(gradient ? gradientAngleToCoords(gradient.angle) : null);
  const gradId = $derived(`tg_${theme.id.replace(/[^a-z0-9]/gi, '_')}`);

  // Slot geometri: override > default strip (4 slot vertikal).
  const defaultSlots = [
    { x: 0.06, y: 0.03, w: 0.88, h: 0.215, rotation: 0, radius: 0.04 },
    { x: 0.06, y: 0.255, w: 0.88, h: 0.215, rotation: 0, radius: 0.04 },
    { x: 0.06, y: 0.48, w: 0.88, h: 0.215, rotation: 0, radius: 0.04 },
    { x: 0.06, y: 0.705, w: 0.88, h: 0.215, rotation: 0, radius: 0.04 }
  ];
  const slots = $derived(theme.layouts?.strip?.slots ?? defaultSlots);

  // Decorations: theme + layout override, filter yang relevan untuk thumbnail.
  const allDecos = $derived<Decoration[]>([
    ...theme.decorations,
    ...(theme.layouts?.strip?.decorations ?? [])
  ]);
  const bgDecos = $derived(allDecos.filter((d) => d.placement === 'background').slice(0, 10));
  const fgDecos = $derived(allDecos.filter((d) => d.placement === 'foreground').slice(0, 8));

  // Header / footer text override.
  const headerText = $derived(theme.layouts?.strip?.header?.text?.replace('{date}', 'today'));
  const headerY = $derived(theme.layouts?.strip?.header?.y ?? 0.015);
  const headerColor = $derived(theme.layouts?.strip?.header?.color ?? theme.caption.color);

  const footerText = $derived(theme.layouts?.strip?.footer?.text?.replace('{date}', 'today') ?? theme.label);
</script>

<svg
  viewBox="0 0 {vbW} {vbH}"
  preserveAspectRatio="xMidYMid slice"
  class="block h-full w-full"
  role="img"
  aria-label="Preview tema {theme.label}"
>
  {#if gradient && gradCoords}
    <defs>
      <linearGradient
        id={gradId}
        x1={gradCoords.x1 * 100 + '%'}
        y1={gradCoords.y1 * 100 + '%'}
        x2={gradCoords.x2 * 100 + '%'}
        y2={gradCoords.y2 * 100 + '%'}
      >
        {#each gradient.stops as stop (stop.offset + stop.color)}
          <stop offset={stop.offset * 100 + '%'} stop-color={stop.color} />
        {/each}
      </linearGradient>
    </defs>
    <rect x="0" y="0" width={vbW} height={vbH} fill={`url(#${gradId})`} />
  {:else}
    <rect x="0" y="0" width={vbW} height={vbH} fill={bg.kind === 'solid' ? bg.value : '#fff'} />
  {/if}

  <!-- Background decorations (di belakang slot). -->
  {#each bgDecos as dec, i (i)}
    {#if dec.kind === 'text'}
      <text
        x={dec.x * vbW}
        y={dec.y * vbH}
        font-size={Math.max(6, dec.size * vbW * 0.95)}
        text-anchor="middle"
        dominant-baseline="middle"
        fill={dec.color ?? theme.caption.color}
        opacity={dec.opacity ?? 1}
        transform={dec.rotation ? `rotate(${dec.rotation} ${dec.x * vbW} ${dec.y * vbH})` : undefined}
      >{dec.text}</text>
    {:else if dec.kind === 'rect'}
      <rect
        x={(dec.x - dec.w / 2) * vbW}
        y={(dec.y - dec.h / 2) * vbH}
        width={dec.w * vbW}
        height={dec.h * vbH}
        rx={(dec.radius ?? 0) * Math.min(dec.w * vbW, dec.h * vbH)}
        fill={dec.color}
        stroke={dec.stroke?.color ?? 'none'}
        stroke-width={dec.stroke?.width ?? 0}
        opacity={dec.opacity ?? 1}
        transform={dec.rotation ? `rotate(${dec.rotation} ${dec.x * vbW} ${dec.y * vbH})` : undefined}
      />
    {:else}
      <image
        href={dec.src}
        x={dec.x * vbW}
        y={dec.y * vbH}
        width={dec.size * vbW}
        opacity={dec.opacity ?? 1}
      />
    {/if}
  {/each}

  <!-- Photo slots dengan rotation + border. -->
  {#each slots as slot, i (i)}
    {@const cx = (slot.x + slot.w / 2) * vbW}
    {@const cy = (slot.y + slot.h / 2) * vbH}
    {@const r = (slot.radius ?? theme.slotBorder?.radius ?? 0.04) * Math.min(slot.w * vbW, slot.h * vbH)}
    <g
      transform={slot.rotation ? `rotate(${slot.rotation} ${cx} ${cy})` : undefined}
    >
      <rect
        x={slot.x * vbW}
        y={slot.y * vbH}
        width={slot.w * vbW}
        height={slot.h * vbH}
        rx={r}
        fill="rgba(255,255,255,0.55)"
        stroke={slot.border === null
          ? 'none'
          : slot.border?.color ?? theme.slotBorder?.color ?? '#1f2937'}
        stroke-width={slot.border === null
          ? 0
          : Math.max(0.5, (slot.border?.width ?? theme.slotBorder?.width ?? 2) * 0.35)}
      />
      <!-- Placeholder garis diagonal sebagai "foto" visual cue. -->
      <line
        x1={slot.x * vbW + 4}
        y1={slot.y * vbH + 4}
        x2={(slot.x + slot.w) * vbW - 4}
        y2={(slot.y + slot.h) * vbH - 4}
        stroke={theme.slotBorder?.color ?? '#9ca3af'}
        stroke-width="0.5"
        opacity="0.3"
      />
    </g>
  {/each}

  <!-- Foreground decorations (di atas slot). -->
  {#each fgDecos as dec, i (i)}
    {#if dec.kind === 'text'}
      <text
        x={dec.x * vbW}
        y={dec.y * vbH}
        font-size={Math.max(6, dec.size * vbW * 0.95)}
        text-anchor="middle"
        dominant-baseline="middle"
        fill={dec.color ?? theme.caption.color}
        opacity={dec.opacity ?? 1}
        transform={dec.rotation ? `rotate(${dec.rotation} ${dec.x * vbW} ${dec.y * vbH})` : undefined}
      >{dec.text}</text>
    {:else if dec.kind === 'rect'}
      <rect
        x={(dec.x - dec.w / 2) * vbW}
        y={(dec.y - dec.h / 2) * vbH}
        width={dec.w * vbW}
        height={dec.h * vbH}
        rx={(dec.radius ?? 0) * Math.min(dec.w * vbW, dec.h * vbH)}
        fill={dec.color}
        stroke={dec.stroke?.color ?? 'none'}
        stroke-width={dec.stroke?.width ?? 0}
        opacity={dec.opacity ?? 1}
        transform={dec.rotation ? `rotate(${dec.rotation} ${dec.x * vbW} ${dec.y * vbH})` : undefined}
      />
    {:else}
      <image
        href={dec.src}
        x={dec.x * vbW}
        y={dec.y * vbH}
        width={dec.size * vbW}
        opacity={dec.opacity ?? 1}
      />
    {/if}
  {/each}

  <!-- Header / footer label text. -->
  {#if headerText}
    <text
      x={vbW / 2}
      y={headerY * vbH}
      font-size={Math.max(8, vbW * 0.05)}
      text-anchor="middle"
      dominant-baseline="middle"
      fill={headerColor}
      font-weight="800"
      font-family="'Space Grotesk', 'Inter', sans-serif"
    >{headerText}</text>
  {/if}
  <text
    x={vbW / 2}
    y={vbH - vbH * 0.03}
    font-size={Math.max(7, vbW * 0.048)}
    text-anchor="middle"
    dominant-baseline="middle"
    fill={theme.caption.color}
    font-weight="700"
    font-family="'Space Grotesk', 'Inter', sans-serif"
  >{footerText}</text>
</svg>
