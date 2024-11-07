<template>
  <div
    class="relative max-h-screen bg-cover bg-center"
    style="font-family: 'Lato', sans-serif"
    :style="{ backgroundImage: 'url(' + bg + ')' }"
  >
    <!-- <Header class="mb-10" /> -->
    <div
      class="absolute bg-[url('/assets/images/bg-transparent.png')] bg-cover bg-center opacity-30 h-full w-full"
    ></div>

    <div class="flex flex-col items-center h-screen">
      <div
        class="flex flex-col gap-3 items-center justify-center mt-[29px] z-20"
      >
        <img
          src="./../assets/images/logo.png"
          class="md:w-[350px] sm:w-[250px] w-[200px] h-auto"
          alt="Header Logo"
        />

        <h1
          class="text-[#757575] md:text-[28px] sm:text-[20px] text-[16px] mb-[40px] mt-[20px]"
        >
          Enter the 4-digit passcode to enter
        </h1>

        <PinInput
          v-model="value"
          :length="4"
          :clear-field="true"
          class="mb-[70px]"
        />
      </div>

      <div class="flex flex-col justify-center items-center mb-10">
        <Button
          label="Masuk"
          class="bg-[#000080] border-none text-white md:w-[24rem] w-[18rem] py-3 hover:opacity-85 rounded-lg"
          @click="goToHomepage"
        />
        <p
          class="md:text-[13px] sm:text-[12px] text-[10px] mt-1 text-[#757575]"
        >
          If there is a problem with the login process please contact
          <span class="font-bold">administator@gmail.com</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Header from "~/components/Header.vue";
import PinInput from "../components/PinInput.vue";
import BgDiamond from "~/assets/images/bg-diamond.jpg";

const bg = ref("");

const saveBg = () => {
  localStorage.setItem("bgPin", BgDiamond);

  bg.value = localStorage.getItem("bgPin");
};

const value = ref("");
const router = useRouter();

definePageMeta({
  layout: "dashboard",
});

defineComponent({
  components: {
    Button,
    PinInput,
    Header,
  },
});

const goToHomepage = () => {
  router.push("/dashboard");
};

onMounted(() => {
  saveBg();
});
</script>
