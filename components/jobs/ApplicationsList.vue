<script setup lang="ts">
import { useToken } from "~/composables/auth/useToken";
import type { JobApplication } from "~/types/application";
import JobsListItem from "../home/JobsListItem.vue";
import { CircleDollarSign } from "lucide-vue-next";

const { data: applications } = await useFetch<JobApplication[]>(
  "/api/jobs/applications",
  {
    headers: {
      Authorization: `Bearer ${useToken().value}`,
    },
  }
);

console.log(applications.value);
</script>

<template>
  <ul class="w-full space-y-4">
    <JobsListItem v-for="app in applications" :key="app.id" :job="app.job">
      <template #footer>
        <div class="flex justify-between w-full">
          <div class="flex gap-2 items-center">
            <div class="flex items-center gap-1">
              <CircleDollarSign color="#5D3FD3" :size="20" />
              ${{ app.job.salary }}/{{ $t(app.job.jobType) }}
            </div>

            <span>&#x2022;</span>

            <Badge variant="secondary">
              {{ app.job._count.applications + " " + $t("applications") }}
            </Badge>
          </div>
        </div>
      </template>
    </JobsListItem>
  </ul>
</template>
