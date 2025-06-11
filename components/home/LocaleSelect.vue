<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useI18n } from "vue-i18n";

const { locales, setLocale, locale } = useI18n();
</script>

<template>
  <Select
    :model-value="locale"
    @update:model-value="(newLocale) => setLocale(newLocale as 'en' | 'ru' | 'kk')"
  >
    <SelectTrigger class="w-32">
      <SelectValue :placeholder="locale || 'Select locale'" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="(loc, idx) in locales" :key="idx" :value="loc.code">
          {{ loc.name }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
