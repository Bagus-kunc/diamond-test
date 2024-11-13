<template>
  <div class="min-w-[200px] ml-3 mt-3 relative menu-sidebar">
    <Listbox
      v-model="selectedBox"
      :options="accordionItems"
      class="w-full"
      listStyle="max-height:85dvh;scrollbar-width: none"
      pt:list:class="gap-[5px]"
      @click="toggleSubMenu"
    >
      <template #option="{ option }">
        <div class="flex justify-between cursor-pointer">
          <div>{{ option.title }}</div>
        </div>
      </template>
    </Listbox>

    <!-- Teleport for Submenu -->
    <Teleport to="#teleports">
      <transition name="fade">
        <div
          v-if="isVisible"
          ref="refSubMenu"
          v-click-outside="handleClickOutside"
          class="submenu"
          pt:list:class="gap-[5px]"
          :style="{ top: submenuPosition.top, left: submenuPosition.left }"
        >
          <Listbox
            v-model="selectedSubItem"
            :options="selectedSubMenu.data"
            optionLabel="title"
            class="w-full sublist"
            listStyle="max-height:550px"
            @change="handleItemClick(selectedSubItem)"
          />
        </div>
      </transition>
    </Teleport>
  </div>

  <CustomCarousel :data="sideData" :cover="coverItem" />
</template>

<script setup>
import { ref, nextTick } from 'vue';
import CustomCarousel from '~/components/CustomCarousel.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  firstData: {
    type: Object,
    required: true,
  },
});

const selectedBox = ref('');
const selectedSubItem = ref(null);
const selectedSubMenu = ref(null);
const refSubMenu = ref(null);
const status = ref('');
const isVisible = ref(false);
const submenuPosition = ref({ top: '0px', left: '0px' });

const accordionItems = ref([]);
const sideData = ref([]);
const coverItem = ref('');
// const sideTitle = ref('');
// const sideCover = ref('');

const toggleSubMenu = () => {
  isVisible.value = false;
  status.value = '';
  if (selectedBox.value) {
    selectedSubMenu.value = selectedBox.value;
    coverItem.value = selectedSubMenu.value.cover;
    sideData.value = [];
    console.log('klik item', selectedSubMenu.value);
    const itemElement = document.querySelector('.p-listbox-option.p-listbox-option-selected');

    if (itemElement != null) {
      const rect = itemElement.getBoundingClientRect();

      submenuPosition.value = {
        top: `${rect.top + window.scrollY + rect.height / 2}px`,
        left: `${rect.left + window.scrollX + 270}px`,
      };

      setTimeout(() => {
        status.value = 'click';
      }, 500);
      isVisible.value = true;

      nextTick(() => {
        if (refSubMenu.value) {
          const rectSubmenu = refSubMenu.value.getBoundingClientRect();

          // Hitung posisi tengah vertikal yang diinginkan
          let desiredTop = rect.top + window.scrollY + rect.height / 2 - rectSubmenu.height / 2;

          // Pastikan submenu tidak keluar dari batas bawah viewport
          if (desiredTop + rectSubmenu.height > window.innerHeight) {
            desiredTop = window.innerHeight - rectSubmenu.height;
          }

          console.info('desiredTop', desiredTop);

          // Pastikan submenu tidak keluar dari batas atas viewport
          const headerHeight = 85;

          if (desiredTop < headerHeight) {
            desiredTop = headerHeight;
          }

          submenuPosition.value = {
            top: `${desiredTop}px`,
            left: `${rect.left + 200}px`,
          };
        }
      });
    }
  } else {
    submenuPosition.value = { top: '0px', left: '0px' };
  }
};

const handleClickOutside = () => {
  if (isVisible.value && status.value === 'click') {
    isVisible.value = false;
    const itemElement = document.querySelector('.p-listbox-option.p-listbox-option-selected');
    if (itemElement) {
      itemElement.classList.remove('p-listbox-option-selected');
    }
  }
};

// Handle item click
const handleItemClick = (clickableItem) => {
  sideData.value = clickableItem.data;

  console.log(`Item clicked: ${clickableItem.title}, Action: ${clickableItem.data}`);
};

watch(() => {
  accordionItems.value = props.data;
  console.log('selectedBox', selectedBox.value);
});

onMounted(() => {
  setTimeout(() => {
    coverItem.value = props.firstData?.cover;
  }, 100);
});
</script>

<style scoped>
.submenu {
  position: absolute;
  z-index: 1000;
  border-radius: 10px;
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
