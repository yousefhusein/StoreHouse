<script setup lang="ts"></script>

<template>
  <div class="w-full p-2 md:w-1/2 lg:w-1/3 2xl:w-1/4">
    <div class="border rounded-lg dark:border-gray-600">
      <div class="p-4 flex flex-row items-center justify-between">
        <div class="w-full me-2">
          <slot name="content" />
        </div>
        <div class="flex gap-2">
          <slot name="actions" />
        </div>
      </div>
      <div class="px-4 py-1 w-full border-t border-t-inherit flex items-center justify-between">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
