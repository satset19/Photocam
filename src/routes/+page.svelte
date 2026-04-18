<script lang="ts">
  import { Sparkles, ImageDown, Wand2, Lock } from 'lucide-svelte';
  import { LAYOUTS } from '$lib/constants';
  import { sessionStore } from '$lib/stores/session.svelte';
  import type { LayoutId } from '$lib/types';
  import { goto } from '$app/navigation';

  function pickLayout(id: LayoutId) {
    sessionStore.setLayout(id);
    goto('/booth');
  }

  const features = [
    { icon: Wand2, title: 'Beauty filter face-aware', body: 'Smooth skin, brightening, warm glow - ala TikTok, real-time.' },
    { icon: Sparkles, title: '7 strip theme cute', body: 'Zootopia, Cartoon, Anime, Kawaii, Y2K, Retro Film, Classic - searchable.' },
    { icon: ImageDown, title: 'Strip, grid, GIF', body: '4 layout output: single, photo strip klasik, grid 2x2, dan GIF boomerang.' },
    { icon: Lock, title: 'Privacy-first', body: 'Semua proses di browser. Tidak ada foto yang diupload ke server manapun.' }
  ];
</script>

<section class="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
  <div
    class="gradient-pan absolute inset-0 -z-10 opacity-40"
    style="background: radial-gradient(60% 60% at 30% 40%, var(--color-primary) 0%, transparent 60%), radial-gradient(60% 60% at 70% 70%, var(--color-accent) 0%, transparent 60%);"
  ></div>

  <div class="mx-auto max-w-5xl text-center">
    <span
      class="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1 text-xs font-medium text-muted"
    >
      <Sparkles class="size-3" /> Private in-browser photobooth
    </span>
    <h1 class="mt-6 font-[var(--font-display)] text-5xl font-bold tracking-tight sm:text-7xl">
      Snap. Filter. <span class="text-primary">Glow.</span>
    </h1>
    <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">
      Photobooth online dengan beauty filter face-aware, layout strip klasik, dan export GIF
      boomerang. Semuanya real-time di browser.
    </p>

    <div class="mt-10">
      <p class="mb-4 text-sm font-medium text-muted">Pilih layout untuk mulai:</p>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each LAYOUTS as layout (layout.id)}
          <button
            type="button"
            onclick={() => pickLayout(layout.id)}
            class="group flex flex-col items-start gap-2 rounded-2xl border border-border bg-surface-raised p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
          >
            <div class="flex h-20 w-full items-center justify-center rounded-xl bg-surface">
              <!-- Icon per layout - ascii box untuk simplicity -->
              {#if layout.id === 'single'}
                <div class="h-14 w-10 rounded-md bg-primary/20"></div>
              {:else if layout.id === 'strip'}
                <div class="flex h-14 flex-col gap-0.5">
                  <div class="h-3 w-6 rounded-sm bg-primary/20"></div>
                  <div class="h-3 w-6 rounded-sm bg-primary/20"></div>
                  <div class="h-3 w-6 rounded-sm bg-primary/20"></div>
                  <div class="h-3 w-6 rounded-sm bg-primary/20"></div>
                </div>
              {:else if layout.id === 'grid'}
                <div class="grid h-14 w-14 grid-cols-2 gap-0.5">
                  <div class="rounded-sm bg-primary/20"></div>
                  <div class="rounded-sm bg-primary/20"></div>
                  <div class="rounded-sm bg-primary/20"></div>
                  <div class="rounded-sm bg-primary/20"></div>
                </div>
              {:else}
                <div
                  class="h-14 w-14 animate-pulse rounded-md bg-gradient-to-br from-primary/40 to-accent/40"
                ></div>
              {/if}
            </div>
            <span class="font-semibold">{layout.label}</span>
            <span class="text-xs text-muted">{layout.description}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<section class="bg-surface-raised px-4 py-16 sm:px-6">
  <div class="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each features as feature (feature.title)}
      <div class="rounded-2xl border border-border bg-surface p-6">
        <feature.icon class="size-6 text-primary" />
        <h3 class="mt-4 font-semibold">{feature.title}</h3>
        <p class="mt-1 text-sm text-muted">{feature.body}</p>
      </div>
    {/each}
  </div>
</section>
