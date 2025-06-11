<script setup lang="ts">
import Jobs from "~/components/home/Jobs.vue";

const searchQuery = ref("");
</script>

<template>
  <app-main>
    <app-container>
      <HomeJobSearch v-model="searchQuery" />
      <Jobs :search="searchQuery" />
    </app-container>
  </app-main>
</template>
