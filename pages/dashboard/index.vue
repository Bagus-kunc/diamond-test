<template>
  <div class="w-full">
    <div
      class="mb-4 absolute top-2.5 left-[90px] rounded bg-white shadow-lg p-1"
    >
      <nuxt-img src="/images/logo.png" class="h-24" alt="Header Logo" />
    </div>
    <div class="flex items-center justify-center gap-1 p-5 shadow-lg">
      <ul class="flex gap-6 text-center text-gray-700">
        <li
          class="transition-colors duration-200 cursor-pointer hover:text-blue-500"
        >
          ANTIAGING
        </li>
        <li
          class="transition-colors duration-200 cursor-pointer hover:text-blue-500"
        >
          WELLNESS
        </li>
        <li
          class="transition-colors duration-200 cursor-pointer hover:text-blue-500"
        >
          BEAUTY
        </li>
        <li
          class="transition-colors duration-200 cursor-pointer hover:text-blue-500"
        >
          CERTIFICATIONS
        </li>
      </ul>
    </div>
    <div class="flex">
      <Sidebar />
      <CustomCarousel />
    </div>
  </div>
</template>
<script setup>
import Header from "~/components/Header.vue";
import Sidebar from "~/components/Sidebar.vue";
import CustomCarousel from "~/components/CustomCarousel.vue";

defineComponent({
  components: {
    Header,
    Sidebar,
    CustomCarousel,
  },
});
</script>
