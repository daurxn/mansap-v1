<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { animate, stagger, inView } from "motion";
import Hero from "~/components/home/Hero.vue";
import Jobs from "~/components/home/Jobs.vue";
import JobSearch from "~/components/home/JobSearch.vue";

definePageMeta({
  layout: "custom",
});

interface UserProfile {
  id: number;
  userId: number;
  name: string;
  age?: number;
  bio?: string;
  gender?: string;
  location?: string;
  imageUrl?: string;
}

const { t } = useI18n();

// Animation references
const sectionTitle = ref(null);
const profilesContainer = ref(null);
const heroContent = ref(null);

// Fetch profiles directly with useFetch
const {
  data: profilesData,
  pending,
  error: fetchError,
} = await useFetch("/api/profile/all");

// Computed properties based on fetch results
const profiles = computed(() => (profilesData.value as UserProfile[]) || []);
const isLoading = computed(() => pending.value);
const error = computed(() =>
  fetchError.value ? t("errors.failedToLoadProfiles") : null
);

// Setup animations when component is mounted
onMounted(() => {
  // Animate hero content
  if (heroContent.value) {
    animate(
      heroContent.value,
      { opacity: [0, 1], y: [50, 0] },
      { duration: 0.8, easing: [0.17, 0.55, 0.55, 1] }
    );
  }

  // Animate section title with a fade and slide up
  if (sectionTitle.value) {
    inView(sectionTitle.value, () => {
      animate(
        sectionTitle.value,
        { opacity: [0, 1], y: [30, 0] },
        { delay: 0.2, duration: 0.6 }
      );
    });
  }

  // Animate profile cards with staggered entrance
  if (profilesContainer.value) {
    inView(profilesContainer.value, () => {
      animate(
        '.profile-card',
        { opacity: [0, 1], y: [50, 0], scale: [0.9, 1] },
        { 
          delay: stagger(0.08),
          duration: 0.5,
          easing: [0.22, 1, 0.36, 1]
        }
      );
    });
  }
});
</script>

<template>
  <div>
    <div class="background-hero">
      <AppHeader />
      <app-main>
        <EditProfileDialog />
        <div ref="heroContent">
          <Hero />
        </div>
      </app-main>
    </div>

    <!-- Users Grid Section -->
    <div class="users-section container mx-auto">
      <h2
        ref="sectionTitle"
        class="section-title text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8 text-center"
      >
        {{ t("freelancers.title") }}
      </h2>

      <div v-if="isLoading" class="flex justify-center items-center h-32">
        <div
          class="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"
        />
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-4">
        {{ error }}
      </div>

      <div
        v-else
        ref="profilesContainer"
        class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
      >
        <div
          v-for="profile in profiles"
          :key="profile.id"
          class="profile-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div class="image-container bg-gray-200 relative">
            <NuxtImg
              v-if="profile.imageUrl"
              :src="profile.imageUrl"
              alt="Profile image"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-300"
            >
              <span
                class="profile-initial text-3xl sm:text-4xl text-gray-500 font-bold"
              >
                {{ profile.name.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <div class="profile-card-content p-3 sm:p-4">
            <h3 class="font-semibold text-base sm:text-lg mb-1 line-clamp-1">
              {{ profile.name }}
            </h3>
            <p
              v-if="profile.location"
              class="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1"
            >
              <span class="inline-block mr-1">📍</span> {{ profile.location }}
            </p>
            <p
              v-if="profile.bio"
              class="text-gray-700 text-xs sm:text-sm line-clamp-2"
            >
              {{ profile.bio }}
            </p>
            <NuxtLink
              :to="`/users/${profile.userId}`"
              class="mt-2 sm:mt-3 block w-full text-center py-1.5 sm:py-2 px-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-md transition-all"
            >
              {{ t("freelancers.viewProfile") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background-hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("/bg.jpg");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  height: auto;
  margin-bottom: 1rem;
}

/* Make animation smoother */
.profile-card {
  opacity: 0; /* Start invisible for animation */
  will-change: transform, opacity;
}

/* Profile card hover animation */
.profile-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Button animation on hover */
.profile-card:hover .profile-card-content a {
  transform: translateY(-2px);
  background-color: #3b82f6; /* Tailwind blue-500 hardcoded value */
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .background-hero {
    min-height: 90vh;
  }

  /* Percentage-based font scaling */
  .section-title {
    font-size: 95%;
  }

  :deep(.app-header) {
    font-size: 90%;
  }

  .profile-card-content {
    font-size: 90%;
  }
}

@media (max-width: 480px) {
  /* Smaller percentage for very small screens */
  .section-title {
    font-size: 90%;
  }

  :deep(.app-header) {
    font-size: 85%;
  }

  .profile-card-content {
    font-size: 85%;
  }

  .profile-initial {
    font-size: 85%;
  }
}

/* Add responsive spacing */
.users-section {
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
}

/* Better image container */
.image-container {
  aspect-ratio: 16/10;
  overflow: hidden;
}

@media (max-width: 480px) {
  .profile-card-content {
    padding: 0.75rem;
  }
}
</style>
