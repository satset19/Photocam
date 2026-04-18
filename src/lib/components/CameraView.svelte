<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { CameraError, getStream, stopStream, type FacingMode } from '$lib/camera/getStream';
  import { createVideoLoop } from '$lib/camera/videoLoop';
  import { renderFrame, getPreset } from '$lib/pipeline/filters';
  import { applyBeauty } from '$lib/pipeline/beauty';
  import { applyBackgroundReplace } from '$lib/pipeline/segmentation';
  import {
    detectFacesForVideo,
    ensurePipelineLoaded,
    segmentForVideo
  } from '$lib/pipeline/mediapipe';
  import { sessionStore } from '$lib/stores/session.svelte';
  import type { CapturedShot } from '$lib/types';
  import { captureCanvasAsShot } from '$lib/capture/stripCapture';

  interface Props {
    facing?: FacingMode;
    onReady?: (api: CameraViewApi) => void;
    onError?: (err: CameraError) => void;
  }

  let { facing = 'user', onReady, onError }: Props = $props();

  export interface CameraViewApi {
    takeShot: () => Promise<CapturedShot>;
    getCanvas: () => HTMLCanvasElement;
    flash: () => void;
  }

  let videoEl: HTMLVideoElement;
  let canvasEl: HTMLCanvasElement;
  let stream: MediaStream | null = null;
  let loop: ReturnType<typeof createVideoLoop> | null = null;
  let ready = $state(false);
  let errorMessage = $state<string | null>(null);
  let fps = $state(0);
  let flashOpacity = $state(0);
  let pipelineReady = $state(false);
  let bgImage: HTMLImageElement | null = null;

  const api: CameraViewApi = {
    takeShot: async () => captureCanvasAsShot(canvasEl),
    getCanvas: () => canvasEl,
    flash: () => {
      flashOpacity = 1;
      setTimeout(() => {
        flashOpacity = 0;
      }, 140);
    }
  };

  async function boot() {
    try {
      stream = await getStream({ facing });
      videoEl.srcObject = stream;
      await videoEl.play();

      // Set canvas ke resolusi yang match video (dibatasi 1280 biar smooth).
      const vw = Math.min(videoEl.videoWidth || 1280, 1280);
      const vh = Math.min(videoEl.videoHeight || 720, 720);
      canvasEl.width = vw;
      canvasEl.height = vh;

      loop = createVideoLoop(videoEl, (video, now) => {
        drawPreview(video, now);
      });
      loop.start();
      ready = true;
      onReady?.(api);

      // Load MediaPipe lazily; kalau gagal jalan tanpa face-aware.
      ensurePipelineLoaded()
        .then(() => {
          pipelineReady = true;
        })
        .catch(() => {
          pipelineReady = false;
        });
    } catch (err) {
      if (err instanceof CameraError) {
        errorMessage = err.message;
        onError?.(err);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
    }
  }

  function drawPreview(video: HTMLVideoElement, now: DOMHighResTimeStamp) {
    renderFrame(video, canvasEl, sessionStore.filterId, {
      mirror: sessionStore.mirror,
      skipPostEffects: false
    });

    // FPS update for dev (throttled via loop.fps).
    if (loop) fps = loop.fps;

    const preset = getPreset(sessionStore.filterId);
    const needsFace = preset.requiresFaceMask && sessionStore.beautyLevel > 0;
    let landmarks = null as ReturnType<typeof detectFacesForVideo>;

    if (pipelineReady && (needsFace || sessionStore.bgRemoval)) {
      landmarks = detectFacesForVideo(video, now);
    }

    if (pipelineReady && sessionStore.bgRemoval) {
      const segResult = segmentForVideo(video, now);
      applyBackgroundReplace({
        sourceCanvas: canvasEl,
        segmentation: segResult,
        background: bgImage
      });
    }

    if (needsFace) {
      applyBeauty({
        sourceCanvas: canvasEl,
        landmarks: landmarks?.faceLandmarks?.[0] ?? null,
        level: sessionStore.beautyLevel
      });
    }
  }

  onMount(() => {
    boot();
  });

  onDestroy(() => {
    loop?.stop();
    stopStream(stream);
  });

  // Eksport api untuk parent via bind:this kalau mau.
  export function getApi(): CameraViewApi {
    return api;
  }

  // Watch background source (URL atau data URL) supaya di-load jadi Image.
  $effect(() => {
    const src = sessionStore.backgroundSrc;
    if (!src) {
      bgImage = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      bgImage = img;
    };
    img.src = src;
  });
</script>

<div class="relative overflow-hidden rounded-3xl bg-surface-raised shadow-[var(--shadow-card)]">
  <video bind:this={videoEl} class="hidden" muted playsinline autoplay></video>
  <canvas bind:this={canvasEl} class="block aspect-[4/3] w-full object-cover"></canvas>

  {#if !ready && !errorMessage}
    <div class="absolute inset-0 flex items-center justify-center bg-surface/60 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-2 text-muted">
        <div class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p class="text-sm">Menunggu izin kamera...</p>
      </div>
    </div>
  {/if}

  {#if errorMessage}
    <div class="absolute inset-0 flex items-center justify-center bg-surface/90 p-6 text-center">
      <div class="max-w-md">
        <p class="text-lg font-semibold text-on-surface">Kamera tidak bisa diakses</p>
        <p class="mt-2 text-sm text-muted">{errorMessage}</p>
        <button
          type="button"
          class="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
          onclick={() => {
            errorMessage = null;
            boot();
          }}
        >
          Coba lagi
        </button>
      </div>
    </div>
  {/if}

  <!-- Flash overlay -->
  <div
    class="pointer-events-none absolute inset-0 bg-white transition-opacity duration-150"
    style="opacity:{flashOpacity}"
  ></div>

  {#if ready}
    <div
      class="pointer-events-none absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-mono text-white"
    >
      {fps} FPS{pipelineReady ? ' · AI' : ''}
    </div>
  {/if}
</div>
