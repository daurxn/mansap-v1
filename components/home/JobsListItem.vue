<script setup lang="ts">
import { Image, MapPin } from "lucide-vue-next";
import type { Job } from "~/types/job";
import Card from "../ui/card/Card.vue";
import CardContent from "../ui/card/CardContent.vue";
import CardHeader from "../ui/card/CardHeader.vue";
import CardTitle from "../ui/card/CardTitle.vue";

const { job } = defineProps<{
  job: Job;
}>();

const router = useRouter();

function navigateToJobPage() {
  router.push(`/job-postings/${job.id}`);
}
</script>

<template>
  <li>
    <Card class="gap-4">
      <CardHeader>
        <CardTitle class="font-normal">
          <div class="flex items-center gap-4">
            <Image :size="42" />

            <div class="flex flex-col gap-2">
              <Button
                variant="link"
                class="text-shadow-md"
                @click="navigateToJobPage"
              >
                {{ job.name }}
              </Button>
              <div class="flex gap-2 text-sm">
                <span class="font-medium">{{ job.postedBy.name }}</span>
                <span>&#x2022;</span>
                <div class="flex items-center gap-0.5">
                  <MapPin :size="16" />
                  <span> {{ job.location.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent class="text-sm">
        <p class="text-gray-800 dark:text-gray-200 mb-3">
          {{ job.description }}
        </p>
        <Separator class="my-4" />
        <ul class="flex gap-2 font-medium">
          <li
            v-for="tag in job.tags"
            :key="tag.id"
            class="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-xs"
          >
            {{ tag.name }}
          </li>
        </ul>
      </CardContent>

      <CardFooter class="text-sm">
        <slot name="footer" />
      </CardFooter>
    </Card>
  </li>
</template>
