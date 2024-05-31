<script setup lang="ts">
interface PropsType {
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  h6?: boolean
}

defineProps<PropsType>()
</script>

<template>
  <p
    class="mb-0" :class="{
      'text-sm': h6,
      'text-lg': h5,
      'text-xl': h4,
      'text-2xl': h3,
      'text-3xl': h2,
      'text-4xl': h1,
    }"
  >
    <slot />
  </p>
</template>
