import { browser } from '$app/environment';
import type { ThemeId } from '$lib/types';

const STORAGE_KEY = 'photobooth:theme';
const DEFAULT_THEME: ThemeId = 'minimalist';

function loadInitial(): ThemeId {
  if (!browser) return DEFAULT_THEME;
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  if (saved === 'minimalist' || saved === 'kawaii' || saved === 'playful') return saved;
  return DEFAULT_THEME;
}

/** Store theme global. Ganti via `themeStore.set(...)`. */
function createThemeStore() {
  let current = $state<ThemeId>(loadInitial());

  if (browser) {
    // Terapkan saat load pertama kali agar konsisten dengan app.html default.
    document.documentElement.dataset.theme = current;
  }

  return {
    get current() {
      return current;
    },
    set(next: ThemeId) {
      current = next;
      if (browser) {
        document.documentElement.dataset.theme = next;
        localStorage.setItem(STORAGE_KEY, next);
      }
    },
    cycle() {
      const order: ThemeId[] = ['minimalist', 'kawaii', 'playful'];
      const idx = order.indexOf(current);
      this.set(order[(idx + 1) % order.length]);
    }
  };
}

export const themeStore = createThemeStore();
