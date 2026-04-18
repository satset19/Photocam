/**
 * WebAudio wrapper untuk shutter click dan beep countdown.
 * Tidak load file eksternal - semua generated sintetik via OscillatorNode
 * supaya tidak butuh asset audio.
 *
 * AudioContext dibuat lazy setelah user-gesture pertama (autoplay policy).
 */

let ctx: AudioContext | null = null;
let enabled = true;

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => undefined);
  return ctx;
}

export function setAudioEnabled(value: boolean) {
  enabled = value;
}

export function playBeep(frequency = 880, durationMs = 120) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, c.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durationMs / 1000);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + durationMs / 1000 + 0.02);
}

export function playShutter() {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  // Shutter = dua click cepat (buffered noise) + short high-pass.
  const now = c.currentTime;
  for (let i = 0; i < 2; i += 1) {
    const buf = c.createBuffer(1, c.sampleRate * 0.04, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let j = 0; j < data.length; j += 1) {
      const envelope = 1 - j / data.length;
      data[j] = (Math.random() * 2 - 1) * envelope * 0.6;
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    src.connect(filter).connect(c.destination);
    src.start(now + i * 0.06);
  }
}

export function playCountdownTick(remaining: number) {
  // Tick lebih tinggi di detik terakhir.
  if (remaining <= 1) playBeep(1320, 160);
  else playBeep(660, 90);
}
