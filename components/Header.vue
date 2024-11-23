<template>
  <div
    class="sticky w-full z-[1000] flex items-center justify-center gap-1 p-2 border-b border-[#cdd5e0] min-h-[80px] ml-[250px]"
    :style="{ maxWidth: 'calc(100vw - 250px)' }"
  >
    <ul class="flex text-wrap justify-center w-full gap-6 text-[#AAAAAAFC]">
      <li
        v-for="item in data.categories || []"
        :key="item.id"
        class="transition-colors duration-200 cursor-pointer px-1 rounded"
        :class="{
          'bg-[#AAAAAAFC] text-white hover:text-white': selected === item.id,
          'hover:bg-[#f0f0f0] hover:text-[#AAAAAAFC]': selected !== item.id,
        }"
        @click="handleItem(item.data, item.id)"
      >
        {{ item.title?.toUpperCase() || 'UNTITLED' }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useApiDataStore } from '@/composables/useApiDataStores';
import { useMenuStore } from '@/composables/menuStore';

const menuStore = useMenuStore();

const apiDataStore = useApiDataStore();
const { data } = storeToRefs(apiDataStore);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  selected: Number,
});
const emit = defineEmits(['update:selected']);

const handleItem = (dataMenu, id) => {
  menuStore.setCover('/images/contents/background.jpg');
  if (dataMenu.length === 0) {
    console.log('data', dataMenu.length);
  }

  menuStore.setSelected(id);
  emit('update:selected', id);
};

onMounted(async () => {
  if (!apiDataStore.data || !apiDataStore.data.categories?.length) {
    await apiDataStore.fetchData();
  }

  // Handle kategori pertama hanya jika data ada
  if (apiDataStore.data?.categories?.length) {
    const firstCategory = apiDataStore.data.categories[0];
    handleItem(firstCategory.data, firstCategory.id);
  }
});
</script>
