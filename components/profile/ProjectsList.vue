<template>
  <div class="space-y-3 sm:space-y-4 projects-list">
    <div class="flex items-center justify-between">
      <h3 class="text-base sm:text-lg font-medium projects-title">{{ $t("profile.projects") }}</h3>
      <CreateEditProjectDialog
        @created="handleProjectCreated"
        @updated="handleProjectUpdated"
      >
        <Button size="sm" class="text-xs sm:text-sm">
          <PlusIcon class="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          {{ $t("profile.add_project") }}
        </Button>
      </CreateEditProjectDialog>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-48">
      <p>Loading...</p>
    </div>

    <div v-else-if="!projects.length" class="py-6 sm:py-8 text-center">
      <div class="flex flex-col items-center">
        <FolderIcon class="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-2" />
        <p class="text-sm sm:text-base text-muted-foreground">{{ $t("profile.no_projects") }}</p>
        <CreateEditProjectDialog
          @created="handleProjectCreated"
          @updated="handleProjectUpdated"
        >
          <Button variant="outline" size="sm" class="mt-3 sm:mt-4 text-xs sm:text-sm">
            {{ $t("profile.add_first_project") }}
          </Button>
        </CreateEditProjectDialog>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <Card
        v-for="project in projects"
        :key="project.id"
        class="overflow-hidden flex flex-col project-card"
      >
        <div class="relative h-32 sm:h-36 md:h-40 w-full">
          <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" class="h-48 w-full rounded-t-lg object-cover" loading="lazy" />
          <div
            v-else
            class="h-full w-full bg-muted flex items-center justify-center"
          >
            <FolderIcon class="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
          </div>

          <div class="absolute top-2 right-2 flex space-x-1">
            <CreateEditProjectDialog
              :project="project"
              @created="handleProjectCreated"
              @updated="handleProjectUpdated"
            >
              <Button variant="secondary" size="icon" class="h-7 w-7 sm:h-8 sm:w-8">
                <PencilIcon class="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </CreateEditProjectDialog>

            <Button
              variant="destructive"
              size="icon"
              class="h-7 w-7 sm:h-8 sm:w-8"
              @click="confirmDelete(project)"
            >
              <TrashIcon class="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        <CardContent class="p-3 sm:p-4 flex-grow">
          <h4 class="font-medium text-sm sm:text-base mb-1 project-title">{{ project.title }}</h4>
          <p class="text-xs sm:text-sm text-muted-foreground line-clamp-3 project-desc">
            {{ project.description }}
          </p>
        </CardContent>

        <CardFooter class="p-3 sm:p-4 pt-0 flex justify-between">
          <span class="text-xs text-muted-foreground project-date">
            {{ formatDate(project.createdAt) }}
          </span>
          <Button
            v-if="project.projectUrl"
            variant="link"
            size="sm"
            class="p-0 h-auto text-xs sm:text-sm"
            @click="openProjectUrl(project.projectUrl)"
          >
            <ExternalLinkIcon class="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {{ $t("profile.view_project") }}
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="!!projectToDelete" @update:open="projectToDelete = null">
      <DialogContent class="dialog-content">
        <DialogHeader>
          <DialogTitle class="text-base sm:text-lg">{{ $t("profile.confirm_delete") }}</DialogTitle>
          <DialogDescription class="text-xs sm:text-sm">
            {{ $t("profile.delete_project_confirmation") }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" class="text-xs sm:text-sm" @click="projectToDelete = null">
            {{ $t("common.cancel") }}
          </Button>
          <Button
            variant="destructive"
            class="text-xs sm:text-sm"
            :disabled="isDeleting"
            @click="deleteProject"
          >
            <Loader v-if="isDeleting" class="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            {{ $t("common.delete") }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { toast } from "vue-sonner";
import { useToken } from "~/composables/auth/useToken";
import { formatDate } from "~/utils/date";
import type { Project, ProjectsResponse } from "~/types/project";

// UI Components
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardFooter from "~/components/ui/card/CardFooter.vue";
import Button from "~/components/ui/button/Button.vue";

import Dialog from "~/components/ui/dialog/Dialog.vue";
import DialogContent from "~/components/ui/dialog/DialogContent.vue";
import DialogDescription from "~/components/ui/dialog/DialogDescription.vue";
import DialogFooter from "~/components/ui/dialog/DialogFooter.vue";
import DialogHeader from "~/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "~/components/ui/dialog/DialogTitle.vue";

// Icons
import {
  PlusIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
  ExternalLinkIcon,
} from "lucide-vue-next";

// Components
import CreateEditProjectDialog from "./CreateEditProjectDialog.vue";

const projects = ref<Project[]>([]);
const isLoading = ref(true);
const projectToDelete = ref<Project | null>(null);
const isDeleting = ref(false);

// Fetch projects
const fetchProjects = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch<ProjectsResponse>("/api/profile/projects", {
      headers: {
        Authorization: `Bearer ${useToken().value}`,
      },
    });
    projects.value = response.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    toast.error("Failed to load projects");
  } finally {
    isLoading.value = false;
  }
};

// Open project URL in new tab
const openProjectUrl = (url: string) => {
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }
  window.open(url, "_blank");
};

// Confirm delete
const confirmDelete = (project: Project) => {
  projectToDelete.value = project;
};

// Handle project created event
const handleProjectCreated = (newProject: Project) => {
  // Add the new project to the list
  projects.value = [newProject, ...projects.value];
};

// Handle project updated event
const handleProjectUpdated = (updatedProject: Project) => {
  // Update the project in the list
  const index = projects.value.findIndex((p) => p.id === updatedProject.id);
  if (index !== -1) {
    projects.value[index] = updatedProject;
    // Create a new array to trigger reactivity
    projects.value = [...projects.value];
  }
};

// Delete project
const deleteProject = async () => {
  if (!projectToDelete.value) return;

  isDeleting.value = true;
  try {
    await $fetch(`/api/profile/projects/${projectToDelete.value.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${useToken().value}`,
      },
    });

    toast.success("Project deleted successfully");
    projects.value = projects.value.filter(
      (p) => p.id !== projectToDelete.value?.id
    );
    projectToDelete.value = null;
  } catch (error) {
    console.error("Error deleting project:", error);
    toast.error("Failed to delete project");
  } finally {
    isDeleting.value = false;
  }
};

// Load projects on mount
onMounted(() => {
  fetchProjects();
});

// Provide data for refreshing
defineExpose({
  refresh: fetchProjects,
});

// Make projects data available for parent components
defineModel<Project[]>("projects", {
  default: () => [],
});
</script>

<style scoped>
/* Responsive styles for projects list */
@media (max-width: 640px) {
  .projects-list {
    font-size: 95%;
  }
  
  .projects-title {
    font-size: 95%;
  }
  
  .project-title {
    font-size: 95%;
  }
  
  .project-desc {
    font-size: 95%;
  }
  
  .project-date {
    font-size: 90%;
  }
  
  :deep(.dialog-content) {
    font-size: 95%;
  }
}

@media (max-width: 480px) {
  .projects-list {
    font-size: 90%;
  }
  
  .projects-title {
    font-size: 90%;
  }
  
  .project-title {
    font-size: 90%;
  }
  
  .project-desc {
    font-size: 90%;
  }
  
  .project-date {
    font-size: 85%;
  }
  
  :deep(.dialog-content) {
    font-size: 90%;
  }
}
</style>
