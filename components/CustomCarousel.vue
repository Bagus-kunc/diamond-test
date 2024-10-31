<template>
  <div class="w-full mt-4 ml-4 card">
    <Carousel
      :value="products"
      :numVisible="1"
      :numScroll="1"
      :showIndicators="false"
    >
      <template #item="{ data }">
        <div class="m-2 border rounded">
          <img :src="`/assets/images/contents/${data.image}`" alt="Contents" />
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
