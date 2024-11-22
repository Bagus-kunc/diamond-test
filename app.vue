<template>
  <div>
    <Toast />
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import Toast from 'primevue/toast';
import { useApiDataStore } from '@/composables/useApiDataStores';

const apiDataStore = useApiDataStore();

onMounted(() => {
  apiDataStore.fetchData();
});
</script>
