import type { CapturedShot, ComposedOutput, FilterPresetId, LayoutId } from '$lib/types';
import type { StripThemeId } from '$lib/stripThemes/types';

/**
 * State sesi capture saat ini. Dibersihkan saat user keluar dari flow.
 * Tidak dipersistensi — untuk persisten, commit ke galleryStore.
 */
function createSessionStore() {
  let layout = $state<LayoutId>('strip');
  let filterId = $state<FilterPresetId>('beauty');
  let beautyLevel = $state<number>(60); // 0..100
  let mirror = $state<boolean>(true); // mirror webcam (selfie view)
  let bgRemoval = $state<boolean>(false);
  let backgroundSrc = $state<string | null>(null);
  let audioEnabled = $state<boolean>(true);
  let stripThemeId = $state<StripThemeId>('classic');
  let shots = $state<CapturedShot[]>([]);
  let composed = $state<ComposedOutput | null>(null);

  return {
    get layout() {
      return layout;
    },
    setLayout(id: LayoutId) {
      layout = id;
      // Reset shots kalau ganti layout (jumlah shot bisa beda).
      shots = [];
      composed = null;
    },
    get filterId() {
      return filterId;
    },
    setFilter(id: FilterPresetId) {
      filterId = id;
    },
    get beautyLevel() {
      return beautyLevel;
    },
    setBeautyLevel(level: number) {
      beautyLevel = Math.max(0, Math.min(100, level));
    },
    get mirror() {
      return mirror;
    },
    toggleMirror() {
      mirror = !mirror;
    },
    get bgRemoval() {
      return bgRemoval;
    },
    toggleBgRemoval() {
      bgRemoval = !bgRemoval;
    },
    get backgroundSrc() {
      return backgroundSrc;
    },
    setBackground(src: string | null) {
      backgroundSrc = src;
    },
    get audioEnabled() {
      return audioEnabled;
    },
    toggleAudio() {
      audioEnabled = !audioEnabled;
    },
    get stripThemeId() {
      return stripThemeId;
    },
    setStripTheme(id: StripThemeId) {
      stripThemeId = id;
    },
    get shots() {
      return shots;
    },
    addShot(shot: CapturedShot) {
      shots = [...shots, shot];
    },
    clearShots() {
      shots = [];
      composed = null;
    },
    get composed() {
      return composed;
    },
    setComposed(next: ComposedOutput | null) {
      composed = next;
    }
  };
}

export const sessionStore = createSessionStore();
