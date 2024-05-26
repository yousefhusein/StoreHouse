<script setup>
useHead({
  title: 'Store House',
  meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }],
})
</script>

<template>
  <Body class="font-poppins dark:text-white dark:bg-gray-950">
    <header aria-label="content header">
      <NavigationsHeader />
    </header>
    <slot />
  </Body>
</template>
