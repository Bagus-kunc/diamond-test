<template>
  <div class="flex justify-center h-full relative ml-4 lg:w-full card">
    <div ref="fullscreenDiv" class="flex justify-center">
      <button v-if="products.length > 1" class="m-3" @click="goToPrev">
        <Icon name="ic:baseline-arrow-circle-left" size="30" style="color: gray" />
      </button>

      <div class="relative">
        <div class="swiper-pagination" />
        <Icon
          v-if="coverSubMenu || !isLoading"
          class="absolute bottom-4 right-0 cursor-pointer z-10"
          :name="isFullScreen ? 'ic:baseline-fullscreen-exit' : 'ic:sharp-fullscreen'"
          size="35"
          style="color: gray"
          @click="setFullScreen"
        />

        <Swiper
          ref="youtubeIframe"
          :modules="[Pagination]"
          :class="{
            'max-h-[100dvh] max-w-[110dvh] !m-0': isFullScreen,
            'max-h-[91dvh] max-w-[100dvh]': !isFullScreen,
          }"
          :slides-per-view="1"
          :loop="true"
          :effect="'creative'"
          :creative-effect="{
            prev: { shadow: false, translate: ['-20%', 0, -1] },
            next: { translate: ['100%', 0, 0] },
          }"
          :lazy="true"
          :pagination="{
            clickable: true,
            el: '.swiper-pagination',
            type: 'bullets',
          }"
          @swiper="onSwiper"
          @slide-change="controlVideo"
        >
          <div
            v-if="!Array.isArray(products) || products.length === 0"
            class="relative flex items-center justify-center h-full rounded"
          >
            <div class="flex items-center w-full h-full">
              <nuxt-img
                v-if="coverSubMenu"
                :src="coverSubMenu"
                alt="Cover Image"
                class="object-cover"
                layout="fill"
                format="webp"
                @load="handleImageLoad"
              />
            </div>
          </div>

          <SwiperSlide v-for="product in products" v-else :key="product.id">
            <div class="relative flex items-center justify-center h-full rounded">
              <div v-if="product.type === 'image' || product.type === 1" class="flex items-center w-full h-full">
                <nuxt-img
                  :src="`${product.url}`"
                  alt="Content Image"
                  class="object-cover"
                  format="webp"
                  @load="handleImageLoad"
                />
              </div>

              <div v-else-if="product.type === 'iframe' || product.type === 2" class="flex items-center w-full h-full">
                <img
                  src="/images/contents/background.jpg"
                  layout="fill"
                  class="top-0 left-0 w-full h-full"
                  alt="Background Image"
                  @load="handleImageLoad"
                />
                <div class="absolute w-full aspect-[16/9]">
                  <iframe
                    class="top-0 left-0 w-full h-full"
                    :src="convertToEmbedUrl(product.url)"
                    title="YouTube video player"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                    @load="handleIframeLoad"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <button v-if="products.length > 1" class="m-3" @click="goToNext">
        <Icon name="ic:baseline-arrow-circle-right" size="30" style="color: gray" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch, onBeforeUnmount } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  cover: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['image-loaded']);

const mySwiperRef = ref(null);
const fullscreenDiv = ref(null);
const youtubeIframe = ref(null);
const isFullScreen = ref(false);
const coverSubMenu = ref('');
const isLoading = ref(true);

const products = ref([]);

const convertToEmbedUrl = (url) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([a-zA-Z0-9_-]+)/);
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
};

const onSwiper = (swiper) => {
  mySwiperRef.value = swiper;
};

const goToNext = () => {
  mySwiperRef.value.slideNext();
};

const goToPrev = () => {
  mySwiperRef.value.slidePrev();
};

const controlVideo = (index) => {
  const isIframe = products.value[index]?.type === 'iframe';

  if (!isIframe) {
    const iframe = document.getElementsByTagName('iframe')[0];
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    }
  }
};

const setFullScreen = () => {
  if (!document.fullscreenElement) {
    fullscreenDiv.value.requestFullscreen();
    isFullScreen.value = true;
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    isFullScreen.value = false;
  }
};

const handleImageLoad = () => {
  isLoading.value = false;
  setTimeout(() => {
    emit('image-loaded');
  }, 500);
};

onMounted(() => {
  const handleFullscreenChange = () => {
    isFullScreen.value = !!document.fullscreenElement;
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });
});
const showImgCover = async () => {
  isLoading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 500));

  isLoading.value = false;
  coverSubMenu.value = props.cover;
};

watch(
  () => props.cover,
  (newCover) => {
    showImgCover();
  },
);

watchEffect(() => {
  products.value = props.data;
});
</script>

<style scoped>
.swiper-pagination {
  position: absolute;
  display: flex;
  top: 6px;
  left: 0;
  width: 100%;
  height: 10px;
  z-index: 1000;
}

:deep(.swiper-pagination-bullet) {
  width: 100% !important;
  height: 5px !important;
  margin-right: 3px !important;
  margin-left: 3px !important;
  border-radius: 10px !important;
  background-color: #000080 !important;
}
</style>
