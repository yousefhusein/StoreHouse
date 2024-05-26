export function getDeviceTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    return 'dark'
  else
    return 'light'
}

export function getStoredTheme(): theme {
  switch (localStorage.getItem('storehouse-theme')) {
    case 'dark':
      return 'dark'
    case 'light':
      return 'light'
    default:
      return 'system'
  }
}

export function getCurrentTheme() {
  const storedTheme = getStoredTheme()
  localStorage.setItem('storehouse-theme', storedTheme)
  return storedTheme === 'system' ? getDeviceTheme() : storedTheme
}

export function storeThemeColor(theme: theme) {
  localStorage.setItem('storehouse-theme', theme)
}
