import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useAuthStore } from "~/store/auth.store";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

export function useLogin() {
  const authStore = useAuthStore();
  const { isLoading: loggingIn } = storeToRefs(authStore);
  const { authenticateUser } = authStore;
  const router = useRouter();

  const formSchema = toTypedSchema(
    z.object({
      email: z
        .string({ required_error: "Email is required." })
        .email({ message: "Please enter a valid email address." }),
      password: z
        .string({ required_error: "Password is required." })
        .min(8, { message: "Password must be at least 8 characters long." }),
    })
  );

  const form = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await authenticateUser(values);
      router.push("/");
    } catch (error: unknown) {
      console.error("Login failed:", error);
    }
  });

  return {
    form,
    onSubmit,
    loggingIn,
  };
}
