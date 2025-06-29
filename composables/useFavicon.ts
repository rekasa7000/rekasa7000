export const useFavicon = () => {
  const colorMode = useColorMode()
  
  const updateFavicon = (theme: string) => {
    if (process.client) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
      link.type = 'image/png'
      link.rel = 'icon'
      link.href = `/icons/logo-${theme}.png`
      document.getElementsByTagName('head')[0].appendChild(link)
    }
  }
  
  // Watch for theme changes
  watch(() => colorMode.value, (newTheme) => {
    updateFavicon(newTheme)
  }, { immediate: true })
  
  return { updateFavicon }
}