<script lang="ts">
  import { LAYOUTS } from '$lib/constants';
  import { sessionStore } from '$lib/stores/session.svelte';
</script>

<div class="flex flex-wrap gap-2">
  {#each LAYOUTS as layout (layout.id)}
    <button
      type="button"
      class="rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs font-medium transition hover:border-primary"
      class:border-primary={sessionStore.layout === layout.id}
      class:bg-primary={sessionStore.layout === layout.id}
      class:text-primary-fg={sessionStore.layout === layout.id}
      onclick={() => sessionStore.setLayout(layout.id)}
      aria-pressed={sessionStore.layout === layout.id}
    >
      {layout.label}
    </button>
  {/each}
</div>
