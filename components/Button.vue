<script setup lang="ts">
defineProps(['iconLeft', 'iconRight', 'size'])
</script>

<template>
  <button class="px-5 py-3 bg-indigo-700 text-white rounded-lg transition-transform active:scale-95 flex flex-row items-center justify-between">
    <Icon v-if="iconLeft" :name="iconLeft" :size="size || '25'" />
    <span :class="iconLeft ? 'ms-1' : 'me-1'">
      <slot />
    </span>
    <Icon v-if="iconRight" :name="iconRight" :size="size || '25'" />
  </button>
</template>
