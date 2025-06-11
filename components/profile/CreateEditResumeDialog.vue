<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import * as z from "zod";
import { useToken } from "~/composables/auth/useToken";

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      workExperience: z.string().min(10).max(2000),
      education: z.string().min(5).max(1000),
    })
  ),
});

const onSubmit = form.handleSubmit(async (values) => {
  await $fetch("/api/profile/resume", {
    method: "POST",
    body: values,
    headers: {
      Authorization: `Bearer ${useToken().value}`,
    },
  });
  toast.success("Resume was created successfully!");
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <form id="resume" class="space-y-5" @submit="onSubmit">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ $t("profile.editing") }}</DialogTitle>
          <DialogDescription>
            {{ $t("profile.make_changes") }}
          </DialogDescription>
        </DialogHeader>

        <FormField v-slot="{ componentField }" name="workExperience">
          <FormItem>
            <FormLabel>{{ $t("jobs.exp_level") }}</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="education">
          <FormItem>
            <FormLabel>{{ $t("jobs.education") }}</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="submit" form="resume">
            {{ $t("create") }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
</template>
