import { useToken } from "~/composables/auth/useToken";

const REQUIRED_AUTH_PATHS = [
  "/job-postings",
  "/profile",
  "/find-work",
  "/applications",
];

export default defineNuxtRouteMiddleware((to) => {
  const token = useToken();

  if (token.value && to?.path === "/auth") {
    return navigateTo("/");
  }

  if (!token.value && REQUIRED_AUTH_PATHS.includes(to.path)) {
    abortNavigation();
    return navigateTo("/auth");
  }
});
