<script setup lang="ts">
import { CircleDollarSign, Trash2 } from "lucide-vue-next";
import { PopoverClose } from "reka-ui";
import { toast } from "vue-sonner";
import { useToken } from "~/composables/auth/useToken";
import type { Job } from "~/types/job";
import JobsListItem from "../home/JobsListItem.vue";
import Button from "../ui/button/Button.vue";

const headers = { Authorization: `Bearer ${useToken().value}` };

const { data } = await useFetch<Job[]>("/api/jobs/mine", {
  headers,
  key: "jobs_mine",
});

console.log(data.value);

const myPostings = computed(() => data.value ?? []);

async function handleDeleteJob(jobId: number) {
  await $fetch(`/api/jobs/${jobId}`, {
    method: "DELETE",
    headers,
  });
  await refreshNuxtData("jobs_mine");
  toast.success("Job has been removed successfully!");
}
</script>

<template>
  <ul class="w-full space-y-4">
    <JobsListItem v-for="job in myPostings" :key="job.id" :job="job">
      <template #footer>
        <div class="flex justify-between w-full">
          <div class="flex gap-2 items-center">
            <div class="flex items-center gap-1">
              <CircleDollarSign color="#5D3FD3" :size="20" />
              ${{ job.salary }}/{{ $t(job.jobType) }}
            </div>

            <span>&#x2022;</span>

            <Badge variant="secondary">
              {{ job._count.applications + " " + $t("applications") }}
            </Badge>
          </div>

          <div class="flex gap-1.5 items-center">
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="destructive">
                  <Trash2 />
                  {{ $t("delete") }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-64">
                <p class="text-sm mb-2">
                  {{ $t("jobs.you_sure_want_to_delete") }}
                </p>
                <PopoverClose class="flex gap-2 justify-end w-full">
                  <Button size="sm" variant="ghost">No</Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    @click="handleDeleteJob(job.id)"
                  >
                    Yes
                  </Button>
                </PopoverClose>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </template>
    </JobsListItem>
  </ul>
</template>
