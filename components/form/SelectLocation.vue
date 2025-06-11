<script setup lang="ts">
import { useLocations } from "~/composables/jobs/useLocations";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "select", locationId: number): void;
}>();

const locations = await useLocations();
</script>

<template>
  <FormField name="locationId">
    <FormItem>
      <FormLabel>{{ $t("profile.locationId") }}</FormLabel>

      <Combobox by="label">
        <FormControl>
          <ComboboxAnchor v-bind="$attrs">
            <div class="relative w-full max-w-sm items-center">
              <ComboboxInput
                :display-value="(val) => val ?? ''"
                :placeholder="`${$t('common.select')} ${$t('common.region')}`"
              />

              <ComboboxTrigger
                class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
              >
                <ChevronsUpDown class="size-4 text-muted-foreground" />
              </ComboboxTrigger>
            </div>
          </ComboboxAnchor>
        </FormControl>

        <ComboboxList>
          <ComboboxEmpty>Nothing found.</ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem
              v-for="location in locations"
              :key="location.id"
              :value="location.name"
              @select="emit('select', location.id)"
            >
              {{ location.name }}

              <ComboboxItemIndicator>
                <Check :class="cn('ml-auto h-4 w-4')" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
      </Combobox>
    </FormItem>
  </FormField>
</template>
