<script setup lang="ts">
const { count } = defineProps<{
  count: number;
}>();
</script>

<template>
  <span class="font-medium">{{ $t("common.results") }} ({{ count }})</span>
</template>
