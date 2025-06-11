<script setup lang="ts">
import AppHeader from "~/components/app/Header.vue";
</script>

<template>
  <div class="h-screen">
    

    <slot />
  </div>
</template>

<style scoped>
.bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/bg.jpg");
  background-size: cover; /* Or your preferred background-size */
  background-position: center; /* Or your preferred background-position */
}
</style>
