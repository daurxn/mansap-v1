<script setup lang="ts">
import { PopoverClose } from "reka-ui";
import { toast } from "vue-sonner";
import { useToken } from "~/composables/auth/useToken";
import { useAuthStore } from "~/store/auth.store";
import type { Chat } from "~/types/chat";
import type { Job } from "~/types/job";
import JobChat from "~/components/chat/JobChat.vue";

const { userId } = storeToRefs(useAuthStore());
const { id } = useRoute().params;
const token = useToken();

const headers = computed(() => ({
  Authorization: `Bearer ${token.value}`,
}));

const { data: job } = await useFetch<Job>(`/api/jobs/${id}`, {
  headers: headers.value,
  key: `/api/jobs/${id}`,
});

const { data: chat, refresh } = await useAsyncData<Chat | null>(
  `chat-${id}`,
  async () => {
    if (
      job.value &&
      userId.value &&
      job.value.filledById &&
      job.value.postedById &&
      [job.value.filledById, job.value.postedById].includes(userId.value)
    ) {
      const result = await $fetch(`/api/chat/jobs/${id}`, {
        headers: headers.value,
      });
      console.log('Raw chat data from API:', result);
      return result;
    } else {
      return null;
    }
  },
  {
    // Disable caching to ensure fresh data
    server: false,
    immediate: true
  }
);

const isRecruiter = computed(() => userId.value === job.value?.postedById);

async function handleFillJob(applicantId: number) {
  const isSending = ref(false);
  isSending.value = true;
  await $fetch(`/api/jobs/${id}/accept/${applicantId}`, {
    headers: {
      Authorization: `Bearer ${useToken().value}`,
    },
  });
  isSending.value = false;
  await refreshNuxtData(`/api/jobs/${id}`);
  toast.success("Заявка была принята успешно!");
}
</script>

<template>
  <app-main>
    <app-container v-if="job" class="max-w-5xl mx-auto">
      <!-- Header section with job title, tags, and apply button -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 class="text-3xl font-bold mb-2 md:mb-0">{{ job.name }}</h1>
          
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <template v-if="!isRecruiter">
              <JobsApplyDialog v-if="!job.applied" :job-id="job.id">
                <Button size="lg" class="font-medium">{{ $t("jobs.apply") }}</Button>
              </JobsApplyDialog>
              <Button v-else disabled size="lg">
                {{ $t("you_applied") }}
              </Button>
            </template>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge 
            v-for="tag in job.tags" 
            :key="tag.id" 
            variant="outline"
            class="text-sm font-medium"
          >
            {{ tag.name }}
          </Badge>
        </div>
        
        <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div class="flex items-center gap-2">
            <i class="i-lucide-briefcase text-gray-500" />
            <span>{{ $t(job.jobType) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="i-lucide-graduation-cap text-gray-500" />
            <span>{{ $t(`exp_level.${job.experienceLevel}`) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="i-lucide-dollar-sign text-gray-500" />
            <span>${{ job.salary }} / {{ job.unit.toLowerCase() }}</span>
          </div>
          <div v-if="job.location" class="flex items-center gap-2">
            <i class="i-lucide-map-pin text-gray-500" />
            <span>{{ job.location.name }}</span>
          </div>
          <div v-if="job.isRemote" class="flex items-center gap-2">
            <i class="i-lucide-globe text-gray-500" />
            <span>{{ $t("jobs.remote_work") || "Remote Work" }}</span>
          </div>
        </div>
      </div>
      
      <!-- Job details section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Main content -->
        <div class="md:col-span-2">
          <!-- Description -->
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>{{ $t("description") }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="whitespace-pre-line">{{ job.description }}</p>
            </CardContent>
          </Card>
          
          <!-- Requirements -->
          <Card v-if="job.requirements" class="mb-6">
            <CardHeader>
              <CardTitle>{{ $t("jobs.requirements") || "Requirements" }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="whitespace-pre-line">{{ job.requirements }}</p>
            </CardContent>
          </Card>
          
          <!-- Responsibilities -->
          <Card v-if="job.responsibilities" class="mb-6">
            <CardHeader>
              <CardTitle>{{ $t("jobs.responsibilities") || "Responsibilities" }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="whitespace-pre-line">{{ job.responsibilities }}</p>
            </CardContent>
          </Card>
        </div>
        
        <!-- Sidebar -->
        <div>
          <!-- Job info card -->
          <Card class="mb-6">
            <CardHeader>
              <CardTitle>{{ $t("jobs.job_info") || "Job Info" }}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl class="space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t("posted_at") }}</dt>
                  <dd>{{
                    new Intl.DateTimeFormat("ru-RU", {
                      dateStyle: "long",
                    }).format(new Date(job.createdAt))
                  }}</dd>
                </div>
                
                <div v-if="job.applicationDeadline">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t("jobs.application_deadline") || "Application Deadline" }}</dt>
                  <dd>{{
                    new Intl.DateTimeFormat("ru-RU", {
                      dateStyle: "long",
                    }).format(new Date(job.applicationDeadline))
                  }}</dd>
                </div>
                
                <div v-if="job.postedBy">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t("jobs.posted_by") || "Posted By" }}</dt>
                  <dd>{{ job.postedBy.name }}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <!-- Company info card -->
          <Card v-if="job.companyInfo" class="mb-6">
            <CardHeader>
              <CardTitle>{{ $t("jobs.company_info") || "Company Info" }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="whitespace-pre-line">{{ job.companyInfo }}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Applications section for recruiters -->

      <!-- Applications section for recruiters -->
      <Card v-if="isRecruiter" class="mb-8">
        <CardHeader>
          <CardTitle>{{ $t("jobs.applications") || "Applications" }}</CardTitle>
          <CardDescription v-if="job.applications && job.applications.length > 0">
            {{ job.applications.length }} {{ job.applications.length === 1 ? 'applicant' : 'applicants' }} for this position
          </CardDescription>
          <CardDescription v-else>
            {{ $t("jobs.no_applications") || "No applications yet" }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ $t("jobs.name") }}</TableHead>
                <TableHead class="w-[32rem]">
                  {{ $t("jobs.cover_letter") }}
                </TableHead>
                <TableHead>{{ $t("jobs.resume") }}</TableHead>
                <TableHead>{{ $t("jobs.applied_at") }}</TableHead>
                <TableHead>{{ $t("actions") }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="app in job.applications" :key="app.id">
                <TableCell class="font-medium">
                  {{ app.applicant.name }}
                </TableCell>
                <TableCell>
                  {{ app.coverLetter }}
                </TableCell>
                <TableCell>
                  <JobsResumeViewerDialog :resume="app.resume">
                    <Button variant="link"> Resume #{{ app.resumeId }} </Button>
                  </JobsResumeViewerDialog>
                </TableCell>
                <TableCell>
                  {{
                    new Intl.DateTimeFormat("ru-RU", {
                      dateStyle: "long",
                    }).format(new Date(app.appliedAt))
                  }}
                </TableCell>
                <TableCell>
                  <Badge v-if="job.filledById === app.applicantId" variant="secondary">
                    {{ $t("jobs.selected") || "Selected" }}
                  </Badge>

                  <Popover v-if="!job.filledById">
                    <PopoverTrigger as-child>
                      <Button size="sm">{{ $t("select") }}</Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-64">
                      <p class="text-sm mb-2">
                        {{ $t("jobs.you_sure_want_to_select_this") }}
                      </p>
                      <PopoverClose class="flex gap-2 justify-end w-full">
                        <Button size="sm" variant="ghost">{{ $t("no") }}</Button>
                        <Button size="sm" @click="handleFillJob(app.applicantId)">
                          {{ $t("yes") }}
                        </Button>
                      </PopoverClose>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Chat section -->
      <Card v-if="chat" class="mb-6">
        <CardHeader>
          <CardTitle>{{ $t("jobs.chat") || "Chat" }}</CardTitle>
        </CardHeader>
        <CardContent>
          <JobChat :chat="chat" :job-id="Number(id)" @refresh="refresh" />
        </CardContent>
      </Card>
    </app-container>
  </app-main>
</template>
