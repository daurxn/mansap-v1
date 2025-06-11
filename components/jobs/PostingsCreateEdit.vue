<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <JobsPostingsCreateEditForm @close="isOpen = false" />
  </Dialog>
</template>
