<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Separator from "~/components/ui/separator/Separator.vue";

interface UserProfile {
  id: number;
  userId: number;
  name: string;
  bio?: string;
  age?: number;
  gender?: string;
  location?: string;
  imageUrl?: string;
  videoUrl?: string;
  [key: string]: unknown;
}

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Resume {
  id: number;
  userId: number;
  workExperience: string;
  education: string;
  createdAt: string;
  updatedAt: string;
}

const route = useRoute();
const userId = computed(() => parseInt(route.params.id as string));
const { t } = useI18n();
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const activeTab = ref("profile");

// Video player states
const isVideoModalOpen = ref(false);
const isProjectVideoModalOpen = ref(false);
const currentProjectVideo = ref<string | null>(null);

// Function to open/close video modal
function openVideoModal() {
  isVideoModalOpen.value = true;
}

function closeVideoModal() {
  isVideoModalOpen.value = false;
}

// Function to open project video modal
function openProjectVideoModal(videoUrl: string) {
  currentProjectVideo.value = videoUrl;
  isProjectVideoModalOpen.value = true;
}

// Function to close project video modal
function closeProjectVideoModal() {
  isProjectVideoModalOpen.value = false;
  // Clear the current video after closing to free memory
  setTimeout(() => {
    currentProjectVideo.value = null;
  }, 300);
}

// Data fetching at setup time
const { data: profileData, error: profileError } = await useFetch<UserProfile>(
  () => `/api/users/${userId.value}/profile`
);

// Fetch resume data
const { data: resumeData } = await useFetch<{ data?: Resume; message: string }>(
  () => `/api/users/${userId.value}/resume`,
  {
    // Continue if there's an error and just show empty resume section
    ignoreResponseError: true,
  }
);

// Fetch projects data
const { data: projectsData } = await useFetch<{
  data?: Project[];
  message: string;
}>(() => `/api/users/${userId.value}/projects`, {
  // Continue if there's an error and just show empty projects section
  ignoreResponseError: true,
});

// Set error from fetch if any
if (profileError.value) {
  error.value = t("errors.failedToLoadProfile");
  console.error("Failed to load profile:", profileError.value);
}

// Mark as not loading
isLoading.value = false;

// Helper computed properties
const profile = computed(() => profileData.value);
const userName = computed(() => profile.value?.name || "User Profile");
const userBio = computed(() => profile.value?.bio || "No bio available");
const hasLocation = computed(() => !!profile.value?.location);
const userLocation = computed(() => profile.value?.location);
const hasGender = computed(() => !!profile.value?.gender);
const userGender = computed(() => profile.value?.gender);
const hasAge = computed(() => !!profile.value?.age);
const userAge = computed(() => profile.value?.age);
const profileLength = computed(() => Object.keys(profile.value || {}).length);
const hasResume = computed(() => !!resumeData.value?.data);
const hasProjects = computed(
  () => !!projectsData.value?.data && projectsData.value.data.length > 0
);
const hasProfileVideo = computed(() => !!profile.value?.videoUrl);

</script>

<template>
  <div>
    <app-main>
      <app-container class="py-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center text-red-500 py-4">
          {{ error }}
        </div>

        <!-- Profile Content -->
        <template v-else-if="profile">
          <!-- Profile Header Section -->
          <div
            class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8"
          >
            <div class="relative">
              <div
                class="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-muted flex items-center justify-center"
              >
                <NuxtImg
                  :src="profile.value?.imageUrl || '/3135715.png'"
                  class="object-cover w-full h-full"
                  alt="Profile picture"
                />
              </div>
            </div>

            <div class="flex-1">
              <h1 class="text-3xl font-bold">{{ userName }}</h1>
              <p class="text-muted-foreground mt-1">{{ userBio }}</p>

              <div class="flex items-center gap-2 mt-3">
                <Badge v-if="hasLocation" variant="outline" class="text-xs">
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

                <Badge v-if="hasGender" variant="outline" class="text-xs">
                  {{ $t("profile." + userGender?.toLowerCase()) }}
                </Badge>

                <Badge v-if="hasAge" variant="outline" class="text-xs">
                  {{ userAge }} {{ $t("profile.years") }}
                </Badge>

                <Button
                  v-if="hasProfileVideo"
                  size="sm"
                  variant="outline"
                  class="gap-1 text-xs"
                  @click="openVideoModal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m10 9 5 3-5 3z" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  {{ $t("profile.view_video") || "View Video" }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <Tabs v-model="activeTab" default-value="profile" class="w-full">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="profile">{{
                $t("profile.profile_information")
              }}</TabsTrigger>
              <TabsTrigger value="resume">{{
                $t("profile.resume_skills")
              }}</TabsTrigger>
              <TabsTrigger value="projects">{{
                $t("profile.projects")
              }}</TabsTrigger>
            </TabsList>

            <!-- Profile Tab Content -->
            <TabsContent value="profile" class="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ $t("profile.personal_info") }}</CardTitle>
                  <CardDescription>{{
                    $t("profile.basic_info")
                  }}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div class="grid gap-6">
                    <template
                      v-for="(value, key, idx) in profile.value"
                      :key="key"
                    >
                      <div
                        v-if="
                          value &&
                          key !== 'imageUrl' &&
                          key !== 'id' &&
                          key !== 'userId'
                        "
                        class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
                      >
                        <div class="md:w-1/4">
                          <h4 class="text-sm font-medium">
                            {{ $t(`profile.${key}`) }}
                          </h4>
                        </div>
                        <div class="md:w-3/4">
                          <p class="text-sm">
                            {{
                              value === "female" || value === "male"
                                ? $t(`profile.${value}`)
                                : value
                            }}
                          </p>
                        </div>
                      </div>
                      <Separator
                        v-if="
                          idx < profileLength - 1 &&
                          value &&
                          key !== 'imageUrl' &&
                          key !== 'id' &&
                          key !== 'userId'
                        "
                      />
                    </template>

                    <div
                      v-if="!profileLength || profileLength <= 2"
                      class="py-8 text-center"
                    >
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
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                      </div>
                      <h3 class="text-lg font-medium">
                        No profile information available
                      </h3>
                      <p class="text-muted-foreground mt-1 mb-4">
                        This user hasn't completed their profile yet
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Resume Tab Content -->
            <TabsContent value="resume" class="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ $t("profile.resume_experience") }}</CardTitle>
                  <CardDescription>{{
                    $t("profile.work_education")
                  }}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div v-if="hasResume" class="space-y-6">
                    <div>
                      <h3 class="text-base font-medium mb-2">
                        {{ $t(`jobs.exp_level`) }}
                      </h3>
                      <div class="bg-muted/50 rounded-lg p-4">
                        <p class="whitespace-pre-line">
                          {{ resumeData.value?.data?.workExperience }}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 class="text-base font-medium mb-2">
                        {{ $t(`jobs.education`) }}
                      </h3>
                      <div class="bg-muted/50 rounded-lg p-4">
                        <p class="whitespace-pre-line">
                          {{ resumeData.value?.data?.education }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div v-else class="py-8 text-center">
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
                      {{ $t("profile.no_resume_available") }}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Projects Tab Content -->
            <TabsContent value="projects" class="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ $t("profile.projects") }}</CardTitle>
                  <CardDescription>{{
                    $t("profile.portfolio")
                  }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <!-- Projects list if available -->
                  <div
                    v-if="hasProjects"
                    class="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div
                      v-for="project in projectsData.value?.data"
                      :key="project.id"
                      class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div v-if="project.imageUrl" class="h-40 overflow-hidden">
                        <NuxtImg
                          :src="project.imageUrl"
                          alt="Project cover"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div class="p-4">
                        <h3 class="font-medium text-lg mb-2">
                          {{ project.title }}
                        </h3>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-3">
                          {{ project.description }}
                        </p>
                        <div class="flex justify-between items-center">
                          <span class="text-xs text-gray-500">
                            {{
                              new Date(project.createdAt).toLocaleDateString()
                            }}
                          </span>
                          <div class="flex gap-2 items-center">
                            <a
                              v-if="project.projectUrl"
                              :href="project.projectUrl"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-blue-600 hover:underline text-sm"
                            >
                              {{ $t("profile.view_project") }}
                            </a>
                            <Button
                              v-if="project.videoUrl"
                              size="sm"
                              variant="outline"
                              class="gap-1 text-xs"
                              @click="openProjectVideoModal(project.videoUrl)"
                            >
                              <svg
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
                                <path d="m10 9 5 3-5 3z" />
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                              {{ $t("profile.view_video") || "View Video" }}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No projects available -->
                  <div v-else class="py-8 text-center">
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
                        <path
                          d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-medium">
                      {{ $t("profile.no_projects") }}
                    </h3>
                    <p class="text-muted-foreground mt-1 mb-4">
                      {{ $t("profile.no_projects_available") }}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </template>

        <!-- No User Found -->
        <div v-else class="text-center py-12">
          <div
            class="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          <h2 class="text-2xl font-bold mb-2">
            {{ $t("profile.user_not_found") }}
          </h2>
          <p class="text-muted-foreground mb-6">
            {{ $t("profile.user_not_found_message") }}
          </p>
          <NuxtLink
            to="/"
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
          >
            {{ $t("common.back_to_home") }}
          </NuxtLink>
        </div>
      </app-container>
    </app-main>

    <!-- Video Modal -->
    <Dialog :open="isVideoModalOpen" @update:open="closeVideoModal">
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{{
            $t("profile.user_video") || "Profile Video"
          }}</DialogTitle>
          <DialogDescription>
            {{
              $t("profile.user_video_description") ||
              userName + '"s profile video'
            }}
          </DialogDescription>
        </DialogHeader>

        <div
          class="relative aspect-video w-full overflow-hidden rounded-lg bg-muted"
        >
          <video
            v-if="hasProfileVideo"
            controls
            class="h-full w-full"
            :src="profile.value?.videoUrl"
          >
            {{
              $t("profile.video_not_supported") ||
              "Your browser does not support the video tag."
            }}
          </video>
        </div>

        <DialogFooter>
          <Button @click="closeVideoModal">{{
            $t("common.close") || "Close"
          }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Project Video Modal -->
    <Dialog
      :open="isProjectVideoModalOpen"
      @update:open="closeProjectVideoModal"
    >
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{{
            $t("profile.project_video") || "Project Video"
          }}</DialogTitle>
          <DialogDescription>
            {{
              $t("profile.project_video_description") ||
              "Video demonstration of this project"
            }}
          </DialogDescription>
        </DialogHeader>

        <div
          class="relative aspect-video w-full overflow-hidden rounded-lg bg-muted"
        >
          <video
            v-if="currentProjectVideo"
            controls
            class="h-full w-full"
            :src="currentProjectVideo"
          >
            {{
              $t("profile.video_not_supported") ||
              "Your browser does not support the video tag."
            }}
          </video>
        </div>

        <DialogFooter>
          <Button @click="closeProjectVideoModal">{{
            $t("common.close") || "Close"
          }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
