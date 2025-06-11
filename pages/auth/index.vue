<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignupForm from "~/components/auth/SignupForm.vue";
import LoginForm from "~/components/auth/LoginForm.vue";
</script>

<template>
  <app-container
    class="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh] p-4 md:p-6 lg:p-8 items-center gap-8 lg:gap-4 auth-container"
  >
    <div class="auth-content">
      <h1
        class="font-semibold leading-tight md:leading-10 lg:leading-11 text-3xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 lg:mb-10 auth-title"
      >
        {{ $t("auth.landing.hero_title_part1") }}
        <br />
        {{ $t("auth.landing.hero_title_part2") }}
      </h1>

      <div
        class="flex flex-col md:flex-row justify-between gap-6 md:gap-8 lg:gap-10"
      >
        <div class="benefits-box">
          <h5
            class="text-xl sm:text-xl md:text-2xl font-semibold mb-2 auth-subtitle"
          >
            {{ $t("auth.landing.post_job_title") }}
          </h5>
          <p class="text-sm sm:text-base auth-text">
            {{ $t("auth.landing.post_job_description") }}
          </p>
        </div>

        <div class="benefits-box">
          <h5
            class="text-xl sm:text-xl md:text-2xl font-semibold mb-2 auth-subtitle"
          >
            {{ $t("auth.landing.choose_freelancers_title") }}
          </h5>
          <p class="text-sm sm:text-base auth-text">
            {{ $t("auth.landing.choose_freelancers_description") }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center mt-8 lg:mt-0">
      <Tabs default-value="signup" class="w-full max-w-md auth-tabs">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="signup" class="text-xs sm:text-sm">
            {{ $t("auth.signup_title") }}
          </TabsTrigger>
          <TabsTrigger value="login" class="text-xs sm:text-sm">
            {{ $t("auth.signin_title") }}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>

        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
      </Tabs>
    </div>
  </app-container>
</template>

<style scoped>
/* Responsive auth page styles */
@media (max-width: 640px) {
  .auth-container {
    font-size: 95%;
  }

  .auth-title {
    font-size: 95%;
  }

  .auth-subtitle {
    font-size: 95%;
  }

  .auth-text {
    font-size: 95%;
  }

  :deep(.auth-tabs) {
    font-size: 95%;
  }

  .benefits-box {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .auth-container {
    font-size: 90%;
  }

  .auth-title {
    font-size: 90%;
    margin-bottom: 1rem;
  }

  .auth-subtitle {
    font-size: 90%;
  }

  .auth-text {
    font-size: 90%;
  }

  :deep(.auth-tabs) {
    font-size: 90%;
  }
}
</style>
