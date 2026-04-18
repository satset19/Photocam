<script lang="ts">
  import '../app.css';
  import { Camera } from 'lucide-svelte';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import { page } from '$app/state';

  let { children } = $props();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/booth', label: 'Booth' },
    { href: '/gallery', label: 'Gallery' }
  ];
</script>

<div class="flex min-h-dvh flex-col">
  <header
    class="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md sm:px-6"
  >
    <a href="/" class="flex items-center gap-2 font-semibold">
      <span
        class="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-fg shadow-sm"
      >
        <Camera class="size-4" />
      </span>
      <span class="font-[var(--font-display)] text-lg tracking-tight">Photobooth</span>
    </a>

    <nav class="hidden items-center gap-1 sm:flex">
      {#each navItems as item (item.href)}
        <a
          href={item.href}
          class="rounded-full px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-raised hover:text-on-surface"
          class:text-on-surface={page.url.pathname === item.href ||
            (item.href !== '/' && page.url.pathname.startsWith(item.href))}
          class:bg-surface-raised={page.url.pathname === item.href ||
            (item.href !== '/' && page.url.pathname.startsWith(item.href))}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <ThemeSwitcher />
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <footer class="border-t border-border px-4 py-6 text-center text-xs text-muted sm:px-6">
    <p>
      Photobooth - all processing happens on your device. No photos are uploaded to any server.
    </p>
  </footer>
</div>
