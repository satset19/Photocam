<script lang="ts">
  import { X, CheckCircle2, Loader2, AlertTriangle } from 'lucide-svelte';
  import { sessionStore } from '$lib/stores/session.svelte';
  import { createShareSession, type ShareSession, type ShareStatus } from '$lib/export/qrShare';
  import { suggestFilename } from '$lib/export/download';

  interface Props {
    open: boolean;
    onClose: () => void;
  }

  let { open, onClose }: Props = $props();
  let session = $state<ShareSession | null>(null);
  let status = $state<ShareStatus>({ kind: 'waiting' });
  let loading = $state(false);
  let errorMsg = $state<string | null>(null);

  $effect(() => {
    if (!open) {
      if (session) {
        session.close();
        session = null;
      }
      status = { kind: 'waiting' };
      errorMsg = null;
      return;
    }
    void start();
  });

  async function start() {
    const output = sessionStore.composed;
    if (!output) {
      errorMsg = 'Tidak ada hasil untuk dibagikan.';
      return;
    }
    loading = true;
    try {
      session = await createShareSession({
        blob: output.blob,
        filename: suggestFilename(output.mimeType)
      });
      session.onStatus((s) => {
        status = s;
      });
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Gagal memulai sesi.';
    } finally {
      loading = false;
    }
  }
</script>

{#if open}
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    onclick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') onClose();
    }}
  >
    <div
      class="relative w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl"
    >
      <button
        type="button"
        onclick={onClose}
        class="absolute top-3 right-3 rounded-full p-2 text-muted hover:bg-surface-raised hover:text-on-surface"
        aria-label="Tutup"
      >
        <X class="size-5" />
      </button>

      <h2 class="font-[var(--font-display)] text-xl font-bold">Scan QR dari HP</h2>
      <p class="mt-1 text-sm text-muted">
        Buka kamera HP, scan QR, lalu izinkan download. Peer-to-peer via WebRTC - foto tidak
        melewati server kami.
      </p>

      <div class="mt-5 flex flex-col items-center gap-3">
        {#if loading || !session}
          <div class="flex size-64 items-center justify-center rounded-2xl border border-border bg-surface-raised">
            <Loader2 class="size-8 animate-spin text-muted" />
          </div>
        {:else}
          <img
            src={session.qrDataUrl}
            alt="QR code"
            class="size-64 rounded-2xl border border-border bg-white p-2"
          />
          <p class="font-mono text-xs break-all text-muted">{session.receiverUrl}</p>
        {/if}

        <div class="w-full rounded-xl border border-border bg-surface-raised px-3 py-2 text-center text-sm">
          {#if status.kind === 'waiting'}
            <span class="flex items-center justify-center gap-2 text-muted"
              ><Loader2 class="size-3 animate-spin" /> Menunggu HP scan...</span
            >
          {:else if status.kind === 'connecting'}
            <span class="flex items-center justify-center gap-2 text-primary"
              ><Loader2 class="size-3 animate-spin" /> Connecting...</span
            >
          {:else if status.kind === 'sending'}
            <span class="text-primary">Mengirim {status.bytesSent.toLocaleString()} bytes...</span>
          {:else if status.kind === 'sent'}
            <span class="flex items-center justify-center gap-2 text-green-600"
              ><CheckCircle2 class="size-4" /> Terkirim!</span
            >
          {:else if status.kind === 'error'}
            <span class="flex items-center justify-center gap-2 text-red-600"
              ><AlertTriangle class="size-4" /> {status.message}</span
            >
          {/if}
        </div>

        {#if errorMsg}
          <p class="text-sm text-red-600">{errorMsg}</p>
        {/if}
      </div>
    </div>
  </div>
{/if}
