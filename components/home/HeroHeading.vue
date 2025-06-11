<template>
  <h1 class="hero-text text-4xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-semibold leading-tight sm:leading-snug md:leading-13 text-white">
    {{ $t("home.hero_title") }}
  </h1>
</template>

<style scoped>
/* Responsive text scaling for different screen sizes */
@media (max-width: 640px) {
  .hero-text {
    font-size: 95%;
  }
}

@media (max-width: 480px) {
  .hero-text {
    font-size: 90%;
  }
}
</style>
