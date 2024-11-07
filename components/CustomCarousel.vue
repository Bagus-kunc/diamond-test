<template>
  <div class="flex justify-center w-full h-full mt-4 ml-4 card">
    <div class="flex justify-center">
      <button class="m-3" @click="goToPrev">
        <Icon name="ic:baseline-arrow-circle-left" size="30" style="color: gray" />
      </button>
      <Swiper
        class="max-h-[90dvh] max-w-[100dvh]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 8000, disableOnInteraction: false }"
        :effect="'creative'"
        :creative-effect="{
          prev: { shadow: false, translate: ['-20%', 0, -1] },
          next: { translate: ['100%', 0, 0] },
        }"
        @swiper="onSwiper"
        @slide-change="controlVideo"
      >
        <SwiperSlide v-for="product in products" :key="product.id">
          <div class="relative flex items-center justify-center h-full rounded">
            <!-- Display image if type is 'image' -->
            <nuxt-img
              v-if="product.type === 'image'"
              :src="`/images/contents/${product.url}`"
              alt="Content Image"
              class="object-cover"
              format="webp"
            />

            <!-- Display iframe if type is 'iframe' -->
            <div v-else-if="product.type === 'iframe'" class="relative w-full aspect-[16/9]">
              <nuxt-img
                src="/images/contents/background.jpg"
                layout="fill"
                class="absolute top-0 left-0 object-cover w-full h-full"
                alt="Background Image"
              />
              <iframe
                class="absolute top-0 left-0 w-full h-full"
                :src="`${product.url}?rel=0&enablejsapi=1`"
                title="YouTube video player"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
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
import 'swiper/swiper-bundle.css';

const mySwiperRef = ref(null);

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
</script>
