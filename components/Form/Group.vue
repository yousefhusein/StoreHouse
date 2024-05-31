<script setup lang="ts">
interface PropsType {
  label: string
}

defineProps<PropsType>()
</script>

<template>
  <div class="px-0 py-2 relative" aria-label="form group">
    <label>{{ label }}</label>
    <slot />
  </div>
</template>
