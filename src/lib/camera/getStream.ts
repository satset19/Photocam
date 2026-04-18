/**
 * Wrapper tipis di atas navigator.mediaDevices.getUserMedia dengan:
 * - preferensi resolusi HD yang graceful-fallback ke SD kalau device tidak sanggup,
 * - pilihan kamera depan (user) / belakang (environment) untuk mobile.
 *
 * Tidak menyimpan stream secara global - caller bertanggung jawab stop track saat cleanup.
 */

export type FacingMode = 'user' | 'environment';

export interface GetStreamOptions {
  facing?: FacingMode;
  preferredWidth?: number;
}

export class CameraError extends Error {
  constructor(
    message: string,
    public readonly kind: 'permission' | 'no-device' | 'insecure' | 'unknown'
  ) {
    super(message);
    this.name = 'CameraError';
  }
}

function mapError(err: unknown): CameraError {
  if (!(err instanceof Error)) {
    return new CameraError('Unknown error accessing camera.', 'unknown');
  }
  // DOMException.name di Chrome/Safari/Firefox.
  const name = (err as DOMException).name;
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return new CameraError('Izin kamera ditolak.', 'permission');
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return new CameraError('Kamera tidak ditemukan di perangkat ini.', 'no-device');
  }
  if (name === 'NotReadableError' || name === 'AbortError') {
    return new CameraError('Kamera sedang dipakai aplikasi lain.', 'no-device');
  }
  return new CameraError(err.message || 'Error getting camera stream.', 'unknown');
}

export async function getStream(options: GetStreamOptions = {}): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new CameraError(
      'getUserMedia tidak tersedia. Aplikasi butuh HTTPS atau localhost.',
      'insecure'
    );
  }

  const width = options.preferredWidth ?? 1280;
  const height = Math.round(width * 0.75); // 4:3 base, browser akan adjust ke aspect kamera.

  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: options.facing ?? 'user',
      width: { ideal: width },
      height: { ideal: height },
      frameRate: { ideal: 30 }
    }
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (firstErr) {
    // Retry dengan constraint longgar - banyak device gagal di "ideal" resolusi tinggi.
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: { facingMode: options.facing ?? 'user' },
        audio: false
      });
    } catch {
      throw mapError(firstErr);
    }
  }
}

export function stopStream(stream: MediaStream | null) {
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
}

export async function listVideoInputs(): Promise<MediaDeviceInfo[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((d) => d.kind === 'videoinput');
}
