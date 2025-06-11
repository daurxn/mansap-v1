import { useAuthStore } from "~/store/auth.store";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  const adminRoutes = ["/admin"];

  if (adminRoutes.includes(to.path) && auth.role !== "admin") {
    return navigateTo("/");
  }
});
