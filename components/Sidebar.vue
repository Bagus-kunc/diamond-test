<template>
  <div class="absolute bg-white top-0 min-w-[250px] menu-sidebar px-2 flex flex-col h-full pb-10">
    <!-- Header Section -->
    <div class="sticky top-0 z-[1010] flex flex-col justify-center gap-5 pl-4 pb-2">
      <div class="flex">
        <nuxt-img src="/images/logo-img.png" class="relative h-auto w-[220px]" alt="Header Logo" />
      </div>
      <!-- <h1>Menu</h1> -->
    </div>

    <!-- Listbox Section -->
    <div class="flex-1 overflow-y-auto" style="max-height: calc(100vh - 20vh)">
      <h1 class="px-5 unselectable">Menu</h1>
      <Listbox
        v-if="accordionItems.length > 0"
        v-model="state.selectedBox"
        class="menu w-full border-none rounded-none custom-listbox"
        :options="accordionItems"
        listStyle="max-height:calc(100%); scrollbar-width:none;"
        pt:list:class="gap-[5px]"
        @click="menuClick(state.selectedBox)"
      >
        <template #option="{ option }">
          <img v-if="isOptionSelected(option)" src="~/assets/images/bg-diamond.jpg" class="bg-img" >
          <div v-if="isOptionSelected(option)" class="bg-color" />
          <div
            class="menu-item flex justify-between cursor-pointer z-50 relative items-center w-full"
            :class="{ 'menu-item-selected text-[#000080]': isOptionSelected(option) }"
            @click="handleMainClick(option)"
          >
            <div class="flex justify-between">{{ option.title }}</div>
            <img
              v-if="isOptionSelected(option)"
              src="~/assets/icons/double-arrow-blue.svg"
              alt="double arrow icon"
              @click.stop="handleArrowClick(option)"
            >
            <img v-else src="~/assets/icons/double-arrow-gray.svg" alt="double arrow icon" >
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
            :style="submenuPosition"
          >
            <Listbox
              v-if="isVisible && state.selectedSubMenu?.data?.length > 0"
              v-model="state.selectedSubItem"
              :options="state.selectedSubMenu.data"
              optionLabel="title"
              pt:root:class="bg-image-submenu"
              class="w-full sublist"
              listStyle="max-height:550px"
              @change="handleItemClick(state.selectedSubItem)"
            />
          </div>
        </transition>
      </Teleport>

      <ButtonUpdate>Update</ButtonUpdate>
    </div>
  </div>
</template>

<script setup>
import { useApiDataStore } from '@/composables/useApiDataStores';

const props = defineProps({
  data: { type: Array, required: true, default: () => {} },
  firstData: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['item-selected', 'not-found', 'first-click']);

// State management
const state = ref({
  selectedBox: null,
  selectedSubMenu: null,
  selectedSubItem: null,
  activeOption: null,
  currentCover: '',
  submenuVisible: false,
  loading: false,
});

const accordionItems = computed(() =>
  (props.data || []).map((item) => ({
    ...item,
    clicked: false,
    data: (item.data || []).map((subItem) => ({
      ...subItem,
      clicked: false,
    })),
  })),
);

const sideData = ref([]);
const apiDataStore = useApiDataStore()
const submenuPosition = ref({ top: '0px', left: '0px' });
const isVisible = computed(() => state.value.submenuVisible);
const coverItem = computed(() => state.value.currentCover);
const loading = computed(() => state.value.loading);
const notFound = ref(false);

const isOptionSelected = (option) => state.value.activeOption?.id === option.id;

const handleMainClick = (option) => {
  if (!option) return;

  state.value.submenuVisible = false;

  if (state.value.currentCover !== option.cover) {
    state.value.activeOption = option;
    state.value.currentCover = option.cover;
    emit('item-selected', sideData.value, option.cover);
    emit('not-found', false);
    state.value.loading = true;
    sideData.value = [];

    setTimeout(() => {
      state.value.loading = false;
    }, 1000);
  }
};

const handleArrowClick = (option) => {
  state.value.submenuVisible = true;
  state.value.selectedSubMenu = option;

  const itemElement = event.target.closest('.menu-item');
  if (itemElement) {
    const rect = itemElement.getBoundingClientRect();
    submenuPosition.value = {
      top: `${rect.top + window.scrollY}px`,
      left: `${rect.left + 240}px`,
    };
  }
};

const handleClickOutside = () => {
  state.value.submenuVisible = false;
};

const handleItemClick = (item) => {
  if (!item.clicked) {
    item.clicked = true;
  } else {
    item.clicked = false;
  }
  emit('first-click', item.clicked);

  sideData.value = item?.data || [];

  emit('item-selected', item.data, state.value.currentCover);

  if (item.data.length === 0) {
    state.value.loading = false;
    emit('not-found', true);
  } else {
    emit('not-found', false);
  }

  setTimeout(() => {
    state.value.submenuVisible = false;
  }, 500);
  state.value.loading = true;
};

const menuClick = (item) => {
  emit('item-selected', sideData.value, item.cover);
  if (!item.clicked) {
    item.clicked = true;
  } else {
    item.clicked = false;
  }
  emit('first-click', item.clicked);
};


// Lifecycle hooks
onMounted(() => {
  state.value.loading = true;
  setTimeout(() => {
    if (props.firstData?.cover) {
      state.value.currentCover = props.firstData.cover;
      emit('item-selected', sideData.value, props.firstData.cover);
      emit('not-found', false);
      state.value.activeOption = props.data.find((item) => item.cover === props.firstData.cover);
    }
    state.value.loading = false;
  }, 1000);
});
</script>

<style scoped>
.unselectable {
  pointer-events: none;
  user-select: none;
  color: black;
}
.menu-sidebar {
  z-index: 1000;
  font-size: 16px;
  font-weight: 600;
  border-right: 1px solid #cdd5e0;
  display: flex;
  flex-direction: column;
}

.menu {
  color: #687489 !important;
  overflow: hidden;
}

/* Custom menu item styles */
.menu-item {
  padding: 1rem 0.4rem;
  transition: background-color 0.2s ease;
}

.menu-item-selected {
  background-color: rgba(133, 167, 218, 0.1);
}

.submenu {
  position: absolute;
  color: #687489;
  font-weight: 600;
  z-index: 1010;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sublist {
  background-size: cover;
  background-image: url('~/assets/images/bg-diamond.jpg') !important;
}

.bg-img {
  position: absolute;
  top: -5px;
  left: 0;
  transform: scaleX(-1);
  transform: origin;
  background-position: left bottom;
}

.bg-color {
  position: absolute;
  inset: 0;
  background: #85a7da94;
  border-radius: 4px;
  color: #000080 !important;
  border-bottom: 2px solid #000080;
}

.spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 250px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 999;
}

.btn-update {
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
