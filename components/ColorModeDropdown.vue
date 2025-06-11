<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-vue-next";

const colorMode = useColorMode();

const isDark = computed(() => colorMode.preference === "dark");

const handleToggleTheme = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};
</script>

<template>
  <Button variant="ghost" @click="handleToggleTheme">
    <Moon v-if="!isDark" />
    <Sun v-if="isDark" />
  </Button>
</template>
