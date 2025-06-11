<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';

</script>

<template>
    <div class="relative w-full max-w-sm">
        <Input id="search" type="text" :placeholder="$t('home.city')" class="pl-9 h-11 rounded-l-none" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <MapPin class="size-5 text-muted-foreground" />
        </span>
        <div class="absolute end-1.5 inset-y-0 flex items-center">
            <Button size="sm">{{ $t('home.search') }}</Button>
        </div>
    </div>
</template>
