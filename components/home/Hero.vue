<script setup lang="ts">
import { useRouter } from "vue-router";
import HeroDescription from "./HeroDescription.vue";
import HeroHeading from "./HeroHeading.vue";

const router = useRouter();

function navigateToFindWork() {
  router.push("/find-work");
}
</script>

<template>
  <div
    class="mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-36 mt-[10vh] sm:mt-[12vh] md:mt-[14vh] max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-[32rem] hero-container"
  >
    <HeroHeading />
    <HeroDescription />
    <Button variant="outline" size="lg" @click="navigateToFindWork">
      {{ $t("home.find_dream_job") }}
    </Button>
  </div>
</template>

<style scoped>
/* Responsive styles for Hero component */
@media (max-width: 640px) {
  .hero-container {
    font-size: 90%;
  }
}

@media (max-width: 480px) {
  .hero-container {
    font-size: 85%;
  }
}
</style>
