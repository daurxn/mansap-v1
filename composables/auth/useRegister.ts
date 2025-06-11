import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useAuthStore } from "~/store/auth.store";
import { toast } from "vue-sonner";
import { useI18n } from "vue-i18n"; // Assuming vue-i18n is used

export function useRegister() {
  const { t } = useI18n();
  const { registerUser, isLoading: registering } = useAuthStore();

  const RoleEnum = z.enum(["USER", "ADMIN", "MODERATOR"]);

  const formSchema = toTypedSchema(
    z.object({
      name: z
        .string({
          required_error: t("auth.errors.name_required", "Name is required."),
        })
        .min(2, {
          message: t(
            "auth.errors.name_min",
            "Name must be at least 2 characters."
          ),
        })
        .max(50, {
          message: t(
            "auth.errors.name_max",
            "Name cannot be longer than 50 characters."
          ),
        }),
      email: z
        .string({
          required_error: t("auth.errors.email_required", "Email is required."),
        })
        .email({
          message: t("auth.errors.email_invalid", "Invalid email address."),
        }),
      password: z
        .string({
          required_error: t(
            "auth.errors.password_required",
            "Password is required."
          ),
        })
        .min(8, {
          message: t(
            "auth.errors.password_min",
            "Password must be at least 8 characters."
          ),
        })
        .max(128, {
          message: t(
            "auth.errors.password_max",
            "Password cannot be longer than 128 characters."
          ),
        }),
      role: RoleEnum.optional(),
    })
  );

  const form = useForm({
    validationSchema: formSchema,
    initialValues: {
      role: "USER",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const isSuccess = await registerUser(values);
      if (isSuccess) {
        toast(t("auth.signup_success_title", "Registration Successful"), {
          description: t(
            "auth.signup_success_desc",
            "Your account has been created. Please log in."
          ),
          duration: 5000,
        });
        form.resetForm({
          values: {
            name: "",
            email: "",
            password: "",
            role: "USER",
          },
        });
      } else {
        toast(t("auth.signup_error_title", "Registration Failed"), {
          description: t(
            "auth.signup_error_desc",
            "Could not create your account. Please try again."
          ),
          duration: 5000,
        });
      }
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      const errorMessage = t(
        "auth.errors.unknown_error",
        "An unexpected error occurred."
      );
      toast(t("auth.signup_error_title", "Registration Failed"), {
        description: errorMessage,
        duration: 5000,
      });
    }
  });

  return {
    form,
    onSubmit,
    registering,
  };
}
