<script setup>
defineProps(['submitButtonText', 'headerTitle', 'handleCloseModal', 'handleSubmit'])
</script>

<template>
  <dialog class="backdrop:bg-[rgba(0,0,0,.5)] bg-gray-100 border rounded-lg overflow-hidden w-full md:w-2/4 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:backdrop:bg-[rgba(0,0,0,.8)]">
    <div class="border-b py-3 px-5 flex flex-row justify-between items-center dark:border-b-inherit">
      <strong>{{ headerTitle }}</strong>
      <UIIconButton icon="heroicons:x-mark" class="bg-transparent text-black dark:text-white" @click="handleCloseModal" />
    </div>
    <form class="py-3 px-5" @submit="$event.preventDefault(), handleSubmit()">
      <slot />
      <div class="flex flex-row">
        <UIButton icon-right="heroicons:plus" class="py-2 mt-2 text-white" type="submit">
          {{ submitButtonText }}
        </UIButton>
        <UIButton class="py-2 mt-2 ms-2 bg-transparent" type="button" @click="handleCloseModal()">
          Cancel
        </UIButton>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
</style>
