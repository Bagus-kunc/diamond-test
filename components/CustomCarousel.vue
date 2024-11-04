<template>
  <div class="flex justify-center w-full h-full mt-4 ml-4 card">
    <Carousel
      :value="products"
      :numVisible="1"
      :numScroll="1"
      :showIndicators="false"
      class="h-full"
      contentClass="max-h-[110vh] max-w-[110vh]"
    >
      <template #item="{ data }">
        <div class="flex items-center justify-center h-full m-2 border rounded">
          <img
            :src="`/assets/images/contents/${data.image}`"
            alt="Contents"
            class="object-cover w-full h-full"
          />
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import { ref } from "vue";

const products = ref([
  {
    id: "1000",
    image: "clinic1.jpg",
  },
  {
    id: "2000",
    image: "clinic2.jpg",
  },
  {
    id: "3000",
    image: "clinic3.jpg",
  },
]);
</script>
