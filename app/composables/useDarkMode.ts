export const useDarkMode = () => {
  const isDark = useState('darkMode', () => false)

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    if (process.client) {
      localStorage.setItem('darkMode', isDark.value.toString())
      updateDocumentClass()
    }
  }

  const updateDocumentClass = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const initializeDarkMode = () => {
    if (process.client) {
      const saved = localStorage.getItem('darkMode')
      isDark.value = saved === 'true'
      updateDocumentClass()
    }
  }

  return {
    isDark: readonly(isDark),
    toggleDarkMode,
    initializeDarkMode
  }
}