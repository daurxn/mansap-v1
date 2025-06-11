<template>
    <p class="hero-description text-gray-400 dark:text-gray-400 text-xl sm:text-xl md:text-2xl mb-6 sm:mb-8">{{ $t('home.hero_description') }}</p>
</template>

<style scoped>
/* Responsive text scaling for description */
@media (max-width: 640px) {
  .hero-description {
    font-size: 95%;
    margin-bottom: 1.25rem;
  }
}

@media (max-width: 480px) {
  .hero-description {
    font-size: 90%;
    margin-bottom: 1rem;
  }
}
</style>