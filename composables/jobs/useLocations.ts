import type { Location } from "~/types/location";

export async function useLocations() {
  const { data } = await useFetch<Location[]>("/api/locations");

  const locations = computed(() => data.value ?? []);

  return locations;
}
