<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" type="text" class="bg-inherit px-5 py-2 outline-none ring-2 ring-gray-200 focus:ring-blue-700 w-full dark:ring-gray-600">
</template>

<style scoped>
  ::file-selector-button {
    display: none;
  }
</style>
