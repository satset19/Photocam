<script lang="ts">
  import { sessionStore } from '$lib/stores/session.svelte';
  import { Sparkles } from 'lucide-svelte';
</script>

<label class="flex items-center gap-3 rounded-2xl border border-border bg-surface-raised px-4 py-2.5 text-sm">
  <Sparkles class="size-4 text-primary" />
  <span class="font-medium">Beauty</span>
  <input
    type="range"
    min="0"
    max="100"
    step="1"
    value={sessionStore.beautyLevel}
    oninput={(e) => sessionStore.setBeautyLevel(Number(e.currentTarget.value))}
    class="flex-1 accent-[var(--color-primary)]"
  />
  <span class="w-8 text-right tabular-nums text-muted">{sessionStore.beautyLevel}</span>
</label>
