<script setup lang="ts">
interface PropsType {
  label: string
  description: string
  footerTextStart?: string
  footerTextEnd?: string
}

defineProps<PropsType>()
</script>

<template>
  <div class="p-2 w-full">
    <div class="border rounded-lg dark:border-gray-600">
      <div class="p-4 flex flex-row items-center justify-between">
        <div class="w-full me-2">
          <p class="font-semibold">
            {{ label }}
          </p>
          <small>{{ description }}</small>
        </div>
        <div class="flex gap-2">
          <slot />
        </div>
      </div>
      <div v-if="footerTextStart || footerTextEnd" class="px-4 py-1 w-full border-t border-t-inherit flex flex-row flex-wrap justify-between overflow-auto">
        <small>{{ footerTextStart }}</small>
        <small>{{ footerTextEnd }}</small>
      </div>
    </div>
  </div>
</template>
