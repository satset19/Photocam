<script lang="ts">
  import { FILTER_PRESETS } from '$lib/constants';
  import { sessionStore } from '$lib/stores/session.svelte';
</script>

<div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
  {#each FILTER_PRESETS as preset (preset.id)}
    <button
      type="button"
      class="flex shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-border bg-surface-raised px-3 py-2 text-xs font-medium transition hover:border-primary"
      class:border-primary={sessionStore.filterId === preset.id}
      class:ring-2={sessionStore.filterId === preset.id}
      class:ring-primary={sessionStore.filterId === preset.id}
      onclick={() => sessionStore.setFilter(preset.id)}
      aria-pressed={sessionStore.filterId === preset.id}
    >
      <div
        class="size-10 rounded-lg bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10"
        style="filter:{preset.cssFilter};"
      ></div>
      <span>{preset.label}</span>
    </button>
  {/each}
</div>
