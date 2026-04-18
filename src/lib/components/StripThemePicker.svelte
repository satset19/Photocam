<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import { STRIP_THEMES, THEME_TAG_LIST } from '$lib/stripThemes/registry';
  import { sessionStore } from '$lib/stores/session.svelte';
  import type { ThemeCategory } from '$lib/stripThemes/types';
  import ThemeThumbnail from './ThemeThumbnail.svelte';

  let query = $state('');
  let activeTag = $state<ThemeCategory | null>(null);

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return STRIP_THEMES.filter((t) => {
      if (activeTag && !t.tags.includes(activeTag)) return false;
      if (!q) return true;
      if (t.label.toLowerCase().includes(q)) return true;
      if (t.id.toLowerCase().includes(q)) return true;
      if (t.tagline.toLowerCase().includes(q)) return true;
      if (t.tags.some((tag) => tag.includes(q))) return true;
      if (t.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
      return false;
    });
  });
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-semibold">Strip Theme</h3>
    <span class="text-xs text-muted">{filtered.length} / {STRIP_THEMES.length}</span>
  </div>

  <label
    class="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm transition focus-within:border-primary"
  >
    <Search class="size-4 text-muted" />
    <input
      type="search"
      bind:value={query}
      placeholder="Cari (anime, zootopia, kpop, pastel...)"
      class="flex-1 bg-transparent outline-none placeholder:text-muted"
      aria-label="Cari strip theme"
    />
    {#if query}
      <button
        type="button"
        onclick={() => (query = '')}
        class="text-muted hover:text-on-surface"
        aria-label="Clear search"
      >
        <X class="size-4" />
      </button>
    {/if}
  </label>

  <!-- Tag filter chips (horizontal scroll). -->
  <div class="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
    <button
      type="button"
      onclick={() => (activeTag = null)}
      aria-pressed={activeTag === null}
      class="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition"
      class:border-primary={activeTag === null}
      class:bg-primary={activeTag === null}
      class:text-primary-fg={activeTag === null}
      class:border-border={activeTag !== null}
      class:text-muted={activeTag !== null}
    >
      All
    </button>
    {#each THEME_TAG_LIST as tag (tag)}
      <button
        type="button"
        onclick={() => (activeTag = activeTag === tag ? null : tag)}
        aria-pressed={activeTag === tag}
        class="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize transition"
        class:border-primary={activeTag === tag}
        class:bg-primary={activeTag === tag}
        class:text-primary-fg={activeTag === tag}
        class:border-border={activeTag !== tag}
        class:text-muted={activeTag !== tag}
      >
        {tag}
      </button>
    {/each}
  </div>

  <div class="grid max-h-96 grid-cols-2 gap-2 overflow-y-auto pr-1">
    {#each filtered as theme (theme.id)}
      <button
        type="button"
        onclick={() => sessionStore.setStripTheme(theme.id)}
        aria-pressed={sessionStore.stripThemeId === theme.id}
        class="group flex flex-col gap-1.5 overflow-hidden rounded-2xl border border-border bg-surface text-left transition hover:border-primary"
        class:ring-2={sessionStore.stripThemeId === theme.id}
        class:ring-primary={sessionStore.stripThemeId === theme.id}
      >
        <div class="relative aspect-[4/6] w-full overflow-hidden">
          <ThemeThumbnail {theme} aspect={0.62} />
        </div>
        <div class="px-2 pb-2">
          <span class="block text-sm font-semibold leading-tight">{theme.label}</span>
          <span class="mt-0.5 block truncate text-[11px] text-muted" title={theme.tagline}
            >{theme.tagline}</span
          >
        </div>
      </button>
    {/each}

    {#if filtered.length === 0}
      <p class="col-span-2 py-6 text-center text-xs text-muted">
        Tidak ada theme cocok dengan "{query}"{activeTag ? ` di tag "${activeTag}"` : ''}.
      </p>
    {/if}
  </div>
</div>
