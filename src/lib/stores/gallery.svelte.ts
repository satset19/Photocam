import { browser } from '$app/environment';
import { openDB, type IDBPDatabase } from 'idb';
import type { ComposedOutput } from '$lib/types';
import { GALLERY_TTL_MS } from '$lib/constants';

interface GallerySchema {
  outputs: {
    key: string;
    value: ComposedOutput;
    indexes: { createdAt: number };
  };
}

const DB_NAME = 'photobooth';
const DB_VERSION = 1;
const STORE = 'outputs';

let dbPromise: Promise<IDBPDatabase<GallerySchema>> | null = null;

function getDb() {
  if (!browser) throw new Error('Gallery hanya bisa diakses di browser.');
  if (!dbPromise) {
    dbPromise = openDB<GallerySchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    });
  }
  return dbPromise;
}

function createGalleryStore() {
  let items = $state<ComposedOutput[]>([]);
  let loaded = $state(false);

  async function load() {
    if (!browser) return;
    const db = await getDb();
    const all = await db.getAll(STORE);
    // Prune item yang sudah kadaluwarsa.
    const cutoff = Date.now() - GALLERY_TTL_MS;
    const fresh = all.filter((item) => item.createdAt >= cutoff);
    const stale = all.filter((item) => item.createdAt < cutoff);
    if (stale.length > 0) {
      const tx = db.transaction(STORE, 'readwrite');
      for (const item of stale) await tx.store.delete(item.id);
      await tx.done;
    }
    fresh.sort((a, b) => b.createdAt - a.createdAt);
    items = fresh;
    loaded = true;
  }

  async function add(output: ComposedOutput) {
    const db = await getDb();
    await db.put(STORE, output);
    items = [output, ...items];
  }

  async function remove(id: string) {
    const db = await getDb();
    await db.delete(STORE, id);
    items = items.filter((item) => item.id !== id);
  }

  async function clear() {
    const db = await getDb();
    await db.clear(STORE);
    items = [];
  }

  return {
    get items() {
      return items;
    },
    get loaded() {
      return loaded;
    },
    load,
    add,
    remove,
    clear
  };
}

export const galleryStore = createGalleryStore();
