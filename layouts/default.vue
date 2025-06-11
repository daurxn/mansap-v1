<script setup lang="ts">
import AppHeader from '~/components/app/Header.vue';
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 dark:from-sky-900 dark:via-purple-950 dark:to-pink-900">
        <AppHeader />
        <slot />
    </div>
</template>