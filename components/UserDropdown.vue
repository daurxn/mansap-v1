<script setup lang="ts">
import { Button } from "@/components/ui/button";

import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
LogOut,
User
} from "lucide-vue-next";
import { useAuthStore } from "~/store/auth.store";
import { useI18n } from "vue-i18n";
import { useToken } from "~/composables/auth/useToken";

const { logUserOut } = useAuthStore();
const router = useRouter();
const { t } = useI18n();

// Get user profile data for the image
const headers = {
  Authorization: `Bearer ${useToken().value}`,
};

interface ProfileData {
  name?: string;
  bio?: string;
  age?: number;
  gender?: string;
  imageUrl?: string;
  location?: string;
  [key: string]: unknown;
}

const { data: profileData } = useFetch<ProfileData>("/api/profile", {
  headers,
  key: "profile",
});

// Type assertion to help TypeScript understand the structure
const typedProfileData = computed<ProfileData | null>(() => profileData.value as ProfileData);

function navigateToProfile() {
  router.push("/profile");
}

const { main = false } = defineProps<{
  main?: boolean;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="link" :class="{ 'text-white': main }" class="flex items-center gap-2">
        <div v-if="typedProfileData?.imageUrl" class="h-8 w-8 rounded-full overflow-hidden">
          <NuxtImg 
            :src="typedProfileData.imageUrl" 
            class="object-cover w-full h-full" 
            alt="Profile image"
          />
        </div>
        <slot />  
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>{{ t("common.my_account", "My Account") }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @click="navigateToProfile">
          <User class="mr-2 h-4 w-4" />
          <span>{{ t("common.profile", "Profile") }}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logUserOut">
        <LogOut class="mr-2 h-4 w-4" />
        <span>{{ t("common.logout") }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
