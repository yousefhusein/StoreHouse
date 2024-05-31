<script setup>
useHead({
  title: 'Store House',
  meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }],
})
</script>

<template>
  <Body class="font-poppins dark:text-white dark:bg-gray-950">
    <NavigationHeader />
    <slot />
  </Body>
</template>

<style>
::-webkit-scrollbar {
  background-color: transparent;
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background-color: #ccc;
}
</style>
