<script setup lang="ts">
import { animate, inView, stagger } from "motion";
import { toast } from "vue-sonner";
import EditProfileDialog from "~/components/EditProfileDialog.vue";
import ProjectsList from "~/components/profile/ProjectsList.vue";
import Separator from "~/components/ui/separator/Separator.vue";
import { useToken } from "~/composables/auth/useToken";
import type { Resume } from "~/types/resume";

interface ProfileData {
  name?: string;
  bio?: string;
  age?: number;
  gender?: string;
  locationId?: string | number;
  imageUrl?: string;
  location?: string;
  [key: string]: unknown;
}

const headers = {
  Authorization: `Bearer ${useToken().value}`,
};

const { data: profileData } = useFetch<ProfileData>("/api/profile", {
  headers,
  key: "profile",
});

// Type assertion to help TypeScript understand the structure
const typedProfileData = computed<ProfileData | null>(
  () => profileData.value as ProfileData
);

console.log(profileData.value);

const { data: resumeData } = useFetch<{ data?: Resume; message: string }>(
  "/api/profile/resume",
  {
    headers,
    key: "resume",
  }
);

const profileLength = computed(
  () => Object.keys(profileData.value ?? {}).length
);
const hasResume = computed(() => !!resumeData.value?.data);

// Helper computed properties for type safety
const userName = computed(() => profileData.value?.name || "Your Profile");
const userBio = computed(
  () => profileData.value?.bio || "Add your bio to tell others about yourself"
);
const hasLocation = computed(() => !!profileData.value?.location);
const userLocation = computed(() => profileData.value?.location);
const hasGender = computed(() => !!profileData.value?.gender);
const userGender = computed(() => profileData.value?.gender);
const hasAge = computed(() => !!profileData.value?.age);
const userAge = computed(() => profileData.value?.age);

// Active tab state
const activeTab = ref("profile");

// Profile image upload functionality
const fileInputRef = ref<HTMLInputElement | null>(null);
const { t } = useI18n();

// Animation references
const profileHeader = ref(null);
const imageContainer = ref(null);
const profileInfo = ref(null);
const tabsList = ref(null);
const profileTabContent = ref(null);
const resumeTabContent = ref(null);
const projectsTabContent = ref(null);

// Watch for tab changes to animate new content
watch(activeTab, (newTab, oldTab) => {
  if (newTab === "profile" && profileTabContent.value) {
    animateTabContent(profileTabContent.value);
  } else if (newTab === "resume" && resumeTabContent.value) {
    animateTabContent(resumeTabContent.value);
  } else if (newTab === "projects" && projectsTabContent.value) {
    animateTabContent(projectsTabContent.value);
  }
});

// Function to animate tab content
function animateTabContent(element) {
  // First animate the tab content container
  animate(
    element,
    {
      opacity: [0, 1] as unknown as number,
      y: [20, 0] as unknown as number,
    },
    { duration: 0.5, easing: [0.22, 1, 0.36, 1] }
  );

  // Then find and animate all cards inside this element
  const cards = element.querySelectorAll(".card");
  if (cards.length > 0) {
    animate(
      cards,
      {
        opacity: [0, 1] as unknown as number,
        scale: [0.98, 1] as unknown as number,
      },
      { delay: stagger(0.1), duration: 0.4 }
    );
  }
}

onMounted(() => {
  // Animate profile header with a fade in
  if (profileHeader.value) {
    animate(
      profileHeader.value,
      {
        opacity: [0, 1] as unknown as number,
        y: [20, 0] as unknown as number,
      },
      { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
    );
  }

  // Animate image container with a scale up
  if (imageContainer.value) {
    animate(
      imageContainer.value,
      {
        opacity: [0, 1] as unknown as number,
        scale: [0.8, 1] as unknown as number,
      },
      { duration: 0.7, delay: 0.1 }
    );
  }

  // Animate profile info with staggered effect
  if (profileInfo.value) {
    animate(
      profileInfo.value,
      {
        opacity: [0, 1] as unknown as number,
        x: [-20, 0] as unknown as number,
      },
      { duration: 0.6, delay: 0.2 }
    );

    // Animate badges with stagger
    animate(
      ".profile-badge",
      {
        opacity: [0, 1] as unknown as number,
        scale: [0.8, 1] as unknown as number,
        y: [10, 0] as unknown as number,
      },
      { duration: 0.3, delay: stagger(0.08, { start: 0.4 }) }
    );
  }

  // Animate tabs list
  if (tabsList.value) {
    animate(
      tabsList.value,
      {
        opacity: [0, 1] as unknown as number,
        y: [20, 0] as unknown as number,
      },
      { duration: 0.5, delay: 0.3 }
    );
  }

  // Set up scroll-triggered animations for in-view elements
  setTimeout(() => {
    const cards = document.querySelectorAll(".card");
    if (cards.length > 0) {
      cards.forEach((card) => {
        inView(card, () => {
          animate(
            card,
            {
              opacity: [0, 1] as unknown as number,
              y: [30, 0] as unknown as number,
            },
            { duration: 0.7, easing: [0.17, 0.55, 0.55, 1] }
          );

          // Stop observing after animation
          return () => {};
        });
      });
    }
  }, 100);
});

function openImageUpload() {
  fileInputRef.value?.click();
}

async function handleImageUpload(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (!fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];

  // Validate that the file is an image
  if (!file.type.startsWith("image/")) {
    toast.error(t("profile.invalid_image"));
    return;
  }

  try {
    // Create a FormData instance to send the file
    const formData = new FormData();
    formData.append("file", file);

    // Create a temporary URL for preview while uploading
    const tempPreviewUrl = URL.createObjectURL(file);

    // Send the file to the server
    interface UploadResponse {
      imageUrl: string;
      message?: string;
    }

    const response = await $fetch<UploadResponse>("/api/profile/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${useToken().value}`,
      },
      body: formData,
    });

    // Now update the profile with the permanent URL returned from the server
    if (response && response.imageUrl) {
      await $fetch("/api/profile", {
        method: "PATCH",
        headers,
        body: { imageUrl: response.imageUrl },
      });

      // Force a refresh of the profile data
      await refreshNuxtData("profile");

      // Release the blob URL to free memory
      URL.revokeObjectURL(tempPreviewUrl);

      toast.success(t("profile.image_updated"));
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error(t("profile.upload_error"));
  }
}
</script>

<template>
  <app-main>
    <app-container class="p-4 sm:py-6 md:py-8 profile-container">
      <!-- Profile Header Section -->
      <div
        ref="profileHeader"
        class="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div ref="imageContainer" class="relative">
          <div
            class="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-muted flex items-center justify-center"
          >
            <NuxtImg
              :src="typedProfileData?.imageUrl || '/3135715.png'"
              class="object-cover w-full h-full"
              alt="Profile"
            />
          </div>
          <div
            class="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
            @click="openImageUpload"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-pencil"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </div>
          <div class="flex justify-center gap-2 mt-2">
            <Button
              size="sm"
              variant="secondary"
              class="text-xs sm:text-sm"
              @click="openImageUpload"
            >
              {{ $t("profile.change_photo") }}
            </Button>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
        </div>

        <div ref="profileInfo" class="flex-1">
          <h1 class="text-2xl sm:text-2xl md:text-3xl font-bold profile-name">
            {{ userName }}
          </h1>
          <p
            class="text-muted-foreground mt-1 text-sm sm:text-base profile-bio"
          >
            {{ userBio }}
          </p>

          <div class="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
            <Badge
              v-if="hasLocation"
              variant="outline"
              class="text-xs profile-badge"
            >
              <svg
                class="mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {{ userLocation }}
            </Badge>

            <Badge
              v-if="hasGender"
              variant="outline"
              class="text-xs profile-badge"
            >
              {{ userGender }}
            </Badge>

            <Badge
              v-if="hasAge"
              variant="outline"
              class="text-xs profile-badge"
            >
              {{ userAge }} {{ $t("profile.years") }}
            </Badge>
          </div>
        </div>

        <EditProfileDialog>
          <Button variant="outline" class="gap-2 text-xs sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            {{ $t("profile.edit") }}
          </Button>
        </EditProfileDialog>
      </div>

      <!-- Tabs Navigation -->
      <Tabs
        v-model="activeTab"
        default-value="profile"
        class="w-full profile-tabs"
      >
        <TabsList ref="tabsList" class="grid w-full grid-cols-3">
          <TabsTrigger value="profile" class="text-xs sm:text-sm">{{
            $t("profile.profile_information")
          }}</TabsTrigger>
          <TabsTrigger value="resume" class="text-xs sm:text-sm">{{
            $t("profile.resume_skills")
          }}</TabsTrigger>
          <TabsTrigger value="projects" class="text-xs sm:text-sm">{{
            $t("profile.projects")
          }}</TabsTrigger>
        </TabsList>

        <!-- Profile Tab Content -->
        <TabsContent
          ref="profileTabContent"
          value="profile"
          class="mt-4 sm:mt-6"
        >
          <Card class="card">
            <CardHeader>
              <CardTitle class="text-lg sm:text-xl">{{
                $t("profile.personal_info")
              }}</CardTitle>
              <CardDescription class="text-xs sm:text-sm">{{
                $t("profile.basic_info")
              }}</CardDescription>
            </CardHeader>

            <CardContent>
              <div class="grid gap-4 sm:gap-6">
                <template v-for="(value, key, idx) in profileData" :key="key">
                  <div
                    v-if="value"
                    class="flex flex-col md:flex-row md:items-center gap-1 sm:gap-2 md:gap-4 profile-item"
                  >
                    <div class="md:w-1/4">
                      <h4 class="text-xs sm:text-sm font-medium">
                        {{ $t(`profile.${key}`) }}
                      </h4>
                    </div>
                    <div class="md:w-3/4">
                      <p class="text-xs sm:text-sm">
                        {{
                          value === "female" || value === "male"
                            ? $t(`profile.${value}`)
                            : value
                        }}
                      </p>
                    </div>
                  </div>
                  <Separator v-if="idx < profileLength - 1 && value" />
                </template>

                <div
                  v-if="!profileLength || profileLength === 0"
                  class="py-6 sm:py-8 text-center"
                >
                  <div
                    class="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center mb-2 sm:mb-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <h3 class="text-base sm:text-lg font-medium">
                    No profile information yet
                  </h3>
                  <p
                    class="text-muted-foreground text-xs sm:text-sm mt-1 mb-3 sm:mb-4"
                  >
                    Complete your profile to help others know you better
                  </p>
                  <EditProfileDialog>
                    <Button class="text-xs sm:text-sm"
                      >Complete Your Profile</Button
                    >
                  </EditProfileDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Resume Tab Content -->
        <TabsContent ref="resumeTabContent" value="resume" class="mt-4 sm:mt-6">
          <Card class="card">
            <CardHeader class="flex flex-row items-center justify-between">
              <div>
                <CardTitle class="text-lg sm:text-xl">{{
                  $t("profile.resume_experience")
                }}</CardTitle>
                <CardDescription class="text-xs sm:text-sm">{{
                  $t("profile.work_education")
                }}</CardDescription>
              </div>

              <div v-if="hasResume">
                <Button
                  variant="outline"
                  size="sm"
                  class="gap-2 text-xs sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                    />
                    <path d="m15 5 4 4" />
                  </svg>
                  {{ $t("profile.edit_resume") }}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div v-if="hasResume" class="space-y-4 sm:space-y-6">
                <div class="resume-section">
                  <h3 class="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                    {{ $t(`jobs.exp_level`) }}
                  </h3>
                  <div class="bg-muted/50 rounded-lg p-3 sm:p-4">
                    <p class="whitespace-pre-line text-xs sm:text-sm">
                      {{ resumeData?.data?.workExperience }}
                    </p>
                  </div>
                </div>

                <Separator />

                <div class="resume-section">
                  <h3 class="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                    {{ $t(`jobs.education`) }}
                  </h3>
                  <div class="bg-muted/50 rounded-lg p-3 sm:p-4">
                    <p class="whitespace-pre-line text-xs sm:text-sm">
                      {{ resumeData?.data?.education }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-else class="py-6 sm:py-8 text-center">
                <div
                  class="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium">
                  {{ $t("profile.no_resume") }}
                </h3>
                <p class="text-muted-foreground mt-1 mb-4">
                  {{ $t("profile.add_resume") }}
                </p>
                <ProfileCreateEditResumeDialog>
                  <Button>{{ $t("profile.create_resume") }}</Button>
                </ProfileCreateEditResumeDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Projects Tab Content -->
        <TabsContent
          ref="projectsTabContent"
          value="projects"
          class="mt-4 sm:mt-6"
        >
          <ProjectsList />
        </TabsContent>
      </Tabs>
    </app-container>
  </app-main>
</template>

<style scoped>
/* Responsive profile page styles */
@media (max-width: 640px) {
  .profile-container {
    font-size: 90%;
  }

  .profile-name {
    font-size: 95%;
  }

  .profile-bio {
    font-size: 95%;
  }

  .profile-badge {
    font-size: 90%;
  }

  :deep(.tabs-header) {
    font-size: 90%;
  }
}

@media (max-width: 480px) {
  .profile-container {
    font-size: 85%;
  }

  .profile-name {
    font-size: 90%;
  }

  .profile-bio {
    font-size: 90%;
  }

  .profile-badge {
    font-size: 85%;
  }

  :deep(.tabs-header) {
    font-size: 85%;
  }
}

/* Animation styles */
.profile-badge {
  will-change: transform, opacity;
}

.card {
  will-change: transform, opacity;
}

.resume-section {
  transform-origin: top left;
  will-change: transform, opacity;
}

.profile-item {
  will-change: transform, opacity;
}
</style>
