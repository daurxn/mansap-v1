<script setup lang="ts">
import { ref, watch } from 'vue';
import { MapPin, X } from 'lucide-vue-next';
import { useToken } from "~/composables/auth/useToken";
import Input from "~/components/ui/input/Input.vue";
import Button from "~/components/ui/button/Button.vue";

// Define props and emits
const props = defineProps<{
  selectedLocationName?: string;
}>();

const emit = defineEmits<{
  (e: 'location-selected', location: { id: number; name: string }): void;
}>();

const searchQuery = ref('');
const isSearching = ref(false);
const locations = ref<{ id: number; name: string }[]>([]);

// Watch for changes in the search query and fetch matching locations
watch(searchQuery, async (newQuery) => {
  if (newQuery.length < 2) {
    locations.value = [];
    return;
  }
  
  isSearching.value = true;
  try {
    // Fetch locations from API based on search query
    const { data } = await useFetch<{ id: number; name: string }[]>('/api/locations', {
      query: {
        search: newQuery
      },
      headers: {
        Authorization: `Bearer ${useToken().value}`,
      },
    });
    
    if (data.value) {
      locations.value = data.value;
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
  } finally {
    isSearching.value = false;
  }
});

// Handle selection of a location
const selectLocation = (location: { id: number; name: string }) => {
  emit('location-selected', location);
  searchQuery.value = '';
  locations.value = [];
};

// Clear the search input
const clearSearch = () => {
  searchQuery.value = '';
  locations.value = [];
};
</script>

<template>
  <div class="relative w-full max-w-sm">
    <Input 
      id="location-search" 
      v-model="searchQuery" 
      type="text" 
      :placeholder="$t('home.city')" 
      class="pl-9 h-11" 
    />
    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <MapPin class="size-5 text-muted-foreground" />
    </span>
    <div class="absolute end-1.5 inset-y-0 flex items-center">
      <Button 
        v-if="searchQuery" 
        variant="ghost" 
        size="icon"
        class="h-5 w-5 mr-1"
        @click="clearSearch"
      >
        <X class="size-4" />
      </Button>
    </div>
    
    <!-- Dropdown for location results -->
    <div v-if="locations.length > 0" class="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
      <ul>
        <li 
          v-for="location in locations" 
          :key="location.id" 
          class="px-3 py-2 hover:bg-accent cursor-pointer flex items-center gap-2"
          @click="selectLocation(location)"
        >
          <MapPin class="size-4 text-muted-foreground" />
          <span>{{ location.name }}</span>
        </li>
      </ul>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isSearching" class="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-md z-50 p-4 text-center">
      <span class="text-sm text-muted-foreground">
        {{ $t('common.loading') }}...
      </span>
    </div>
  </div>
</template>
