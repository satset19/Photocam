<script lang="ts">
  import type { CapturedShot } from '$lib/types';

  interface Props {
    shots: CapturedShot[];
    totalSlots: number;
  }

  let { shots, totalSlots }: Props = $props();

  const placeholders = $derived(Array.from({ length: totalSlots }, (_, i) => shots[i] ?? null));
</script>

<div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
  {#each placeholders as shot, i (i)}
    <div
      class="relative flex aspect-[4/5] w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-raised text-xs font-medium text-muted"
    >
      {#if shot}
        <img src={shot.dataUrl} alt="Shot {i + 1}" class="size-full object-cover" />
      {:else}
        <span>{i + 1}</span>
      {/if}
    </div>
  {/each}
</div>
