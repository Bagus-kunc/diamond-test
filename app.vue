<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useApiDataStore } from '@/composables/useApiDataStores';

const apiDataStore = useApiDataStore();

onMounted(() => {
  apiDataStore.fetchData();
});
</script>
