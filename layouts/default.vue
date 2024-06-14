<script setup>
useHead({
  title: 'Store House',
  meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }],
})
</script>

<template>
  <Body class="font-poppins dark:text-white dark:bg-gray-950">
    <div class="h-full flex flex-col">
      <NavigationHeader />
      <LayoutContainer class="pb-5 ">
        <slot />
      </LayoutContainer>
    </div>
  </Body>
</template>

<style>
html, body, #__nuxt {
  height: 100%;
}

::-webkit-scrollbar {
  background-color: transparent;
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background-color: #ccc;
}
</style>
