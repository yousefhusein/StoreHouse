<script setup>
useHead({
  title: 'Store House',
  meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }],
})
</script>

<template>
  <Body class="font-poppins dark:text-white dark:bg-gray-950 flex">
    <div class="flex flex-col h-full w-full">
      <NavigationHeader />
      <slot />
    </div>
  </Body>
</template>

<style>
html, body {
  height: 100%;
  width: 100%;
}

body > div#__nuxt {
  width: 100%;
  flex: 1;
  flex-grow: 3;
}
</style>
