import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import type { User } from "~/types/user";

type RegisterPayload = Pick<User, "email" | "name"> & { password: string };

interface UserPayloadInterface {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const token = useCookie("token");
  const router = useRouter();

  const isAuthenticated = ref(false);
  const isLoading = ref(false);

  const userId = ref<null | number>(null);
  const role = ref<null | string>(null);
  const email = ref<null | string>(null);
  const name = ref<null | string>(null);

  async function authenticateUser({ email, password }: UserPayloadInterface) {
    isLoading.value = true;
    const { accessToken } = await $fetch<{ accessToken: string }>(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          email,
          password,
        },
      }
    );

    if (accessToken) {
      toast("Logging in", {
        description: "Successfully logged in",
        duration: 2000,
      });
      token.value = accessToken;
      await setProfile();
    } else {
      toast("Logging in", {
        description: "Invalid email or password",
        duration: 2000,
      });
    }

    isLoading.value = false;
  }

  async function registerUser({ email, name, password }: RegisterPayload) {
    const { statusCode } = await $fetch<{ statusCode: number }>(
      "/api/auth/register",
      {
        method: "POST",
        body: {
          email,
          name,
          password,
        },
      }
    );

    return statusCode === 200;
  }

  async function setProfile() {
    const { data } = await useFetch<{
      id: number;
      name: string;
      email: string;
      role: string;
    }>("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (data.value) {
      isAuthenticated.value = true;
      userId.value = data.value.id;
      role.value = data.value.role;
      email.value = data.value.email;
      name.value = data.value.name;
    }
  }

  function logUserOut() {
    token.value = null;

    isAuthenticated.value = false;
    role.value = null;
    email.value = null;
    name.value = null;

    router.push("/");
  }

  return {
    isAuthenticated,
    isLoading,
    userId,
    role,
    email,
    name,
    authenticateUser,
    logUserOut,
    setProfile,
    registerUser,
  };
});
