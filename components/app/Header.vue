<script setup lang="ts">
import { useAuthStore } from "~/store/auth.store";
import LocaleSelect from "../home/LocaleSelect.vue";

const { isAuthenticated, name } = storeToRefs(useAuthStore());
const route = useRoute();
const cookies = useCookie("token");

const isIndexPage = computed(() => route.name === "index");

const linkClass = computed(() => (isIndexPage.value ? "text-white" : ""));
</script>

<template>
  <header class="py-3 sm:py-4 md:py-5 app-header">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <nav
        class="flex mx-auto items-center justify-between text-xs sm:text-sm md:text-sm text-gray-500 dark:text-gray-400 transition-colors header-nav"
      >
        <div class="flex gap-3 sm:gap-6 md:gap-10 items-center">
          <NuxtLink to="/" class="header-logo">
            <span
              class="text-xl sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-300"
              :class="{ 'text-white': isIndexPage }"
            >
              Ms
            </span>
          </NuxtLink>

          <div
            v-if="isAuthenticated"
            class="hidden sm:flex gap-0.5 sm:gap-2 md:gap-6 items-center header-links"
          >
            <NuxtLink to="/find-work" :class="linkClass" class="header-link">
              {{ $t("common.find_work") }}
            </NuxtLink>
            <NuxtLink to="/job-postings" :class="linkClass" class="header-link">
              {{ $t("jobs.my_vacancies") }}
            </NuxtLink>
            <NuxtLink to="/applications" :class="linkClass" class="header-link">
              {{ $t("jobs.my_applications") }}
            </NuxtLink>
          </div>
        </div>

        <div
          class="flex gap-2 sm:gap-3 md:gap-5 items-center"
          :class="{ 'text-white': isIndexPage }"
        >
          <NuxtLink
            v-if="!isAuthenticated"
            to="/auth"
            @click="cookies = null"
            class="hidden sm:block header-auth"
          >
            {{ $t("common.login_signup") }}
          </NuxtLink>
          <Button
            v-if="!isAuthenticated"
            to="/auth"
            variant="ghost"
            size="sm"
            class="sm:hidden header-auth-mobile"
          >
            {{ $t("common.login_signup") }}
          </Button>
          <UserDropdown
            :main="route.name === 'index'"
            v-else
            class="header-user"
          >
            {{ name }}
          </UserDropdown>

          <div class="flex gap-1 header-controls">
            <LocaleSelect />
            <ClientOnly>
              <ColorModeDropdown />
            </ClientOnly>
          </div>
        </div>
      </nav>

      <!-- Mobile Nav (small screens only) -->
      <div
        v-if="isAuthenticated"
        class="sm:hidden flex justify-center mt-3 mobile-nav"
      >
        <div class="flex gap-4 text-xs text-center overflow-x-auto px-2 py-1">
          <NuxtLink
            to="/find-work"
            :class="[linkClass, 'whitespace-nowrap mobile-link']"
          >
            {{ $t("common.find_work") }}
          </NuxtLink>
          <NuxtLink
            to="/job-postings"
            :class="[linkClass, 'whitespace-nowrap mobile-link']"
          >
            {{ $t("jobs.my_vacancies") }}
          </NuxtLink>
          <NuxtLink
            to="/applications"
            :class="[linkClass, 'whitespace-nowrap mobile-link']"
          >
            {{ $t("jobs.my_applications") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Responsive header styles */
@media (max-width: 640px) {
  .app-header {
    font-size: 95%;
  }

  .header-logo {
    font-size: 95%;
  }

  .header-links {
    font-size: 95%;
  }

  .header-auth {
    font-size: 95%;
  }

  .mobile-nav {
    padding: 0.25rem 0;
    border-top: 1px solid rgba(128, 128, 128, 0.1);
  }

  .mobile-link {
    font-size: 95%;
  }
}

@media (max-width: 480px) {
  .app-header {
    font-size: 90%;
  }

  .header-logo {
    font-size: 90%;
  }

  .header-controls {
    gap: 0.25rem;
  }

  .header-auth-mobile {
    font-size: 90%;
    padding: 0.25rem 0.5rem;
  }

  .mobile-link {
    font-size: 90%;
  }
}
</style>
