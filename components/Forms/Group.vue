<script setup>
defineOptions({
  inheritAttrs: false,
})
defineProps(['label', 'required', 'id'])
</script>

<template>
  <div class="mb-4">
    <label class="font-semibold" :for="id">{{ label }} <code v-if="required">*</code></label>
    <slot />
  </div>
</template>

<style scoped>
code {
  color: crimson
}
</style>
