<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { page } from '$app/state';
  import { Loader2, CheckCircle2, AlertTriangle, Download } from 'lucide-svelte';
  import { receiveFromPeer, type ReceiveStatus } from '$lib/export/peerReceive';

  let status = $state<ReceiveStatus>({ kind: 'connecting' });
  let cleanup: (() => void) | null = null;

  onMount(() => {
    const id = page.url.searchParams.get('id');
    if (!id) {
      status = { kind: 'error', message: 'Peer ID tidak ditemukan di URL.' };
      return;
    }
    cleanup = receiveFromPeer(id, (s) => {
      status = s;
    });
  });

  onDestroy(() => cleanup?.());
</script>

<div class="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-10 text-center">
  <div
    class="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary"
  >
    {#if status.kind === 'connecting' || status.kind === 'waiting' || status.kind === 'receiving'}
      <Loader2 class="size-10 animate-spin" />
    {:else if status.kind === 'done'}
      <CheckCircle2 class="size-10" />
    {:else}
      <AlertTriangle class="size-10 text-red-600" />
    {/if}
  </div>

  <h1 class="font-[var(--font-display)] text-2xl font-bold">
    {#if status.kind === 'connecting'}Menghubungkan...
    {:else if status.kind === 'waiting'}Menunggu foto...
    {:else if status.kind === 'receiving'}Menerima foto...
    {:else if status.kind === 'done'}Foto terdownload!
    {:else}Terjadi kesalahan
    {/if}
  </h1>

  <p class="text-sm text-muted">
    {#if status.kind === 'done'}
      <Download class="inline size-4" /> Cek folder Downloads di HP-mu.
    {:else if status.kind === 'error'}
      {status.message}
    {:else}
      Koneksi peer-to-peer - tetap buka tab ini sampai selesai.
    {/if}
  </p>

  <a
    href="/"
    class="mt-4 rounded-full border border-border bg-surface-raised px-4 py-2 text-sm font-medium"
  >
    Kembali ke beranda
  </a>
</div>
