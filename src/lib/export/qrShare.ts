/**
 * Desktop jadi host PeerJS. Generate peer ID + QR yang berisi URL receiver.
 * Saat mobile terkoneksi, kirim metadata file lalu ArrayBuffer.
 *
 * Pattern mengikuti dokumentasi PeerJS untuk file transfer binary.
 */

import Peer, { type DataConnection } from 'peerjs';
import QRCode from 'qrcode';
import { PEERJS_OPTIONS } from '$lib/constants';

export interface ShareSession {
  peerId: string;
  qrDataUrl: string;
  receiverUrl: string;
  /** Subscribe untuk tahu status connection. */
  onStatus: (cb: (status: ShareStatus) => void) => void;
  close: () => void;
}

export type ShareStatus =
  | { kind: 'waiting' }
  | { kind: 'connecting' }
  | { kind: 'sending'; bytesSent: number; total: number }
  | { kind: 'sent' }
  | { kind: 'error'; message: string };

export interface ShareOptions {
  blob: Blob;
  filename: string;
}

export async function createShareSession(opts: ShareOptions): Promise<ShareSession> {
  const peer = new Peer(undefined as unknown as string, PEERJS_OPTIONS);
  const peerId = await new Promise<string>((resolve, reject) => {
    peer.on('open', (id) => resolve(id));
    peer.on('error', (err) => reject(err));
  });

  const receiverUrl = `${window.location.origin}/receive?id=${peerId}`;
  const qrDataUrl = await QRCode.toDataURL(receiverUrl, {
    width: 512,
    margin: 1,
    color: { dark: '#0f172a', light: '#ffffff' }
  });

  const listeners: Array<(status: ShareStatus) => void> = [];
  const emit = (s: ShareStatus) => {
    for (const l of listeners) l(s);
  };
  emit({ kind: 'waiting' });

  peer.on('connection', (conn) => {
    emit({ kind: 'connecting' });
    conn.on('open', async () => {
      try {
        const buffer = await opts.blob.arrayBuffer();
        // Kirim metadata terlebih dulu.
        conn.send({
          type: 'file-info',
          name: opts.filename,
          size: buffer.byteLength,
          mimeType: opts.blob.type
        });
        // Kemudian payload.
        conn.send({
          type: 'file-data',
          data: buffer
        });
        emit({ kind: 'sending', bytesSent: buffer.byteLength, total: buffer.byteLength });
        // Beri jeda sebelum close biar data sempat ter-flush.
        setTimeout(() => {
          emit({ kind: 'sent' });
          conn.close();
        }, 500);
      } catch (err) {
        emit({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Gagal kirim file.'
        });
      }
    });
    conn.on('error', (err) => {
      emit({ kind: 'error', message: err.message });
    });
  });

  peer.on('error', (err) => {
    emit({ kind: 'error', message: err.message });
  });

  return {
    peerId,
    qrDataUrl,
    receiverUrl,
    onStatus(cb) {
      listeners.push(cb);
    },
    close() {
      peer.destroy();
    }
  };
}

export type { DataConnection };
