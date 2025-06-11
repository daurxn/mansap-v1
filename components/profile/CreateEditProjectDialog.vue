<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child @click="isOpen = true">
      <slot />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? $t("profile.edit_project") : $t("profile.add_project") }}</DialogTitle>
        <DialogDescription>
          {{ $t("profile.project_description") }}
        </DialogDescription>
      </DialogHeader>
      <form class="space-y-4" @submit="onSubmit">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="title">{{ $t("profile.project_title") }}</Label>
            <Input 
              id="title" 
              v-model="form.title" 
              :placeholder="$t('profile.project_title_placeholder')" 
              :class="{ 'border-destructive': errors.title }"
            />
            <p v-if="errors.title" class="text-destructive text-sm">{{ errors.title }}</p>
          </div>
          
          <div class="space-y-2">
            <Label for="description">{{ $t("profile.project_description_label") }}</Label>
            <Textarea 
              id="description" 
              v-model="form.description" 
              :placeholder="$t('profile.project_description_placeholder')" 
              :class="{ 'border-destructive': errors.description }"
              rows="4"
            />
            <p v-if="errors.description" class="text-destructive text-sm">{{ errors.description }}</p>
          </div>
          
          <div class="space-y-2">
            <Label for="projectUrl">{{ $t("profile.project_url") }}</Label>
            <Input 
              id="projectUrl" 
              v-model="form.projectUrl" 
              :placeholder="$t('profile.project_url_placeholder')" 
            />
          </div>
          
          <div class="space-y-2">
            <Label for="imageUrl">{{ $t("profile.project_image") }}</Label>
            <div class="flex items-center gap-2">
              <Input 
                id="imageUrl" 
                v-model="form.imageUrl" 
                :placeholder="$t('profile.project_image_placeholder')" 
                class="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                @click="openFileUpload"
              >
                {{ $t("profile.upload") }}
              </Button>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleFileUpload"
              >
            </div>
            <div v-if="form.imageUrl" class="mt-2">
              <img :src="form.imageUrl" alt="Project preview" class="h-24 w-auto rounded-md object-cover">
            </div>
          </div>
          
          <!-- Project Video Field -->
          <div class="space-y-2">
            <Label for="videoUrl">{{ $t("profile.project_video") || 'Project Video' }}</Label>
            <div class="flex items-center gap-2">
              <Input 
                id="videoUrl" 
                v-model="form.videoUrl" 
                :placeholder="$t('profile.project_video_placeholder') || 'Add a video showcasing your project'" 
                class="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                @click="openVideoUpload"
              >
                {{ $t("profile.upload") || 'Upload' }}
              </Button>
              <input 
                ref="videoInput"
                type="file" 
                accept="video/mp4,video/webm,video/ogg" 
                class="hidden" 
                @change="handleVideoUpload"
              >
            </div>
            <div v-if="form.videoUrl" class="mt-2 flex items-center gap-2">
              <div class="text-sm text-muted-foreground">
                <span class="font-medium">{{ $t("profile.video_uploaded") || 'Video uploaded' }}</span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                @click="previewVideo"
              >
                {{ $t("profile.preview") || 'Preview' }}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" :disabled="isSubmitting">

            {{ isSubmitting ? $t("common.saving") : (isEditing ? $t("common.update") : $t("common.create")) }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  
  <!-- Video Preview Modal -->
  <Dialog :open="isVideoModalOpen" @update:open="isVideoModalOpen = false">
    <DialogContent class="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{{ $t("profile.project_video_preview") || 'Video Preview' }}</DialogTitle>
      </DialogHeader>
      
      <div class="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <video 
          v-if="form.videoUrl" 
          controls 
          class="h-full w-full" 
          :src="form.videoUrl"
        >
          {{ $t("profile.video_not_supported") || 'Your browser does not support the video tag.' }}
        </video>
      </div>
      
      <DialogFooter>
        <Button @click="isVideoModalOpen = false">{{ $t("common.close") || 'Close' }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { toast } from 'vue-sonner';
import { useToken } from '~/composables/auth/useToken';

// UI Components
import Dialog from '~/components/ui/dialog/Dialog.vue';
import DialogContent from '~/components/ui/dialog/DialogContent.vue';
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue';
import DialogFooter from '~/components/ui/dialog/DialogFooter.vue';
import DialogHeader from '~/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue';
import DialogTrigger from '~/components/ui/dialog/DialogTrigger.vue';
import Button from '~/components/ui/button/Button.vue';
import Input from '~/components/ui/input/Input.vue';
import Label from '~/components/ui/label/Label.vue';
import Textarea from '~/components/ui/textarea/Textarea.vue';

// Define Project type if not imported
interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  projectUrl?: string;
  createdAt: string;
  updatedAt: string;
}


const props = defineProps<{
  project?: Project;
}>();

const emit = defineEmits(['created', 'updated']);
const isOpen = ref(false);

const isEditing = computed(() => !!props.project);
const fileInput = ref<HTMLInputElement | null>(null);
const videoInput = ref<HTMLInputElement | null>(null);
const isSubmitting = ref(false);

// Video preview modal state
const isVideoModalOpen = ref(false);

// Form state
const form = reactive({
  title: props.project?.title || '',
  description: props.project?.description || '',
  projectUrl: props.project?.projectUrl || '',
  imageUrl: props.project?.imageUrl || '',
  videoUrl: props.project?.videoUrl || '',
});

// Form errors
const errors = reactive({
  title: '',
  description: '',
});

// Validate form
const validateForm = () => {
  let isValid = true;
  errors.title = '';
  errors.description = '';

  if (!form.title.trim()) {
    errors.title = 'Title is required';
    isValid = false;
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required';
    isValid = false;
  }

  return isValid;
};

// Open file upload dialog
const openFileUpload = () => {
  fileInput.value?.click();
};

// Open video upload dialog
const openVideoUpload = () => {
  videoInput.value?.click();
};

// Preview video
const previewVideo = () => {
  isVideoModalOpen.value = true;
};

// Handle file upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await $fetch<{ imageUrl: string }>('/api/upload/chat-image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${useToken().value}`,
      },
    });

    if (response && response.imageUrl) {
      form.imageUrl = response.imageUrl;
    }
  } catch (error) {
    toast.error('Failed to upload image');
    console.error('Upload error:', error);
  }
};

// Handle video upload
const handleVideoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  
  // Validate file type
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  if (!validTypes.includes(file.type)) {
    toast.error('Invalid video format. Please use MP4, WebM, or OGG format.');
    return;
  }
  
  // Validate file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    toast.error('Video file is too large. Maximum size is 100MB.');
    return;
  }
  
  // Show loading toast
  const loadingToast = toast.loading('Uploading video...');
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // If editing, upload to the project's endpoint
    if (isEditing.value && props.project) {
      const response = await $fetch<{ videoUrl: string }>(`/api/profile/projects/${props.project.id}/upload-video`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${useToken().value}`,
        },
      });
      
      if (response && response.videoUrl) {
        form.videoUrl = response.videoUrl;
        toast.success('Video uploaded successfully');
      }
    } else {
      // For new projects, we'll need to store the file temporarily and use it when creating the project
      // This depends on your backend implementation
      // For now, we can use a generic upload endpoint and update the form
      const response = await $fetch<{ videoUrl: string }>('/api/upload/video', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${useToken().value}`,
        },
      });
      
      if (response && response.videoUrl) {
        form.videoUrl = response.videoUrl;
        toast.success('Video uploaded successfully');
      }
    }
  } catch (error) {
    toast.error('Failed to upload video');
    console.error('Video upload error:', error);
  } finally {
    toast.dismiss(loadingToast);
  }
};

// Form submission
const onSubmit = async (event: Event) => {
  event.preventDefault();
  
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  
  try {
    if (isEditing.value && props.project) {
      // Update existing project
      await $fetch(`/api/profile/projects/${props.project.id}`, {
        method: 'PATCH',
        body: form,
        headers: {
          Authorization: `Bearer ${useToken().value}`,
        },
      });
      toast.success("Project updated successfully");
    } else {
      // Create new project
      await $fetch('/api/profile/projects', {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `Bearer ${useToken().value}`,
        },
      });
      toast.success("Project created successfully");
    }
    
    // Refresh projects data
    await refreshNuxtData('projects');
    
    // Emit event to parent component
    if (isEditing.value && props.project) {
      emit('updated', { ...props.project, ...form });
    } else {
      emit('created', form);
    }
    
    // Close dialog
    isOpen.value = false;
  } catch (error) {
    toast.error(isEditing.value ? "Failed to update project" : "Failed to create project");
    console.error("Submission error:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
