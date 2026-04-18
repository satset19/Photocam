/**
 * State machine countdown untuk capture. Satu instance = satu countdown run.
 *
 * Pemanggil listen ke `onTick(n)` untuk UI (3, 2, 1, 'FLASH'),
 * lalu `await countdown.run()` untuk tahu kapan capture harus terjadi.
 */

export interface CountdownOptions {
  seconds: number;
  onTick?: (remaining: number) => void;
  onFlash?: () => void;
  /** Callback per detik untuk trigger beep. */
  onBeep?: (remaining: number) => void;
}

export function runCountdown(options: CountdownOptions): {
  promise: Promise<void>;
  cancel: () => void;
} {
  const { seconds, onTick, onFlash, onBeep } = options;
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const promise = new Promise<void>((resolve, reject) => {
    let remaining = seconds;

    function tick() {
      if (cancelled) {
        reject(new Error('cancelled'));
        return;
      }
      if (remaining <= 0) {
        onFlash?.();
        resolve();
        return;
      }
      onTick?.(remaining);
      onBeep?.(remaining);
      timer = setTimeout(() => {
        remaining -= 1;
        tick();
      }, 1000);
    }

    tick();
  });

  return {
    promise,
    cancel() {
      cancelled = true;
      if (timer) clearTimeout(timer);
    }
  };
}
