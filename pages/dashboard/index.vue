<template>
  <div class="flex w-full">
    <div>
      <Card class="h-[200px] w-[250px] ml-4 mt-4 shadow-lg">
        <template #content>
          <div class="flex flex-col items-center gap-1">
            <div class="mb-4">
              <img
                src="../../assets/images/logo.png"
                class="h-20"
                alt="Header Logo"
              />
            </div>
            <div>
              <ul class="grid grid-cols-2 gap-4 text-center text-gray-700">
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
          </div>
        </template>
      </Card>

      <MenuSideBar />
    </div>

    <CustomCarousel />
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
