<template>
  <div v-if="apiDataStore.loading" class="loading-screen">
    <img src="/images/logo-img.png" alt="Loading" class="loading-image" />
  </div>

  <div v-else class="w-full h-screen flex flex-col">
    <Header />

    <div class="flex flex-1">
      <Sidebar
        :data="sidebarData"
        :firstData="sidebarFirstData"
        @item-selected="handleSidebarSelection"
        class="sidebar"
      />

      <div class="flex-1 flex flex-col relative pl-[250px]">
        <div v-if="loading" class="spinner-overlay">
          <ProgressSpinner />
        </div>

        <CustomCarousel :data="selectedData" :cover="coverItem" @image-loaded="hideSpinner" class="flex-1" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApiDataStore } from '~/composables/useApiDataStores';
import Sidebar from '~/components/Sidebar.vue';
import Header from '~/components/Header.vue';
import CustomCarousel from '~/components/CustomCarousel.vue';
import ProgressSpinner from 'primevue/progressspinner';

const apiDataStore = useApiDataStore();

const selectedData = ref(null);
const coverItem = ref('');
const loading = ref(false);

const sidebarData = computed(() => {
  return Array.isArray(apiDataStore.data?.categories?.[0]?.data)
    ? apiDataStore.data.categories[0].data
    : [];
});

const sidebarFirstData = computed(() => {
  return sidebarData.value.length > 0 ? sidebarData.value[0] : {};
});

const handleSidebarSelection = (item, cover) => {
  selectedData.value = item;
  coverItem.value = cover;
  loading.value = true;
};

const hideSpinner = () => {
  loading.value = false;
};
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
  z-index: 1000;
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
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 250px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
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
