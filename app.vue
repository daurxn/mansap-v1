<script setup lang="ts">
import { useAuthStore } from './store/auth.store';
import { Toaster } from './components/ui/sonner';
import { NuxtLoadingIndicator } from '#components';

if (useCookie('token').value) {
  useAuthStore().setProfile()
}
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>
