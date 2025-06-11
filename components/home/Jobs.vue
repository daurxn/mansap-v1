<script setup lang="ts">
import { ref, onMounted } from "vue";
import { animate, stagger, inView } from "motion";
import { useToken } from "~/composables/auth/useToken";
import type { Job } from "~/types/job";

const props = defineProps<{
  search: string;
}>();

const { search } = toRefs(props);

const { data, refresh } = useFetch<Job[]>("/api/jobs", {
  query: { search },
  headers: {
    Authorization: `Bearer ${useToken().value}`,
  },
  key: "/api/jobs",
});

const jobPostings = computed(() => data.value ?? []);

watch(search, () => {
  refresh();
});

// Animation references
const resultsRef = ref(null);
const jobsListRef = ref(null);

// Setup animations when component is mounted
onMounted(() => {
  // Animate results count with a fade-in
  if (resultsRef.value) {
    animate(
      resultsRef.value, 
      { opacity: [0, 1], x: [-20, 0] }, 
      { duration: 0.6, easing: "ease-out" }
    );
  }
  
  // Animate job list when it comes into view
  if (jobsListRef.value) {
    inView(jobsListRef.value, () => {
      // Animate the container first
      animate(
        jobsListRef.value,
        { opacity: [0, 1] },
        { duration: 0.3 }
      );
      
      // Then animate each job item with stagger
      animate(
        "li",
        { 
          opacity: [0, 1], 
          y: [20, 0],
          scale: [0.98, 1],
        },
        { 
          delay: stagger(0.1),
          duration: 0.5,
          easing: [0.22, 1, 0.36, 1]
        }
      );
    });
  }
});
</script>

<template>
  <app-container>
    <div ref="resultsRef">
      <HomeJobsListResult :count="jobPostings.length" />
    </div>
    <div class="flex gap-4 py-4" ref="jobsListRef">
      <HomeJobsList :jobs="jobPostings" />
    </div>
  </app-container>
</template>

<style scoped>
/* Add some base styles for animations */
:deep(li) {
  will-change: transform, opacity;
  transform-origin: center top;
}
</style>
