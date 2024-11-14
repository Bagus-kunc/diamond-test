<template>
  <div class="w-full">
    <div class="sticky z-[1000] flex items-center justify-center gap-1 p-2 shadow-lg">
      <div class="min-w-[220px] flex justify-center">
        <nuxt-img src="/images/logo.png" class="h-14" alt="Header Logo" />
      </div>
      <ul class="flex justify-center w-full gap-6 text-gray-700">
        <li
          v-for="item in menuItems"
          :key="item.id"
          class="transition-colors duration-200 cursor-pointer hover:text-blue-500 px-1 rounded"
          :class="{ 'bg-blue-500 text-white hover:text-white': item.id === selectedItem }"
          @click="handleItem(item.data, item.id)"
        >
          {{ item.title.toUpperCase() }}
        </li>
      </ul>
    </div>
    <div class="flex">
      <Sidebar :data="dataItem" :firstData="firstItemSelected" />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue';
import { checkCacheAndFetchData, cacheApiResponse } from '~/utils/apiHandler';

const menuItems = ref([]);
const firstItem = ref([]);
const selectedItem = ref(null);
const firstItemSelected = ref(null);
const dataItem = ref([]);

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
  const apiUrl = 'json';

  const data = await checkCacheAndFetchData(apiUrl);

  if (data) {
    menuItems.value = data.categories;
    firstItem.value = data.categories[0];
    firstItemSelected.value = data.categories[0].data[0];

    if (window.location.pathname === '/') {
      await cacheApiResponse(apiUrl, data);
    }

    const first = data.categories[0];
    handleItem(first.data, first.id);
  }
};

onMounted(() => {
  fetchData();
});
</script>
