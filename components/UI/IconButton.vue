<script setup lang="ts">
defineProps(['icon', 'size'])
</script>

<template>
  <button class="size-10 bg-indigo-700 rounded-full transition-transform active:scale-95 flex items-center justify-center">
    <Icon v-if="icon" :name="icon" :size="size || '25'" />
  </button>
</template>
