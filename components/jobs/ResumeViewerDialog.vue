<script setup lang="ts">
import type { Resume } from "~/types/resume";

const { resume } = defineProps<{
  resume: Resume;
}>();
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Resume #{{ resume.id }} Viewer</DialogTitle>
        <DialogDescription />
      </DialogHeader>

      <div>
        <b class="font-semibold">{{ $t("jobs.exp_level") }}</b>
        <p class="text-sm mb-4">{{ resume.workExperience }}</p>

        <b class="font-semibold">{{ $t("jobs.education") }}</b>
        <p class="text-sm">{{ resume.education }}</p>
      </div>
    </DialogContent>
  </Dialog>
</template>
