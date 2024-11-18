<template>
  <div v-if="isLoading" class="loading-screen">
    <img src="/images/logo-img.png" alt="Loading" class="loading-image" />
  </div>

  <div v-else class="w-full">
    <div
      class="sticky w-full z-[1000] flex items-center justify-center gap-1 p-2 border-b-[1px] border-[#cdd5e0] h-[80px] ml-[250px]"
      style="max-width: calc(100vw - 250px)"
    >
      <ul class="flex text-wrap justify-center w-full gap-6 text-[#AAAAAAFC]">
        <li
          v-for="item in menuItems"
          :key="item.id"
          class="transition-colors duration-200 cursor-pointer px-1 rounded"
          :class="{
            'bg-[#AAAAAAFC] text-white hover:text-white': selectedItem === item.id,
            'hover:bg-[#f0f0f0] hover:text-[#AAAAAAFC]': selectedItem !== item.id,
          }"
          @click="handleItem(item.data, item.id)"
        >
          {{ item.title.toUpperCase() }}
        </li>
      </ul>
    </div>

    <div class="flex h-screen">
      <Sidebar :data="dataItem" :firstData="firstItemSelected" />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue';
import { checkCacheAndFetchData } from '~/utils/apiHandler';

const menuItems = ref([]);
const firstItem = ref([]);
const selectedItem = ref(null);
const firstItemSelected = ref(null);
const dataItem = ref([]);
const isLoading = ref(true);

definePageMeta({
  middleware: 'auth',
});

defineComponent({
  components: {
    Sidebar,
  },
});

const handleItem = (data, id) => {
  selectedItem.value = id;
  dataItem.value = data;
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    const url = 'json';

    const data = await checkCacheAndFetchData(url);

    menuItems.value = data.categories;
    firstItem.value = data.categories[0];
    firstItemSelected.value = data.categories[0].data[0];

    const first = data.categories[0];
    handleItem(first.data, first.id);

    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
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
</style>
