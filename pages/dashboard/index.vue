<template>
  <div class="w-full">
    <div class="sticky z-10 flex items-center justify-center gap-1 p-2 shadow-lg">
      <div class="min-w-[220px] flex justify-center">
        <nuxt-img src="/images/logo.png" class="h-14" alt="Header Logo" />
      </div>
      <ul class="flex justify-center w-full gap-6 text-gray-700">
        <li class="transition-colors duration-200 cursor-pointer hover:text-blue-500">ANTIAGING</li>
        <li class="transition-colors duration-200 cursor-pointer hover:text-blue-500">WELLNESS</li>
        <li class="transition-colors duration-200 cursor-pointer hover:text-blue-500">BEAUTY</li>
        <li class="transition-colors duration-200 cursor-pointer hover:text-blue-500">CERTIFICATIONS</li>
      </ul>
    </div>
    <div class="flex">
      <Sidebar />
      <CustomCarousel />
    </div>
  </div>
</template>
<script setup>
import Sidebar from '~/components/Sidebar.vue';
import CustomCarousel from '~/components/CustomCarousel.vue';

defineComponent({
  components: {
    Sidebar,
    CustomCarousel,
  },
});
</script>
