<script setup lang="ts">
declare const createVaultModal: HTMLDialogElement | undefined

const themeIcon: Record<theme, string> = {
  light: 'heroicons:sun',
  dark: 'heroicons:moon',
  system: 'ic:outline-brightness-medium',
}

const theme = ref<theme>('light')
const mounted = ref<boolean>(false)

onMounted(() => {
  theme.value = getStoredTheme()
  mounted.value = true
  applyTheme()

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', applyTheme)
})

onUnmounted(() => {
  mounted.value = false
})

watchEffect(() => {
  if (mounted.value) {
    applyTheme()
    storeThemeColor(theme.value)
  }
})

function handleSwitchTheme() {
  const themes = ['light', 'dark', 'system']
  let nextThemeIdx = themes.indexOf(theme.value) + 1
  nextThemeIdx = nextThemeIdx > themes.length - 1 ? 0 : nextThemeIdx
  theme.value = themes[nextThemeIdx] as theme
}

function applyTheme() {
  const currentTheme = theme.value === 'system' ? getDeviceTheme() : theme.value

  if (typeof document !== 'undefined') {
    ['light', 'dark', 'system'].forEach((key) => {
      document.documentElement.classList.remove(key)
    })
    document.documentElement.classList.add(currentTheme)
  }
}

function handleCreateNewVault() {
  if (typeof createVaultModal !== 'undefined' && createVaultModal)
    createVaultModal.showModal()
}
</script>

<template>
  <nav class="py-6">
    <LayoutContainer class="flex items-center justify-between">
      <NuxtLink to="/" class="text-2xl font-black">
        StoreHouse
      </NuxtLink>
      <div class="flex flex-row items-center gap-3">
        <UIIconButton class="bg-transparent text-inherit" :icon="themeIcon[theme]" @click="handleSwitchTheme()" />
        <UIButton icon-left="heroicons:plus" class="hidden lg:inline-block text-white" @click="handleCreateNewVault">
          Create New
        </UIButton>
        <UIIconButton icon="heroicons:plus" class="inline-block lg:hidden text-white" @click="handleCreateNewVault" />
      </div>
    </LayoutContainer>
  </nav>
</template>
