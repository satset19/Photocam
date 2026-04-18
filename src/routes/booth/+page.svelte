<script lang="ts">
  import { goto } from '$app/navigation';
  import { Camera, FlipHorizontal, Volume2, VolumeX, Image as ImageIcon, Loader2 } from 'lucide-svelte';
  import CameraView, { type CameraViewApi } from '$lib/components/CameraView.svelte';
  import FilterPicker from '$lib/components/FilterPicker.svelte';
  import LayoutPicker from '$lib/components/LayoutPicker.svelte';
  import StripThemePicker from '$lib/components/StripThemePicker.svelte';
  import BeautySlider from '$lib/components/BeautySlider.svelte';
  import ShotStrip from '$lib/components/ShotStrip.svelte';
  import CountdownOverlay from '$lib/components/CountdownOverlay.svelte';
  import { LAYOUTS, DEFAULT_COUNTDOWN_SECONDS } from '$lib/constants';
  import { sessionStore } from '$lib/stores/session.svelte';
  import { runMultiCapture, type CapturePhase } from '$lib/capture/stripCapture';
  import { playBeep, playCountdownTick, playShutter, setAudioEnabled } from '$lib/audio/sounds';
  import { composeOutput } from '$lib/composer/compose';

  let cameraApi = $state<CameraViewApi | null>(null);
  let capturing = $state(false);
  let countdownValue = $state<number | null>(null);
  let countdownMessage = $state<string>('');
  let composing = $state(false);
  let errorMsg = $state<string | null>(null);

  const currentLayout = $derived(
    LAYOUTS.find((l) => l.id === sessionStore.layout) ?? LAYOUTS[0]
  );

  function handlePhase(phase: CapturePhase) {
    if (phase.kind === 'countdown') {
      countdownValue = phase.remaining;
      if (phase.totalShots > 1) {
        countdownMessage = `Shot ${phase.shotIndex + 1} of ${phase.totalShots}`;
      } else {
        countdownMessage = '';
      }
    } else if (phase.kind === 'flash') {
      countdownValue = null;
      cameraApi?.flash();
      playShutter();
    } else if (phase.kind === 'shot-taken') {
      // noop - sudah ditangani onShotTaken.
    } else if (phase.kind === 'done' || phase.kind === 'cancelled' || phase.kind === 'error') {
      countdownValue = null;
      countdownMessage = '';
    }
  }

  async function startCapture() {
    if (!cameraApi || capturing) return;
    errorMsg = null;
    sessionStore.clearShots();
    capturing = true;

    const api = cameraApi;
    const run = runMultiCapture({
      layout: currentLayout,
      countdownSeconds: DEFAULT_COUNTDOWN_SECONDS,
      snapshot: { capture: () => api.takeShot() },
      onPhase: handlePhase,
      onShotTaken: (shot) => {
        sessionStore.addShot(shot);
      },
      onCountdownTick: () => undefined,
      onBeep: (r) => playCountdownTick(r)
    });

    try {
      await run.promise;
      composing = true;
      const output = await composeOutput({
        layout: sessionStore.layout,
        shots: sessionStore.shots,
        filterId: sessionStore.filterId,
        stripThemeId: sessionStore.stripThemeId
      });
      sessionStore.setComposed(output);
      composing = false;
      goto('/edit');
    } catch (err) {
      if (err instanceof Error && err.message !== 'cancelled') {
        errorMsg = err.message;
      }
      composing = false;
    } finally {
      capturing = false;
    }
  }

  function toggleAudio() {
    sessionStore.toggleAudio();
    setAudioEnabled(sessionStore.audioEnabled);
    if (sessionStore.audioEnabled) playBeep(660, 60);
  }
</script>

<div class="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px]">
  <div class="flex flex-col gap-4">
    <div class="relative">
      <CameraView
        onReady={(api) => {
          cameraApi = api;
        }}
      />
      <CountdownOverlay remaining={countdownValue} message={countdownMessage} />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <ShotStrip shots={sessionStore.shots} totalSlots={currentLayout.shotCount} />

      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={() => sessionStore.toggleMirror()}
          class="flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 py-2 text-xs font-medium transition hover:border-primary"
          aria-pressed={sessionStore.mirror}
        >
          <FlipHorizontal class="size-4" />
          Mirror
        </button>
        <button
          type="button"
          onclick={toggleAudio}
          class="flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 py-2 text-xs font-medium transition hover:border-primary"
          aria-pressed={sessionStore.audioEnabled}
          aria-label="Toggle audio"
        >
          {#if sessionStore.audioEnabled}
            <Volume2 class="size-4" />
          {:else}
            <VolumeX class="size-4" />
          {/if}
        </button>
      </div>
    </div>

    <FilterPicker />
    <BeautySlider />

    {#if errorMsg}
      <p class="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
        {errorMsg}
      </p>
    {/if}
  </div>

  <aside class="flex flex-col gap-5">
    <div class="rounded-3xl border border-border bg-surface-raised p-5 shadow-[var(--shadow-card)]">
      <h2 class="font-semibold">Layout</h2>
      <p class="mt-1 text-xs text-muted">{currentLayout.description}</p>
      <div class="mt-3">
        <LayoutPicker />
      </div>

      <div class="mt-5 border-t border-border pt-4">
        <StripThemePicker />
      </div>

      <div class="mt-5 space-y-3 border-t border-border pt-4">
        <label class="flex items-center justify-between gap-3 text-sm">
          <span class="font-medium">Background replace</span>
          <input
            type="checkbox"
            class="h-5 w-9 cursor-pointer appearance-none rounded-full bg-muted/40 transition checked:bg-primary"
            checked={sessionStore.bgRemoval}
            onchange={() => sessionStore.toggleBgRemoval()}
          />
        </label>
        {#if sessionStore.bgRemoval}
          <div class="flex gap-2 overflow-x-auto no-scrollbar">
            {#each ['gradient', 'beach', 'city', 'space'] as key (key)}
              <button
                type="button"
                class="size-10 shrink-0 rounded-lg border border-border bg-gradient-to-br from-primary/50 to-accent/50 transition hover:ring-2 hover:ring-primary"
                onclick={() =>
                  sessionStore.setBackground(
                    key === 'gradient'
                      ? null
                      : `https://picsum.photos/seed/${key}/1024/1024`
                  )}
                aria-label={`Background ${key}`}
              ></button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <button
      type="button"
      disabled={!cameraApi || capturing || composing}
      onclick={startCapture}
      class="relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-semibold text-primary-fg shadow-[var(--shadow-card)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {#if composing}
        <Loader2 class="size-5 animate-spin" /> Composing...
      {:else if capturing}
        <Loader2 class="size-5 animate-spin" /> Capturing...
      {:else}
        <Camera class="size-5" /> Start capture
      {/if}
    </button>

    <a
      href="/gallery"
      class="flex items-center justify-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-muted hover:border-primary hover:text-on-surface"
    >
      <ImageIcon class="size-4" /> Lihat gallery
    </a>
  </aside>
</div>
