/**
 * Driver render-loop untuk video webcam.
 * Pakai requestVideoFrameCallback kalau ada (frame-synced, hemat battery),
 * fallback ke requestAnimationFrame di browser lawas (Firefox < 121, dll).
 */

export type FrameCallback = (video: HTMLVideoElement, now: DOMHighResTimeStamp) => void;

export interface VideoLoop {
  start: () => void;
  stop: () => void;
  readonly isRunning: boolean;
  readonly fps: number;
}

export function createVideoLoop(video: HTMLVideoElement, onFrame: FrameCallback): VideoLoop {
  let running = false;
  let handle = 0;
  let rafHandle = 0;
  let lastTime = 0;
  let frameCount = 0;
  let fps = 0;

  function trackFps(now: number) {
    if (lastTime === 0) lastTime = now;
    frameCount += 1;
    const delta = now - lastTime;
    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastTime = now;
    }
  }

  const supportsRvfc = typeof video.requestVideoFrameCallback === 'function';

  function rvfcTick(now: DOMHighResTimeStamp) {
    if (!running) return;
    trackFps(now);
    onFrame(video, now);
    handle = video.requestVideoFrameCallback(rvfcTick);
  }

  function rafTick(now: DOMHighResTimeStamp) {
    if (!running) return;
    trackFps(now);
    onFrame(video, now);
    rafHandle = requestAnimationFrame(rafTick);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTime = 0;
      frameCount = 0;
      if (supportsRvfc) {
        handle = video.requestVideoFrameCallback(rvfcTick);
      } else {
        rafHandle = requestAnimationFrame(rafTick);
      }
    },
    stop() {
      running = false;
      if (supportsRvfc && handle) {
        video.cancelVideoFrameCallback(handle);
        handle = 0;
      }
      if (rafHandle) {
        cancelAnimationFrame(rafHandle);
        rafHandle = 0;
      }
    },
    get isRunning() {
      return running;
    },
    get fps() {
      return fps;
    }
  };
}
