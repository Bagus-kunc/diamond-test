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
const cacheData = async () => {
  const apiUrl = 'json';

  const data = await checkCacheAndFetchData(apiUrl);

  if (data) {
    if (window.location.pathname === '/') {
      await cacheApiResponse(apiUrl, data);
    }
  }
};

onMounted(() => {
  cacheData();
});
</script>
