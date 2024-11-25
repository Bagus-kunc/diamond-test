<template>
  <div v-if="apiDataStore.loading" class="loading-screen">
    <img src="/images/logo-img.png" alt="Loading" class="loading-image" />
  </div>

  <div v-else class="w-full h-screen flex flex-col" style="font-family: 'Lato', sans-serif">
    <Header v-model:selected="selectedHeader" />

    <div class="flex flex-1">
      <Sidebar class="sidebar" :data="sidebarData" />

      <div class="flex-1 flex flex-col relative pl-[250px]">
        <div v-if="menuStore.loading" class="spinner-overlay">
          <div v-if="!menuStore.imagesLoaded">
            <ProgressSpinner />
          </div>
        </div>

        <CustomCarousel class="flex-1" :cover="menuStore.cover" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApiDataStore } from '~/composables/useApiDataStores';
import { useMenuStore } from '~/composables/menuStore';
import Sidebar from '~/components/Sidebar.vue';
import Header from '~/components/Header.vue';
import CustomCarousel from '~/components/CustomCarousel.vue';
import ProgressSpinner from 'primevue/progressspinner';

definePageMeta({
  middleware: 'auth',
});

const apiDataStore = useApiDataStore();
const menuStore = useMenuStore();

const selectedHeader = ref();
const notFound = ref(false);
const isFirstLoad = ref(true);

const sidebarData = computed(() => {
  const filter = apiDataStore.data.categories.find((item) => item.id === menuStore.selected);
  return filter?.data || [];
});

onMounted(() => {
  setTimeout(() => {
    menuStore.setImagesLoaded(false);
  }, 2000);
});
</script>

<style scoped>
/* Loading Screen */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-image {
  width: 100px;
  height: auto;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Main Layout */
.spinner-overlay {
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 1000;
}

.not-found {
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 250px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 3rem;
  color: #687489;
  justify-content: center;
  /* background: url('/images/contents/background.jpg'); */
  background-position: center;
  z-index: 999;
}

.sidebar {
  width: 250px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

/* Fade transition for elements */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
