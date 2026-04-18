// See https://svelte.dev/docs/kit/types#app.d.ts for the declaration reference.
// These are the global types for the app.

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface HTMLVideoElement {
    // requestVideoFrameCallback tersedia di Chromium/Safari/Firefox modern tapi belum
    // dideklarasikan di lib.dom.d.ts bawaan TS.
    requestVideoFrameCallback(
      callback: (now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) => void
    ): number;
    cancelVideoFrameCallback(handle: number): void;
  }

  interface VideoFrameCallbackMetadata {
    presentationTime: DOMHighResTimeStamp;
    expectedDisplayTime: DOMHighResTimeStamp;
    width: number;
    height: number;
    mediaTime: number;
    presentedFrames: number;
    processingDuration?: number;
  }
}

export {};
