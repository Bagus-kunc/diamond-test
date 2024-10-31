<template>
  <div class="h-screen bg-[#fffefa]">
    <Header class="mb-10" />
    <div class="flex flex-col items-center justify-center">
      <h1 class="font-semibold text-5xl mb-[50px]">PIN</h1>
      <OtpInput
        v-model="value"
        :length="4"
        :clear-field="true"
        class="mb-[70px]"
      />
      <Button
        label="Submit"
        severity="success"
        rounded
        class="bg-[#18af70] rounded-[20px] border-none text-[#fffeff] mx-auto px-10 py-1 shadow-md shadow-[#268960] text-[20px]"
        @click="goToHomepage"
      />
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Header from "~/components/Header.vue";
import OtpInput from "../components/OtpInput.vue";

const value = ref("");
const router = useRouter();

definePageMeta({
  layout: "dashboard",
});

defineComponent({
  components: {
    Button,
    OtpInput,
    Header,
  },
});

const goToHomepage = () => {
  router.push("/dashboard");
};
</script>
