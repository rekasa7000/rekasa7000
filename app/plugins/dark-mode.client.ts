export default defineNuxtPlugin(() => {
  // Initialize dark mode immediately on client side
  if (process.client) {
    const saved = localStorage.getItem('darkMode')
    const isDark = saved === 'true'

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Set the state
    const { $useState } = useNuxtApp()
    if ($useState) {
      useState('darkMode', () => isDark)
    }
  }
})