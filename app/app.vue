<script setup>
// Prevent flash of incorrect theme
useHead({
  script: [
    {
      innerHTML: `
        (function() {
          try {
            const isDark = localStorage.getItem('darkMode') === 'true';
            if (isDark) {
              document.documentElement.classList.add('dark');
            }
          } catch (e) {}
        })();
      `,
      type: 'text/javascript'
    }
  ]
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
