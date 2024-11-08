<template>
  <div class="flex justify-center h-full relative ml-4 mt-4 lg:w-full card">
    <div ref="fullscreenDiv" class="flex justify-center">
      <div class="swiper-pagination" />
      <button class="m-3" @click="goToPrev">
        <Icon name="ic:baseline-arrow-circle-left" size="30" style="color: gray" />
      </button>

      <Swiper
        :modules="[Pagination]"
        :class="{
          'max-h-[100dvh] max-w-[115dvh] !m-0': isFullScreen,
          'max-h-[90dvh] max-w-[100dvh]': !isFullScreen,
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
        <SwiperSlide v-for="product in products" :key="product.id">
          <div class="relative flex items-center justify-center h-full rounded">
            <!-- Display image if type is 'image' -->
            <div v-if="product.type === 'image'" class="flex items-center w-full h-full">
              <nuxt-img
                :src="`/images/contents/${product.url}`"
                alt="Content Image"
                class="object-cover"
                format="webp"
              />
              <Icon
                class="absolute bottom-0 right-0 cursor-pointer"
                :name="isFullScreen ? 'ic:baseline-fullscreen-exit' : 'ic:sharp-fullscreen'"
                size="45"
                style="color: gray"
                @click="setFullScreen"
              />
            </div>

            <!-- Display iframe if type is 'iframe' -->
            <div v-else-if="product.type === 'iframe'" class="flex items-center w-full h-full">
              <nuxt-img
                src="/images/contents/background.jpg"
                layout="fill"
                class="absolute top-0 left-0 w-full h-full"
                alt="Background Image"
              />
              <div class="relative w-full aspect-[16/9]">
                <iframe
                  class="absolute top-0 left-0 w-full h-full"
                  :src="`${product.url}?rel=0&enablejsapi=1`"
                  title="YouTube video player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                />
              </div>
              <Icon
                class="absolute bottom-0 right-0 cursor-pointer"
                :name="isFullScreen ? 'ic:baseline-fullscreen-exit' : 'ic:sharp-fullscreen'"
                size="45"
                style="color: gray"
                @click="setFullScreen"
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <button class="m-3" @click="goToNext">
        <Icon name="ic:baseline-arrow-circle-right" size="30" style="color: gray" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const mySwiperRef = ref(null);
const fullscreenDiv = ref(null);
const isFullScreen = ref(false);

const products = ref([
  {
    id: '1',
    type: 'image',
    url: 'clinic1.jpg',
  },
  {
    id: '2',
    type: 'image',
    url: 'clinic2.jpg',
  },
  {
    id: '3',
    type: 'image',
    url: 'clinic3.jpg',
  },
  {
    id: '4',
    type: 'iframe',
    url: 'https://www.youtube.com/embed/D7Q4r3r_pXw',
  },
]);

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
    // Request fullscreen for the specific div
    fullscreenDiv.value.requestFullscreen();
    isFullScreen.value = true;
  } else if (document.exitFullscreen) {
    // Exit fullscreen mode
    document.exitFullscreen();
    isFullScreen.value = false;
  }
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
</script>

<style scoped>
.swiper-pagination {
  position: absolute;
  top: -5px;
  left: 0;
  width: 100%;
  height: 10px;
  display: flex;
  justify-content: center;
  z-index: 2000;
}

.swiper-pagination-bullet .swiper-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active {
  width: 30px !important;
  border-radius: 10px !important;
}
</style>
