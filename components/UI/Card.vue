<script setup lang="ts">
interface CardProps {
  headerTitle: string
}

defineOptions({
  inheritAttrs: false,
})

defineProps<CardProps>()
</script>

<template>
  <div class="w-full border rounded-lg dark:border-gray-600 h-full">
    <div class="px-5 py-3 text-center border-b dark:border-b-gray-600">
      <p class="text-xl font-bold m-0">
        {{ headerTitle }}
      </p>
    </div>
    <div class="px-5 py-3" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>
