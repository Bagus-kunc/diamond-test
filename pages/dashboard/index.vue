<template>
  <div class="w-full">
    <div class="sticky z-10 flex items-center justify-center gap-1 p-2 shadow-lg">
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
  console.log('data', data[0]);
  console.log('id', id);
};

const fetchMenubar = async () => {
  try {
    const res = await fetch('/data/clinicData.json');
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();

    menuItems.value = data.categories;
    firstItem.value = data.categories[0];

    if (!firstItemSelected.value) {
      firstItemSelected.value = data.categories[0].data[0]; // Set dengan item pertama
      console.log('First data set to:', firstItemSelected.value);
    }

    const first = data.categories[0];
    handleItem(first.data, first.id);

    console.log('data pertama', data.categories[0]);
  } catch (err) {
    console.log('Failed to fetch Menu item:', err);
  }
};

onMounted(async () => {
  await fetchMenubar();
});
</script>
