<script setup lang="ts">
import { useApplyToJob } from "~/composables/jobs/useApplyToJob";

const { jobId } = defineProps<{
  jobId: number;
}>();

const isOpen = ref(false);

const { onSubmit, isApplying } = useApplyToJob(
  jobId,
  () => (isOpen.value = false)
);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="sm:max-w-[60rem]">
      <form id="apply" class="space-y-5" @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>{{ $t("jobs.apply") }}</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <FormField v-slot="{ componentField }" name="coverLetter">
          <FormItem>
            <FormLabel>{{ $t("jobs.cover_letter") }}</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button :disabled="isApplying" type="submit" form="apply">
            {{ $t("jobs.apply") }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
