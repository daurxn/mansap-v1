import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import * as z from "zod";
import { useToken } from "../auth/useToken";

export function useApplyToJob(jobId: number, callback: () => void) {
  const token = useToken();
  const form = useForm({
    validationSchema: toTypedSchema(
      z.object({
        coverLetter: z.string().min(10).max(1000),
      })
    ),
  });

  const isApplying = ref(false);

  const onSubmit = form.handleSubmit(async (values) => {
    const data = await $fetch<{ message: string }>("/api/profile/resume", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (data.message.toLowerCase() === "no resume") {
      toast.error("Fill out resume to submit an application");
      return;
    }

    isApplying.value = true;
    await $fetch("/api/jobs/applications", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: { ...values, jobId },
    });
    isApplying.value = false;

    await refreshNuxtData(["/api/jobs", `/api/jobs/${jobId}`]);
    toast.success("Application has been submitted!");
    callback();
  });

  return { onSubmit, isApplying };
}
