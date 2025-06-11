<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";

const model = defineModel<string>();
</script>

<template>
  <div class="relative w-full max-w-xs mb-10">
    <Input
      id="search"
      v-model="model"
      type="text"
      :placeholder="`${$t('home.search_job')}...`"
      class="pl-9 h-11"
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Search class="size-5" />
    </span>
  </div>
</template>
