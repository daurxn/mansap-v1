<script setup lang="ts">
import { CircleDollarSign } from "lucide-vue-next";
import type { Job } from "~/types/job";
import JobsListItem from "./JobsListItem.vue";
import Badge from "../ui/badge/Badge.vue";

const { jobs } = defineProps<{
  jobs: Job[];
}>();
</script>

<template>
  <ul class="w-full space-y-4">
    <JobsListItem v-for="job in jobs" :key="job.id" :job="job">
      <template #footer>
        <div class="flex justify-between w-full">
          <div class="flex gap-2 items-center">
            <div class="flex items-center gap-1">
              <CircleDollarSign color="#5D3FD3" :size="20" />
              ${{ job.salary }}/{{ $t(job.jobType) }}
            </div>

            <span>&#x2022;</span>

            <Badge variant="secondary">
              {{ job._count.applications + " " + $t("common.applications") }}
            </Badge>
          </div>

          <template v-if="job.is_applicable">
            <JobsApplyDialog v-if="!job.applied" :job-id="job.id">
              <Button>{{ $t("jobs.apply") }}</Button>
            </JobsApplyDialog>
            <Button v-else disabled>
              {{ $t("you_applied") }}
            </Button>
          </template>
        </div>
      </template>
    </JobsListItem>
  </ul>
</template>
