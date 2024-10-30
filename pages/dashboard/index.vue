<template>
  <div class="sticky top-0 z-10 bg-white shadow-md">
    <div class="flex items-center justify-between p-4">
      <div>
        <img
          src="../../assets/images/logo.png"
          class="h-20"
          alt="Header Logo"
        />
      </div>
      <div>
        <ul class="flex space-x-8 text-gray-700">
          <li class="cursor-pointer hover:text-blue-500">ANTIAGING</li>
          <li class="cursor-pointer hover:text-blue-500">WELLNESS</li>
          <li class="cursor-pointer hover:text-blue-500">BEAUTY</li>
          <li class="cursor-pointer hover:text-blue-500">CERTIFICATIONS</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="flex">
    <MenuSideBar />
    <CustomCarousel />
    <div></div>
  </div>
</template>
<script setup>
import Header from "~/components/Header.vue";
import MenuSideBar from "~/components/MenuSideBar.vue";
import CustomCarousel from "~/components/CustomCarousel.vue";

defineComponent({
  components: {
    Header,
    MenuSideBar,
    CustomCarousel,
  },
});
</script>
