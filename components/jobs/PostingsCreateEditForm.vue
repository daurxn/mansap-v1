<script setup lang="ts">
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import * as z from "zod";
import { useToken } from "~/composables/auth/useToken";
import type { Job } from "~/types/job";
import SelectLocation from "../form/SelectLocation.vue";

const { job = null } = defineProps<{
  job?: Job;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const ExperienceLevelEnumValues = ["JUNIOR", "MID", "SENIOR"] as const;
const UnitEnumValues = ["HOUR", "DAY", "PROJECT"] as const;
const JobTypeEnumValues = ["FULL_TIME", "PART_TIME", "CONTRACT"] as const;

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: "Job name is required." })
      .min(3, { message: "Job name must be at least 3 characters." })
      .max(100, { message: "Job name cannot be longer than 100 characters." }),
    description: z
      .string({ required_error: "Description is required." })
      .min(10, { message: "Description must be at least 10 characters." })
      .max(5000, {
        message: "Description cannot be longer than 5000 characters.",
      }),
    salary: z.coerce
      .number({
        invalid_type_error: "Salary must be a number.",
        required_error: "Salary is required.",
      })
      .positive({ message: "Salary must be a positive number." })
      .multipleOf(0.01, {
        message: "Salary can have up to two decimal places.",
      }),
    unit: z.enum(UnitEnumValues, {
      required_error: "Salary unit is required.",
    }),
    experienceLevel: z.enum(ExperienceLevelEnumValues, {
      required_error: "Experience level is required.",
    }),
    jobType: z.enum(JobTypeEnumValues, {
      required_error: "Job type is required.",
    }),
    locationId: z.coerce
      .number()
      .int({ message: "Location ID must be an integer." })
      .positive({ message: "Location ID must be a positive number." })
      .optional(),
    tags: z
      .array(
        z
          .string()
          .min(2, { message: "Each tag must be at least 2 characters." })
          .max(50, { message: "Each tag cannot be longer than 50 characters." })
      )
      .min(1, {
        message: "If tags are provided, there must be at least one tag.",
      })
      .optional(),
  })
);

const form = useForm({
  keepValuesOnUnmount: true,
  validationSchema: formSchema,
});

const isSubmitting = ref(false);
const isEditMode = computed(() => job !== null);

if (job) {
  form.setFieldValue("name", job.name);
  form.setFieldValue("description", job.description);
  form.setFieldValue("salary", job.salary);
  form.setFieldValue("unit", job.unit);
  form.setFieldValue("experienceLevel", job.experienceLevel);
  form.setFieldValue("jobType", job.jobType);
  form.setFieldValue("locationId", job.locationId);

  form.setFieldValue(
    "tags",
    job.tags.map((tag) => tag.name)
  );
}

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true;
  const headers = {
    Authorization: `Bearer ${useToken().value}`,
  };

  try {
    if (isEditMode.value && job) {
      await $fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        body: values,
        headers,
      });

      toast.success("Job post was updated!");
    } else {
      await $fetch("/api/jobs", {
        method: "POST",
        body: values,
        headers,
      });

      await refreshNuxtData("jobs_mine");
      toast.success("Job post was created successfully!");
      form.resetForm();
    }

    emit("close");
  } catch (error) {
    console.error("Failed to save job posting:", error);
    toast.error("Failed to save job posting. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <form id="newJob" @submit="onSubmit">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t("jobs.posting_job") }}</DialogTitle>
        <DialogDescription />
      </DialogHeader>

      <div class="max-h-[65vh] overflow-y-auto">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem class="mb-4">
            <FormLabel>{{ $t("jobs.name") }}</FormLabel>

            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem class="mb-4">
            <FormLabel>
              {{ $t("description") }}
            </FormLabel>

            <FormControl>
              <Textarea rows="4" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="requirements">
          <FormItem class="mb-4">
            <FormLabel>
              {{ $t("jobs.requirements") || "Requirements" }}
            </FormLabel>

            <FormControl>
              <Textarea rows="3" v-bind="componentField" placeholder="List job requirements here..." />
            </FormControl>
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="responsibilities">
          <FormItem class="mb-4">
            <FormLabel>
              {{ $t("jobs.responsibilities") || "Responsibilities" }}
            </FormLabel>

            <FormControl>
              <Textarea rows="3" v-bind="componentField" placeholder="List job responsibilities here..." />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ componentField }"
          name="experienceLevel"
          type="radio"
        >
          <FormItem class="mb-4 flex gap-4">
            <FormLabel>{{ $t("jobs.exp_level") }}</FormLabel>

            <FormControl>
              <RadioGroup v-bind="componentField" class="flex">
                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="JUNIOR" />
                  </FormControl>

                  <FormLabel> Junior </FormLabel>
                </FormItem>

                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="MID" />
                  </FormControl>

                  <FormLabel>Middle</FormLabel>
                </FormItem>

                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="SENIOR" />
                  </FormControl>

                  <FormLabel>Senior</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="salary">
          <FormItem class="mb-4">
            <FormLabel> {{ $t("salary") }} ($) </FormLabel>

            <FormControl>
              <Input type="number" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="unit" type="radio">
          <FormItem class="mb-4 flex gap-4">
            <FormLabel>Unit</FormLabel>

            <FormControl>
              <RadioGroup v-bind="componentField" class="flex">
                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="HOUR" />
                  </FormControl>

                  <FormLabel> Hour </FormLabel>
                </FormItem>

                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="DAY" />
                  </FormControl>

                  <FormLabel>Day</FormLabel>
                </FormItem>

                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="PROJECT" />
                  </FormControl>

                  <FormLabel>Project</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="jobType" type="radio">
          <FormItem class="mb-4 flex gap-4">
            <FormLabel>{{ $t("jobs.job_type") }}</FormLabel>

            <FormControl>
              <RadioGroup v-bind="componentField" class="flex">
                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="FULL_TIME" />
                  </FormControl>

                  <FormLabel>Full time</FormLabel>
                </FormItem>

                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="PART_TIME" />
                  </FormControl>

                  <FormLabel>Part time</FormLabel>
                </FormItem>

                <FormItem class="flex items-center">
                  <FormControl>
                    <RadioGroupItem value="CONTRACT" />
                  </FormControl>

                  <FormLabel>Contract</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        </FormField>

        <SelectLocation
          class="mb-4 w-full"
          @select="(locationId) => form.setFieldValue('locationId', locationId)"
        />
        
        <FormField v-slot="{ componentField }" name="applicationDeadline">
          <FormItem class="mb-4">
            <FormLabel>
              {{ $t("jobs.application_deadline") || "Application Deadline" }}
            </FormLabel>

            <FormControl>
              <Input type="date" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="isRemote">
          <FormItem class="mb-4 flex items-center gap-2">
            <FormControl>
              <Checkbox v-bind="componentField" />
            </FormControl>
            <FormLabel>
              {{ $t("jobs.remote_work") || "Remote Work Option" }}
            </FormLabel>
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="companyInfo">
          <FormItem class="mb-4">
            <FormLabel>
              {{ $t("jobs.company_info") || "Company Information" }}
            </FormLabel>

            <FormControl>
              <Textarea rows="3" v-bind="componentField" placeholder="Add information about the company..." />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="tags">
          <FormItem>
            <FormLabel>{{ $t("jobs.tags") }}</FormLabel>

            <FormControl>
              <TagsInput
                :model-value="componentField.modelValue"
                @update:model-value="componentField['onUpdate:modelValue']"
              >
                <TagsInputItem
                  v-for="item in componentField.modelValue"
                  :key="item"
                  :value="item"
                >
                  <TagsInputItemText />

                  <TagsInputItemDelete />
                </TagsInputItem>

                <TagsInputInput />
              </TagsInput>
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <DialogFooter>
        <Button type="submit" form="newJob" :disabled="isSubmitting">
          {{ isEditMode ? $t("edit") : $t("add") }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </form>
</template>
