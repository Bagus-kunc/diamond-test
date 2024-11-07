<template>
  <div class="flex justify-center w-full h-full mt-4 ml-4 card">
    <Carousel
      :value="products"
      :numVisible="1"
      :numScroll="1"
      :showIndicators="false"
      contentClass="max-h-[110dvh] max-w-[110dvh]"
      @update:page="controlVideo"
    >
      <template #item="{ data }">
        <div class="relative flex items-center justify-center h-full m-2 rounded">
          <nuxt-img
            v-if="data.type == 'image'"
            :src="`/images/contents/${data.url}`"
            alt="Contents"
            class="object-cover"
            format="webp"
          />

          <div v-else-if="data.type == 'iframe'">
            <nuxt-img
              src="/images/contents/background.jpg"
              layout="fill"
              class="absolute top-0 left-0 object-cover w-full h-full"
              alt="Background Image"
            />
            <div class="absolute left-0 w-full aspect-[16/9] top-1/2 transform -translate-y-1/2">
              <iframe
                class="top-0 left-0 w-full h-full"
                :src="`${data.url}?rel=0&enablejsapi=1`"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              />
            </div>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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
