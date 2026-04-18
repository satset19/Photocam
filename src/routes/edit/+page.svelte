<script lang="ts">
  import { Download, QrCode, Save, RefreshCcw, Home, Loader2 } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { sessionStore } from '$lib/stores/session.svelte';
  import { galleryStore } from '$lib/stores/gallery.svelte';
  import { downloadBlob, suggestFilename } from '$lib/export/download';
  import QRShareDialog from '$lib/components/QRShareDialog.svelte';
  import StripThemePicker from '$lib/components/StripThemePicker.svelte';
  import { composeOutput } from '$lib/composer/compose';
  import { onMount } from 'svelte';

  let previewUrl = $state<string | null>(null);
  let qrOpen = $state(false);
  let saved = $state(false);
  let recomposing = $state(false);
  let lastAppliedTheme = $state<string | null>(null);

  onMount(() => {
    if (!sessionStore.composed) {
      goto('/');
      return;
    }
    refreshPreview();
    lastAppliedTheme = sessionStore.composed.stripThemeId ?? null;
  });

  function refreshPreview() {
    const output = sessionStore.composed;
    if (!output) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(output.blob);
  }

  // Watch theme change → re-compose output.
  $effect(() => {
    const currentTheme = sessionStore.stripThemeId;
    if (recomposing) return;
    if (!sessionStore.composed) return;
    if (sessionStore.composed.layout === 'gif') return;
    if (currentTheme === lastAppliedTheme) return;
    void recompose();
  });

  async function recompose() {
    if (!sessionStore.shots.length) return;
    recomposing = true;
    try {
      const output = await composeOutput({
        layout: sessionStore.layout,
        shots: sessionStore.shots,
        filterId: sessionStore.filterId,
        stripThemeId: sessionStore.stripThemeId
      });
      sessionStore.setComposed(output);
      lastAppliedTheme = output.stripThemeId ?? null;
      refreshPreview();
    } finally {
      recomposing = false;
    }
  }

  function handleDownload() {
    const output = sessionStore.composed;
    if (!output) return;
    downloadBlob(output.blob, suggestFilename(output.mimeType));
  }

  async function handleSave() {
    const output = sessionStore.composed;
    if (!output) return;
    await galleryStore.add(output);
    saved = true;
    setTimeout(() => (saved = false), 2000);
  }

  function retake() {
    sessionStore.clearShots();
    goto('/booth');
  }
</script>

{#if sessionStore.composed && previewUrl}
  <div class="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
    <div class="flex items-start justify-center">
      <div
        class="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface-raised p-4 shadow-[var(--shadow-card)]"
      >
        {#if sessionStore.composed.mimeType === 'image/gif'}
          <img src={previewUrl} alt="GIF" class="w-full rounded-2xl" />
        {:else}
          <img src={previewUrl} alt="Hasil photobooth" class="w-full rounded-2xl" />
        {/if}
        {#if recomposing}
          <div
            class="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40 backdrop-blur-sm"
          >
            <Loader2 class="size-8 animate-spin text-white" />
          </div>
        {/if}
      </div>
    </div>

    <aside class="flex flex-col gap-3">
      <h1 class="font-[var(--font-display)] text-2xl font-bold">Hasilmu siap!</h1>
      <p class="text-sm text-muted">
        Download ke device, scan QR untuk kirim ke HP, atau simpan ke galeri sesi.
      </p>

      <div class="flex flex-col gap-2 pt-2">
        <button
          type="button"
          onclick={handleDownload}
          class="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-fg shadow-sm transition hover:opacity-90"
        >
          <Download class="size-4" /> Download
        </button>
        <button
          type="button"
          onclick={() => (qrOpen = true)}
          class="flex items-center justify-center gap-2 rounded-full border border-border bg-surface-raised px-5 py-3 text-sm font-semibold transition hover:border-primary"
        >
          <QrCode class="size-4" /> Kirim ke HP (QR)
        </button>
        <button
          type="button"
          onclick={handleSave}
          class="flex items-center justify-center gap-2 rounded-full border border-border bg-surface-raised px-5 py-3 text-sm font-semibold transition hover:border-primary"
        >
          <Save class="size-4" /> {saved ? 'Tersimpan!' : 'Simpan ke gallery'}
        </button>
      </div>

      {#if sessionStore.composed.layout !== 'gif'}
        <div class="mt-3 border-t border-border pt-3">
          <StripThemePicker />
        </div>
      {/if}

      <div class="mt-3 border-t border-border pt-3">
        <div class="flex gap-2">
          <button
            type="button"
            onclick={retake}
            class="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted hover:border-primary hover:text-on-surface"
          >
            <RefreshCcw class="size-4" /> Retake
          </button>
          <a
            href="/"
            class="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted hover:border-primary hover:text-on-surface"
          >
            <Home class="size-4" /> Home
          </a>
        </div>
      </div>
    </aside>
  </div>
{/if}

<QRShareDialog open={qrOpen} onClose={() => (qrOpen = false)} />
