<template>
  <div class="w-full mt-4 ml-4 card">
    <Carousel
      :value="products"
      :numVisible="1"
      :numScroll="1"
      :showIndicators="false"
    >
      <template #item>
        <div
          class="p-4 m-2 border rounded border-surface-200 dark:border-surface-700"
        >
          <img src="../assets/images/contents/1c.jpg" alt="Contents" />
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
    code: "f230fh0g3",
    name: "Bamboo Watch",
    description: "Product Description",
    image: "bamboo-watch.jpg",
    price: 65,
    category: "Accessories",
    quantity: 24,
    inventoryStatus: "INSTOCK",
    rating: 5,
  },
  {
    id: "2000",
    code: "f230fh0g3",
    name: "Bamboo Watch",
    description: "Product Description",
    image: "bamboo-watch.jpg",
    price: 65,
    category: "Accessories",
    quantity: 24,
    inventoryStatus: "INSTOCK",
    rating: 5,
  },
  {
    id: "3000",
    code: "f230fh0g3",
    name: "Bamboo Watch",
    description: "Product Description",
    image: "bamboo-watch.jpg",
    price: 65,
    category: "Accessories",
    quantity: 24,
    inventoryStatus: "INSTOCK",
    rating: 5,
  },
]);
</script>
