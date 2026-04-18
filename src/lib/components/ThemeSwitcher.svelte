<script lang="ts">
  import { Palette } from 'lucide-svelte';
  import { themeStore } from '$lib/stores/theme.svelte';
  import type { ThemeId } from '$lib/types';

  const themes: Array<{ id: ThemeId; label: string; preview: string }> = [
    { id: 'minimalist', label: 'Minimalist', preview: 'linear-gradient(135deg,#fff,#e5e7eb)' },
    { id: 'kawaii', label: 'Kawaii', preview: 'linear-gradient(135deg,#ffe0ec,#ffd0e8)' },
    { id: 'playful', label: 'Playful', preview: 'linear-gradient(135deg,#1a1b3a,#00d9a5)' }
  ];

  let open = $state(false);
</script>

<div class="relative">
  <button
    type="button"
    aria-label="Ganti tema"
    aria-expanded={open}
    class="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-surface"
    onclick={() => (open = !open)}
  >
    <Palette class="size-4" />
    <span class="hidden sm:inline">Theme</span>
  </button>

  {#if open}
    <div
      class="absolute right-0 z-20 mt-2 w-48 rounded-2xl border border-border bg-surface-raised p-2 shadow-xl"
      role="menu"
    >
      {#each themes as t (t.id)}
        <button
          type="button"
          role="menuitemradio"
          aria-checked={themeStore.current === t.id}
          class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface"
          class:ring-2={themeStore.current === t.id}
          class:ring-primary={themeStore.current === t.id}
          onclick={() => {
            themeStore.set(t.id);
            open = false;
          }}
        >
          <span class="size-5 rounded-full border border-border" style="background:{t.preview}"
          ></span>
          <span>{t.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<svelte:window
  onclick={(e) => {
    if (open && !(e.target as HTMLElement).closest('[aria-expanded]')) open = false;
  }}
/>
