/**
 * Download blob ke device. Pakai anchor + blob URL.
 */

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Release setelah sedikit delay biar browser sempat mulai download.
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function suggestFilename(mime: string): string {
  const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, 19);
  const ext = mime === 'image/gif' ? 'gif' : mime === 'image/jpeg' ? 'jpg' : 'png';
  return `photobooth_${ts}.${ext}`;
}
