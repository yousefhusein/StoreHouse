<script setup lang="ts">
interface PropsType {
  icon: string
  size?: string
}

defineProps<PropsType>()
</script>

<template>
  <button class="size-10 bg-indigo-700 rounded-full transition-transform active:scale-95 flex items-center justify-center">
    <Icon :name="icon" :size="size || '25'" />
  </button>
</template>
