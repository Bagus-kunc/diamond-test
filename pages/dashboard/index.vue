<template>
  <div v-if="apiDataStore.loading" class="loading-screen">
    <img src="/images/logo-img.png" alt="Loading" class="loading-image" />
  </div>

  <div v-else class="w-full h-screen flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar
        :data="sidebarData"
        :firstData="sidebarFirstData"
        @item-selected="handleSidebarSelection"
        class="sidebar"
      />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col relative pl-[250px]">
        <!-- Spinner -->
        <div v-if="loading" class="spinner-overlay">
          <ProgressSpinner />
        </div>

        <!-- CustomCarousel -->
        <CustomCarousel :data="selectedData" :cover="coverItem" @image-loaded="hideSpinner" class="flex-1" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useApiDataStore } from '~/composables/useApiDataStores';
import Sidebar from '~/components/Sidebar.vue';
import Header from '~/components/Header.vue';
import CustomCarousel from '~/components/CustomCarousel.vue';
import ProgressSpinner from 'primevue/progressspinner';

const apiDataStore = useApiDataStore();

// State untuk data yang dipilih
const selectedData = ref(null);
const coverItem = ref('');
const loading = ref(false);

// Menyusun data dan firstData untuk Sidebar
const sidebarData = computed(() => apiDataStore.data?.categories?.[0]?.data || []);
const sidebarFirstData = computed(() => apiDataStore.data?.categories?.[0]?.data?.[0] || {});

// Event handler untuk mendapatkan data dari Sidebar
const handleSidebarSelection = (item, cover) => {
  selectedData.value = item;
  coverItem.value = cover;
  loading.value = true;
};

onMounted(() => {
  if (apiDataStore.data?.categories?.[0]?.data?.[0]) {
    coverItem.value = apiDataStore.data.categories[0].data[0].cover;
  }
});

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
