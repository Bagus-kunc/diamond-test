<template>
  <div class="flex justify-center h-full relative card overflow-hidden">
    <div ref="fullscreenDiv" class="flex justify-center max-h-[100vh]">
      <!-- Pagination -->
      <div class="swiper-pagination-container absolute top-4 w-full flex justify-center z-10">
        <div class="swiper-pagination" />
      </div>

      <!-- Navigation Buttons -->
      <button v-show="products.length > 1" class="px-3 bg-white" :disabled="!isInitialized" @click="handlePrev">
        <Icon name="ic:baseline-arrow-circle-left" size="30" :style="{ color: isInitialized ? '#AAAAAAFC' : '#ccc' }" />
      </button>

      <div class="relative w-full flex justify-center bg-white">
        <Swiper
          ref="swiperRef"
          :modules="swiperModules"
          :slides-per-view="1"
          :loop="products.length > 1"
          :speed="500"
          :space-between="30"
          :pagination="paginationOptions"
          :navigation="navigationOptions"
          :autoplay="autoplayOptions"
          :lazy="{ loadPrevNext: true, loadOnTransitionStart: true }"
          :class="{
            'max-h-[100dvh] max-w-[110dvh] !m-0': isFullScreen,
            'max-h-[91dvh] max-w-[100dvh]': !isFullScreen,
          }"
          @swiper="handleSwiperInit"
          @slideChange="onSlideChange"
          @lazy-image-load="handleImageLoad"
        >
          <!-- Empty State -->
          <SwiperSlide v-if="!products.length" class="flex items-center justify-center">
            <div class="relative w-full h-full">
              <nuxt-img
                v-if="coverSubMenu"
                :src="coverSubMenu"
                alt="Cover Image"
                class="object-cover"
                loading="lazy"
                @load="handleImageLoad"
              />
            </div>

            <Icon
              v-if="coverSubMenu"
              class="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/80 hover:bg-black/50 transition-colors"
              :name="isFullScreen ? 'ic:baseline-fullscreen-exit' : 'ic:sharp-fullscreen'"
              size="35"
              @click="toggleFullscreen"
            />
          </SwiperSlide>

          <!-- Content Slides -->
          <SwiperSlide v-for="(product, index) in products" :key="`${product.id}-${index}`" class="relative !h-[100%]">
            <!-- Image Content -->
            <div v-if="isImageType(product)" class="relative w-full">
              <nuxt-img
                :src="product.url"
                :alt="product.title || 'Content Image'"
                class="object-cover"
                loading="lazy"
                @load="handleImageLoad"
              />
            </div>

            <!-- Fullscreen Button -->

            <Icon
              v-if="!isVideoType(product)"
              class="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/60 transition-colors"
              :name="isFullScreen ? 'ic:baseline-fullscreen-exit' : 'ic:sharp-fullscreen'"
              size="35"
              @click="toggleFullscreen"
            />

            <!-- Video Content -->
            <div v-else-if="isVideoType(product)" class="relative w-full h-full flex items-center justify-center">
              <img
                src="~/assets/images/bg-diamond.jpg"
                layout="fill"
                class="top-0 left-0 w-full h-full"
                alt="Background Image"
              />
              <div class="absolute w-full aspect-[16/9]">
                <iframe
                  :src="getEmbedUrl(product.url)"
                  class="top-0 left-0 w-full h-full"
                  :title="product.title || 'Video content'"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Next Button -->
      <button v-show="products.length > 1" class="px-3 bg-white" :disabled="!isInitialized" @click="handleNext">
        <Icon
          name="ic:baseline-arrow-circle-right"
          size="30"
          :style="{ color: isInitialized ? '#AAAAAAFC' : '#ccc' }"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, watchEffect } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  cover: {
    type: String,
    default: '',
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['image-loaded', 'slide-change']);

// Refs
const swiperRef = ref(null);
const swiperInstance = ref(null);
const fullscreenDiv = ref(null);
const isFullScreen = ref(false);
const isLoading = ref(true);
const isInitialized = ref(false);
const products = ref([]);
const coverSubMenu = ref('');

// Computed
const swiperModules = computed(() => [Pagination, Navigation, Autoplay, EffectCreative]);

const paginationOptions = computed(() => ({
  clickable: true,
  el: '.swiper-pagination',
  type: 'bullets',
  dynamicBullets: true,
}));

const navigationOptions = computed(() => ({
  prevEl: '.swiper-button-prev',
  nextEl: '.swiper-button-next',
}));

const autoplayOptions = computed(() => ({
  delay: 5000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
  enabled: props.autoplay,
}));

// Methods
const isImageType = (product) => product.type === 'image' || product.type === 1;
const isVideoType = (product) => product.type === 'iframe' || product.type === 2;

const getEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&fs=0` : url;
    }
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&fs=0` : url;
    }
    return url;
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return url;
  }
};

const handleSwiperInit = (swiper) => {
  swiperInstance.value = swiper;
  isInitialized.value = true;
};

const handleNext = () => {
  if (swiperInstance.value && isInitialized.value) {
    swiperInstance.value.slideNext();
  }
};

const handlePrev = () => {
  if (swiperInstance.value && isInitialized.value) {
    swiperInstance.value.slidePrev();
  }
};

const onSlideChange = () => {
  if (!swiperInstance.value) return;

  const currentIndex = swiperInstance.value.realIndex ?? 0;
  // const currentProduct = products.value[currentIndex];

  const iframes = document.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    const src = iframe.src;
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  });

  emit('slide-change', currentIndex);
};

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await fullscreenDiv.value.requestFullscreen();
      isFullScreen.value = true;
      console.log('fullscreen active');
    } else {
      await document.exitFullscreen();
      isFullScreen.value = false;
      console.log('fullscreen non-active');
    }
  } catch (error) {
    console.warn('Fullscreen API error:', error);
  }
};

const handleImageLoad = () => {
  isLoading.value = false;
  emit('image-loaded');
};

// Lifecycle
onMounted(() => {
  const handleFullscreenChange = () => {
    isFullScreen.value = !!document.fullscreenElement;
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });
});

// Watchers
watch(
  () => props.cover,
  async (newCover) => {
    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 300));
    coverSubMenu.value = newCover;
    isLoading.value = false;
  },
);

watchEffect(() => {
  products.value = props.data || [];
});
</script>

<style scoped>
.swiper-pagination-container {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 4px;
  background-color: transparent;
  border-radius: 10px;
}

:deep(.swiper-pagination-bullet) {
  @apply w-16 h-2 bg-gray-400 rounded-full opacity-50;
  margin: 0 1px !important;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  @apply bg-[#000080] opacity-100 scale-125;
}

.card {
  @apply bg-white rounded-lg shadow-lg overflow-hidden;
}
</style>
