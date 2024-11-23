<template>
  <div class="absolute bg-white top-0 min-w-[250px] menu-sidebar flex flex-col h-full pb-10">
    <div class="sticky top-0 z-[1010] flex flex-col justify-center gap-5 pl-4 mb-4 px-4">
      <NuxtImg src="/images/logo-img.png" class="relative h-auto w-[220px]" alt="Header Logo" />
    </div>

    <div class="overflow-y-auto" style="max-height: calc(100vh - 20vh)">
      <h1 class="px-7 unselectable">Menu</h1>
      <Listbox
        v-if="accordionItems.length > 0"
        v-model="state.selectedBox"
        class="menu w-full border-none rounded-none custom-listbox"
        :options="accordionItems"
        listStyle="max-height:calc(100%); scrollbar-width:none;"
        pt:list:class="gap-[5px]"
      >
        <template #option="{ option, index }">
          <img v-if="isOptionSelected(option)" src="~/assets/images/bg-diamond.jpg" class="bg-img" />
          <div v-if="isOptionSelected(option)" class="bg-color" />
          <div
            class="menu-item flex justify-between cursor-pointer z-50 relative items-center w-full"
            :class="{ 'menu-item-selected text-[#000080]': isOptionSelected(option) }"
            @click="handleMainClick(option, index)"
          >
            <div class="flex justify-between">{{ option.title }}</div>
            <img
              v-if="isOptionSelected(option)"
              src="~/assets/icons/double-arrow-blue.svg"
              alt="double arrow icon"
              width="18"
              @click.stop="handleArrowClick(option, $event)"
            />
            <img
              v-else
              src="~/assets/icons/double-arrow-gray.svg"
              alt="double arrow icon"
              width="18"
              @click.stop="handleArrowClick(option, $event)"
            />
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
            >
              <template #option="{ option }">
                <div class="w-full flex justify-between">
                  <span>
                    {{ option.title }}
                  </span>
                  <div class="flex-none ml-2 w-6">
                    <ProgressSpinner
                      v-if="option.loading"
                      style="width: 24px; height: 24px"
                      pt:circle:class="!text-gray-300"
                      strokeWidth="3"
                    />
                  </div>
                </div>
              </template>
            </Listbox>
          </div>
        </transition>
      </Teleport>

      <ButtonUpdate label="Update" className="hover:!bg-green-600" />
    </div>
  </div>
</template>

<script setup>
import { useMenuStore } from '~/composables/menuStore';

const props = defineProps({
  data: { type: Array, required: true, default: () => {} },
});

const toast = useToast();
const menuStore = useMenuStore();

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

const accordionItems = ref([]);
const isClicked = ref(false);
const submenuPosition = ref({ top: '0px', left: '0px' });
const isVisible = computed(() => state.value.submenuVisible);

const isOptionSelected = (option) => state.value.activeOption?.id === option.id;

const handleMainClick = (option, index) => {
  isClicked.value = true;

  if (!isClicked.value) {
    menuStore.setLoading(true);
  }

  menuStore.setDataSideMenu([]);
  menuStore.setCover(option.cover);
  menuStore.setNotFound(false);

  state.value.activeOption = option;
};

const handleArrowClick = async (option, event) => {
  const menuItem = event.target.closest('.menu-item');
  if (!menuItem) {
    console.warn('Menu item tidak ditemukan');
    return;
  }

  // Pastikan submenu visible hanya satu kali
  const index = accordionItems.value.findIndex((item) => item.id === option.id);
  state.value.activeOption = option;

  state.value.selectedSubMenu = {
    ...option,
    data: await Promise.all(
      option.data.map(async (subMenu) => {
        const images = subMenu.data.map((item) => item.url).filter(Boolean);
        return {
          ...subMenu,
          loading: await checkImageOnCache(images),
        };
      }),
    ),
  };

  state.value.submenuVisible = true;

  // Gunakan window.requestAnimationFrame untuk memastikan perhitungan posisi setelah DOM render
  requestAnimationFrame(() => {
    // Hitung posisi submenu
    const rect = menuItem.getBoundingClientRect();
    const submenuWidth = 250;
    const viewportWidth = window.innerWidth;
    let leftPosition = rect.right + window.scrollX;

    if (leftPosition + submenuWidth > viewportWidth) {
      leftPosition = rect.left - submenuWidth + window.scrollX;
    }

    submenuPosition.value = {
      top: `${rect.top + window.scrollY}px`,
      left: `${leftPosition}px`,
    };
  });
};

const handleClickOutside = () => {
  state.value.submenuVisible = false;
};

const handleItemClick = (item) => {
  menuStore.setLoading(true);

  if (item.data.length === 0) {
    menuStore.setNotFound(true);
    console.log('tidak ada data');
    menuStore.setCover('/images/contents/background.jpg');
  } else {
    menuStore.setNotFound(false);
    menuStore.setDataSideMenu(item.data);
    console.log('ada');
  }

  setTimeout(() => {
    state.value.submenuVisible = false;
  }, 1000);
};

watchEffect(() => {
  if (state.value.selectedBox) {
    const item = state.value.selectedBox;
  }
});

const checkImageOnCache = async (data) => {
  if (data.length < 1) {
    return false;
  }

  const urlsToCache = data.filter((i) => i.endsWith('.jpg') || i.endsWith('.png') || i.endsWith('.jpeg'));

  const CACHE_NAME = `diamond-clinic-cache-v2 - ${self.location.origin}`;
  try {
    const cache = await caches.open(CACHE_NAME);

    const cachedRequests = await cache.keys();

    const cachedUrls = cachedRequests.map((request) => request.url);
    const isCompletelyCached = urlsToCache.every((url) => cachedUrls.some((cachedUrl) => cachedUrl.includes(url)));

    return !isCompletelyCached;
  } catch (error) {
    console.error('Error checking cache:', error);
    return false;
  }
};

const fetchAndCacheImage = async (url) => {
  const CACHE_NAME = `diamond-clinic-cache-v2 - ${self.location.origin}`;

  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
      console.log('Image found in cache.');
      return cachedResponse.url;
    }

    console.log('Fetching image from network...');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await cache.put(url, response.clone());
    return response.url;
  } catch (error) {
    console.error('Error fetching or caching image:', error);
    return null;
  }
};

const loadDataImage = async () => {
  const apiDataStore = useApiDataStore();
  const { data } = storeToRefs(apiDataStore);

  await Promise.all(
    data.value.categories.map(async (category) => {
      await Promise.all(
        category.data.map(async (menu) => {
          if (menu.cover) {
            await fetchAndCacheImage(menu.cover);
          }
          await Promise.all(
            menu.data.map(async (submenu) => {
              await Promise.all(
                submenu.data.map(async (item) => {
                  if (
                    item.url &&
                    (item.url.endsWith('.jpg') || item.url.endsWith('.png') || item.url.endsWith('.jpeg'))
                  ) {
                    await fetchAndCacheImage(item.url);
                  }
                }),
              );
            }),
          );
        }),
      );
    }),
  );
};

const checkLoadedMenu = () => {
  return accordionItems.value.every((menu) => !menu.loading);
};

const setAccordionItems = async (data) => {
  accordionItems.value = await Promise.all(
    data.map(async (item) => {
      const images = [];
      if (item.cover) {
        images.push(item.cover);
      }

      const subItems = item.data.map((subItem) => ({
        ...subItem,
        clicked: false,
        data: subItem.data.map((i) => {
          if (i.url) {
            images.push(i.url);
          }
          return { ...i };
        }),
      }));

      return {
        ...item,
        clicked: false,
        loading: await checkImageOnCache(images),
        data: subItems,
      };
    }),
  );
};

let intervalCheckMenu;
watch(
  () => props.data,
  async (newData) => {
    clearInterval(intervalCheckMenu);

    setAccordionItems(newData);

    intervalCheckMenu = setInterval(() => {
      setAccordionItems(newData);

      if (checkLoadedMenu()) {
        clearInterval(intervalCheckMenu);
      }
    }, 1000);
  },
  { immediate: true },
);

const setSelectedSubMenu = async () => {
  state.value.selectedSubMenu = {
    ...state.value.selectedSubMenu,
    data: await Promise.all(
      state.value.selectedSubMenu.data.map(async (subMenu) => {
        const images = subMenu.data.map((item) => item.url).filter((item) => item);

        return {
          ...subMenu,
          loading: await checkImageOnCache(images),
        };
      }),
    ),
  };
};

const checkLoadedSelectedSubMenu = () => {
  return state.value.selectedSubMenu.data.every((subMenu) => !subMenu.loading);
};

let intervalCheckAllImages;
const checkAllImageLoaded = async () => {
  const apiDataStore = useApiDataStore();
  const { data } = storeToRefs(apiDataStore);

  const images = [];

  data.value.categories.map((category) => {
    category.data.map((menu) => {
      if (menu.cover) {
        images.push(menu.cover);
      }
      menu.data.map((submenu) => {
        submenu.data.map((item) => {
          if (item.url) {
            images.push(item.url);
          }
        });
      });
    });
  });

  intervalCheckAllImages = setInterval(async () => {
    const response = await checkImageOnCache(images);

    if (!response) {
      clearInterval(intervalCheckAllImages);
      menuStore.setImagesLoaded(true);
      console.log('All images are loaded');
      toast.add({ severity: 'info', summary: 'Info', detail: 'All images are loaded', life: 5000 });
    }
  }, 1000);
};

let intervalCheckSubMenu;
watchEffect(async () => {
  if (isVisible.value) {
    intervalCheckSubMenu = setInterval(() => {
      setSelectedSubMenu();

      if (checkLoadedSelectedSubMenu()) {
        clearInterval(intervalCheckSubMenu);
      }
    }, 1000);
  }

  if (!isVisible.value) {
    clearInterval(intervalCheckSubMenu);
  }
});

// Lifecycle hooks
onMounted(() => {
  loadDataImage();
  checkAllImageLoaded();
  state.value.loading = true;
  setTimeout(() => {
    if (props.data) {
      state.value.currentCover = props.data[0].cover;
      menuStore.setCover(props.data[0].cover);

      state.value.activeOption = props.data.find((item) => item.cover === props.data[0].cover);
    }
    state.value.loading = false;
  }, 1000);
});

const unwatch = watchEffect(() => {});

onUnmounted(() => {
  unwatch();
  clearInterval(intervalCheckSubMenu);
  clearInterval(intervalCheckMenu);
  clearInterval(intervalCheckAllImages);
  state.value.selectedSubMenu = [];
  accordionItems.value = [];
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

.menu-item-selected {
  background-color: rgba(133, 167, 218, 0.1);
}

.submenu {
  position: fixed;
  color: #687489;
  font-weight: 600;
  margin-left: 25px;
  z-index: 1010;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: auto;
}

.menu-item {
  position: relative;
  padding: 1rem 0.8rem;
}

.menu-item img {
  position: relative;
  z-index: 1;
}

.sublist {
  background-size: cover;
  background-image: url('~/assets/images/bg-diamond.jpg') !important;
}

.bg-img {
  position: absolute;
  top: -5px;
  left: 50px;
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
