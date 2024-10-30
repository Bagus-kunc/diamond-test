<template>
  <div class="h-screen bg-[#fffefa]">
    <Header class="mb-10" />
    <div class="flex flex-col items-center justify-center">
      <h1 class="font-semibold text-5xl mb-[50px]">OTP</h1>
      <div class="text-center mb-[50px]">
        <p class="">
          Kami telah mengirimkan akses OTP ke email
          <span class="font-semibold text-red-600"
            >septiyana.dewi@talenavi.com</span
          >
        </p>
        <p>Silahkan masukkan di kolom bawah</p>
      </div>
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
      />
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import Button from "primevue/button";
import Header from "~/components/Header.vue";
import OtpInput from "../components/OtpInput.vue";

const value = ref("");

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
</script>
