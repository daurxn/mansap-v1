<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "~/composables/auth/useLogin";

const { onSubmit, loggingIn } = useLogin();
</script>

<template>
  <Card class="login-form">
    <CardHeader>
      <CardTitle class="text-xl sm:text-2xl form-title">{{ $t("auth.signin_title") }}</CardTitle>
    </CardHeader>
    <form @submit="onSubmit">
      <CardContent class="mb-4 sm:mb-6">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem class="mb-3 sm:mb-4">
            <FormLabel class="text-sm sm:text-base form-label">{{ $t("auth.email") }}</FormLabel>
            <FormControl>
              <Input
                :disabled="loggingIn"
                type="text"
                v-bind="componentField"
                class="text-sm sm:text-base form-input"
              />
            </FormControl>
            <FormMessage class="text-xs sm:text-sm" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem class="mb-3 sm:mb-4">
            <FormLabel class="text-sm sm:text-base form-label">{{ $t("auth.password") }}</FormLabel>
            <FormControl>
              <Input
                :disabled="loggingIn"
                autocomplete="on"
                type="password"
                v-bind="componentField"
                class="text-sm sm:text-base form-input"
              />
            </FormControl>
            <FormMessage class="text-xs sm:text-sm" />
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter>
        <Button :disabled="loggingIn" type="submit" class="text-xs sm:text-sm form-button">{{
          $t("auth.login")
        }}</Button>
      </CardFooter>
    </form>
  </Card>
</template>

<style scoped>
/* Responsive form styles */
@media (max-width: 640px) {
  .login-form {
    font-size: 95%;
  }
  
  .form-title {
    font-size: 95%;
  }
  
  .form-label {
    font-size: 95%;
  }
  
  .form-input {
    font-size: 95%;
  }
  
  .form-button {
    font-size: 95%;
  }
}

@media (max-width: 480px) {
  .login-form {
    font-size: 90%;
  }
  
  .form-title {
    font-size: 90%;
  }
  
  .form-label {
    font-size: 90%;
  }
  
  .form-input {
    font-size: 90%;
  }
  
  .form-button {
    font-size: 90%;
  }
}
</style>
