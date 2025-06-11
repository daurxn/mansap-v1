<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";
import { useToken } from "~/composables/auth/useToken";
import SelectLocation from "./form/SelectLocation.vue";
import { toast } from "vue-sonner";
import { useAuthStore } from "~/store/auth.store";

// const SELECT_FIELDS = ["gender"];
// const NUMBER_FIELDS = ["age"];

const token = useToken();
const { isAuthenticated } = useAuthStore();

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      age: z.number().min(14).max(80),
      bio: z.string().min(4).max(1000),
      gender: z.enum(["male", "female", "other"]),
      locationId: z.number(),
    })
  ),
});

const onSubmit = form.handleSubmit(async (values) => {
  await $fetch("/api/profile", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: values,
  });
  toast.success("Profile has been updated successfully!");
  await refreshNuxtData("profile");
  document.getElementById("_dialog-close-btn")?.click();
});

type NullableValues = {
  [K in keyof Required<(typeof form)["values"]>]: Exclude<
    Required<(typeof form)["values"]>[K],
    undefined
  > | null;
};

onMounted(async () => {
  if (!isAuthenticated) return;

  const btn = document.getElementById("_dialog-edit-btn");

  const data = await $fetch<NullableValues>("/api/profile", {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  const formFields: (keyof (typeof form)["values"])[] = [
    "age",
    "bio",
    "gender",
    "locationId",
  ];

  formFields.forEach((field) =>
    form.setFieldValue(field, data[field] ?? undefined)
  );

  if (btn && Object.values(data).some((field) => field === null)) {
    btn.click();
  }
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot>
        <Button id="_dialog-edit-btn" class="hidden" />
      </slot>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[600px]">
      <form class="space-y-5" @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>{{ $t("profile.editing") }}</DialogTitle>
          <DialogDescription>
            {{ $t("profile.make_changes") }}
          </DialogDescription>
        </DialogHeader>

        <FormField v-slot="{ componentField }" name="age">
          <FormItem>
            <FormLabel>{{ $t("profile.age") }}</FormLabel>
            <FormControl>
              <Input type="number" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="bio">
          <FormItem>
            <FormLabel>{{ $t("profile.bio") }}</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="gender">
          <FormItem class="w-full">
            <FormLabel>{{ $t("profile.gender") }}</FormLabel>
            <Select class="w-full" v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue
                    :placeholder="`${$t('select')} ${$t('gender')}`"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </FormControl>
            </Select>
          </FormItem>
        </FormField>

        <SelectLocation
          class="w-full"
          @select="(locationId) => form.setFieldValue('locationId', locationId)"
        />

        <DialogFooter>
          <DialogClose as-child>
            <Button
              id="_dialog-close-btn"
              class="hidden"
              type="button"
              aria-hidden="true"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>
          <Button type="submit">{{ $t("common.save_changes") }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
