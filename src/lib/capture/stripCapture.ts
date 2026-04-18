/**
 * Orchestrator multi-shot capture. Handle single, strip 4, grid 2x2, dan GIF flow.
 *
 * Untuk GIF, shotCount besar (12) tapi interval singkat (120ms) tanpa countdown
 * per-shot (cuma 1 countdown di awal).
 */

import type { LayoutDef, CapturedShot } from '$lib/types';
import { runCountdown } from './countdown';
import { makeId } from '$lib/utils/id';

export interface CaptureSnapshot {
  /** Ambil PNG blob dari canvas preview saat ini. */
  capture: () => Promise<CapturedShot>;
}

export interface OrchestrateOptions {
  layout: LayoutDef;
  snapshot: CaptureSnapshot;
  countdownSeconds: number;
  onPhase?: (phase: CapturePhase) => void;
  onShotTaken?: (shot: CapturedShot, index: number) => void;
  onCountdownTick?: (remaining: number) => void;
  onFlash?: () => void;
  onBeep?: (remaining: number) => void;
}

export type CapturePhase =
  | { kind: 'idle' }
  | { kind: 'countdown'; shotIndex: number; totalShots: number; remaining: number }
  | { kind: 'flash' }
  | { kind: 'shot-taken'; index: number; total: number }
  | { kind: 'done' }
  | { kind: 'cancelled' }
  | { kind: 'error'; error: string };

export function runMultiCapture(opts: OrchestrateOptions): {
  promise: Promise<CapturedShot[]>;
  cancel: () => void;
} {
  let cancelledFlag = false;
  let currentCountdown: ReturnType<typeof runCountdown> | null = null;

  const promise = (async () => {
    const shots: CapturedShot[] = [];
    try {
      // Mode GIF: 1 countdown awal, lalu burst shot dengan interval kecil.
      if (opts.layout.id === 'gif') {
        opts.onPhase?.({
          kind: 'countdown',
          shotIndex: 0,
          totalShots: opts.layout.shotCount,
          remaining: opts.countdownSeconds
        });
        currentCountdown = runCountdown({
          seconds: opts.countdownSeconds,
          onTick: (remaining) => {
            opts.onCountdownTick?.(remaining);
            opts.onPhase?.({
              kind: 'countdown',
              shotIndex: 0,
              totalShots: opts.layout.shotCount,
              remaining
            });
          },
          onFlash: () => {
            opts.onPhase?.({ kind: 'flash' });
            opts.onFlash?.();
          },
          onBeep: opts.onBeep
        });
        await currentCountdown.promise;

        for (let i = 0; i < opts.layout.shotCount; i += 1) {
          if (cancelledFlag) throw new Error('cancelled');
          const shot = await opts.snapshot.capture();
          shots.push(shot);
          opts.onShotTaken?.(shot, i);
          opts.onPhase?.({ kind: 'shot-taken', index: i, total: opts.layout.shotCount });
          if (i < opts.layout.shotCount - 1) {
            await wait(opts.layout.shotIntervalMs);
          }
        }
      } else {
        // Mode strip/grid/single: countdown per-shot.
        for (let i = 0; i < opts.layout.shotCount; i += 1) {
          if (cancelledFlag) throw new Error('cancelled');
          currentCountdown = runCountdown({
            seconds: opts.countdownSeconds,
            onTick: (remaining) => {
              opts.onCountdownTick?.(remaining);
              opts.onPhase?.({
                kind: 'countdown',
                shotIndex: i,
                totalShots: opts.layout.shotCount,
                remaining
              });
            },
            onFlash: () => {
              opts.onPhase?.({ kind: 'flash' });
              opts.onFlash?.();
            },
            onBeep: opts.onBeep
          });
          await currentCountdown.promise;

          const shot = await opts.snapshot.capture();
          shots.push(shot);
          opts.onShotTaken?.(shot, i);
          opts.onPhase?.({ kind: 'shot-taken', index: i, total: opts.layout.shotCount });

          if (i < opts.layout.shotCount - 1) {
            await wait(opts.layout.shotIntervalMs);
          }
        }
      }

      opts.onPhase?.({ kind: 'done' });
      return shots;
    } catch (err) {
      if (cancelledFlag) {
        opts.onPhase?.({ kind: 'cancelled' });
      } else {
        opts.onPhase?.({
          kind: 'error',
          error: err instanceof Error ? err.message : 'unknown error'
        });
      }
      throw err;
    }
  })();

  return {
    promise,
    cancel() {
      cancelledFlag = true;
      currentCountdown?.cancel();
    }
  };
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Helper: bikin CapturedShot dari canvas (PNG encode).
 */
export async function captureCanvasAsShot(canvas: HTMLCanvasElement): Promise<CapturedShot> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png', 0.95)
  );
  if (!blob) throw new Error('Failed to encode canvas to PNG.');
  const dataUrl = canvas.toDataURL('image/png');
  return {
    id: makeId('shot'),
    blob,
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    takenAt: Date.now()
  };
}
