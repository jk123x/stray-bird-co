<script>
  import { onMount } from 'svelte';
  let isDark = false;

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggleDarkMode() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<button
  on:click={toggleDarkMode}
  class="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition text-xl"
  aria-label="Toggle dark mode"
>
  {isDark ? '☀️' : '🌙'}
</button>