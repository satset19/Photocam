<script lang="ts">
  interface Props {
    remaining: number | null;
    message?: string;
  }

  let { remaining, message }: Props = $props();
</script>

{#if remaining !== null}
  <div
    class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30"
  >
    <span
      class="font-[var(--font-display)] text-[120px] font-black text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:text-[180px]"
      style="animation: pulse 900ms ease-out;"
    >
      {remaining}
    </span>
    {#if message}
      <span class="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
        {message}
      </span>
    {/if}
  </div>
{/if}

<style>
  @keyframes pulse {
    0% {
      transform: scale(0.6);
      opacity: 0;
    }
    30% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
