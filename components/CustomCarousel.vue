<template>
  <div class="flex justify-center h-full relative ml-4 lg:w-full card">
    <div ref="fullscreenDiv" class="flex justify-center">
      <button class="m-3" @click="goToPrev">
        <Icon name="ic:baseline-arrow-circle-left" size="30" style="color: gray" />
      </button>
      <div class="relative">
        <div class="swiper-pagination" />
        <Icon
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
              </div>

              <!-- Display iframe if type is 'iframe' -->
              <div v-else-if="product.type === 'iframe'" class="flex items-center w-full h-full">
                <nuxt-img
                  src="/images/contents/background.jpg"
                  layout="fill"
                  class="top-0 left-0 w-full h-full"
                  alt="Background Image"
                />
                <div class="absolute w-full aspect-[16/9]">
                  <iframe
                    class="top-0 left-0 w-full h-full"
                    :src="`${product.url}?rel=0&enablejsapi=1`"
                    title="YouTube video player"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

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
const youtubeIframe = ref(null);
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
  display: flex;
  top: 6px;
  left: 0;
  width: 100%;
  height: 10px;
  z-index: 2000;
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
