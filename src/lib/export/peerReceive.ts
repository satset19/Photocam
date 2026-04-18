/**
 * Receiver untuk QR share. Dipanggil di `/receive?id=<peerId>`.
 * Connect ke host, terima metadata + file-data, trigger download.
 */

import Peer from 'peerjs';
import { PEERJS_OPTIONS } from '$lib/constants';
import { downloadBlob } from './download';

export type ReceiveStatus =
  | { kind: 'connecting' }
  | { kind: 'waiting' }
  | { kind: 'receiving'; progress: number }
  | { kind: 'done' }
  | { kind: 'error'; message: string };

export function receiveFromPeer(hostId: string, onStatus: (s: ReceiveStatus) => void) {
  const peer = new Peer(undefined as unknown as string, PEERJS_OPTIONS);
  let fileInfo: { name: string; size: number; mimeType: string } | null = null;

  onStatus({ kind: 'connecting' });

  peer.on('open', () => {
    const conn = peer.connect(hostId, { serialization: 'binary', reliable: true });
    onStatus({ kind: 'waiting' });
    conn.on('open', () => {
      // Sudah connect; menunggu host mengirim.
    });
    conn.on('data', (payload) => {
      const msg = payload as { type: string; [key: string]: unknown };
      if (msg.type === 'file-info') {
        fileInfo = {
          name: String(msg.name ?? 'photobooth.png'),
          size: Number(msg.size ?? 0),
          mimeType: String(msg.mimeType ?? 'image/png')
        };
        onStatus({ kind: 'receiving', progress: 0 });
      } else if (msg.type === 'file-data' && fileInfo) {
        const buffer = msg.data as ArrayBuffer;
        const blob = new Blob([buffer], { type: fileInfo.mimeType });
        downloadBlob(blob, fileInfo.name);
        onStatus({ kind: 'done' });
        setTimeout(() => peer.destroy(), 1000);
      }
    });
    conn.on('error', (err) => {
      onStatus({ kind: 'error', message: err.message });
    });
  });

  peer.on('error', (err) => {
    onStatus({ kind: 'error', message: err.message });
  });

  return () => peer.destroy();
}
