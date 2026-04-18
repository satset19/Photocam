<script lang="ts">
  import { onMount } from 'svelte';
  import { Download, Trash2, Image as ImageIcon } from 'lucide-svelte';
  import { galleryStore } from '$lib/stores/gallery.svelte';
  import { downloadBlob, suggestFilename } from '$lib/export/download';

  const previewUrls = new Map<string, string>();

  onMount(() => {
    galleryStore.load();
    return () => {
      for (const url of previewUrls.values()) URL.revokeObjectURL(url);
      previewUrls.clear();
    };
  });

  function urlFor(id: string, blob: Blob) {
    const existing = previewUrls.get(id);
    if (existing) return existing;
    const url = URL.createObjectURL(blob);
    previewUrls.set(id, url);
    return url;
  }
</script>

<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="font-[var(--font-display)] text-3xl font-bold">Session Gallery</h1>
      <p class="mt-1 text-sm text-muted">
        Foto tersimpan di perangkat ini (IndexedDB) dan otomatis dihapus setelah 24 jam.
      </p>
    </div>
    {#if galleryStore.items.length > 0}
      <button
        type="button"
        onclick={() => galleryStore.clear()}
        class="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-red-500 hover:text-red-600"
      >
        Clear all
      </button>
    {/if}
  </div>

  {#if !galleryStore.loaded}
    <p class="text-sm text-muted">Loading...</p>
  {:else if galleryStore.items.length === 0}
    <div
      class="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-surface-raised py-20 text-center"
    >
      <ImageIcon class="size-10 text-muted" />
      <p class="text-sm text-muted">Belum ada foto. Mulai capture dulu di <a href="/booth" class="text-primary underline">/booth</a>.</p>
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {#each galleryStore.items as item (item.id)}
        <div class="group relative overflow-hidden rounded-2xl border border-border bg-surface-raised">
          <img
            src={urlFor(item.id, item.blob)}
            alt="Photobooth {item.layout}"
            class="aspect-square w-full object-cover"
          />
          <div
            class="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100"
          >
            <button
              type="button"
              onclick={() => downloadBlob(item.blob, suggestFilename(item.mimeType))}
              class="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-black"
            >
              <Download class="size-3" /> Download
            </button>
            <button
              type="button"
              onclick={() => galleryStore.remove(item.id)}
              class="flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-medium text-white"
              aria-label="Delete"
            >
              <Trash2 class="size-3" />
            </button>
          </div>
          <div class="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-mono text-white">
            {item.layout}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
