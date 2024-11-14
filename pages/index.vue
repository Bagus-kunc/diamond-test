<template>
  <div
    class="relative max-h-screen bg-cover bg-center"
    style="font-family: 'Lato', sans-serif"
    :style="{ backgroundImage: `url(${BgDiamond})` }"
  >
    <!-- <Header class="mb-10" /> -->
    <div class="absolute bg-[url('/assets/images/bg-transparent.png')] bg-cover bg-center opacity-30 h-full w-full" />

    <div class="flex flex-col items-center h-screen">
      <div class="flex flex-col gap-3 items-center justify-center mt-[29px] z-20">
        <nuxt-img src="/images/logo-img.png" class="md:w-[350px] sm:w-[250px] w-[200px] h-auto" alt="Header Logo" />

        <h1 class="text-[#757575] md:text-[28px] sm:text-[20px] text-[16px] mb-[40px] mt-[20px]">
          Enter the 4-digit passcode to enter
        </h1>

        <PinInput v-model="valuePin" :length="4" :clear-field="true" class="mb-[70px]" :disabled="isLoading" />
      </div>

      <div class="relative flex flex-col justify-center items-center mb-10">
        <Button
          :label="isLoading ? 'Processing...' : 'Masuk'"
          class="bg-[#000080] border-none text-white md:w-[24rem] w-[18rem] py-3 hover:opacity-85 rounded-lg disabled:opacity-50"
          :disabled="isLoading || !isValidPin"
          :loading="isLoading"
          @click="handlePin"
        />

        <p v-if="error" class="absolute -top-12 text-red-500 mt-2 text-sm">{{ error }}</p>

        <p class="md:text-[16px] sm:text-[12px] text-[10px] mt-1 text-[#757575]">
          If there is a problem with the login process please contact
          <span class="font-bold">administator@gmail.com</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import PinInput from '../components/PinInput.vue';
import BgDiamond from '~/assets/images/bg-diamond.jpg';
import useFetchApi from '~/composables/useFetchApi';

const valuePin = ref('');
const isLoading = ref(false);
const error = ref('');
const router = useRouter();

const isValidPin = computed(() => valuePin.value.length === 4);

definePageMeta({
  layout: 'dashboard',
});

defineComponent({
  components: {
    PinInput,
  },
});

const goToHomepage = () => {
  router.push('/dashboard');
};

const handlePin = async () => {
  if (!isValidPin.value || isLoading.value) return;

  isLoading.value = true;
  error.value = '';

  try {
    const response = await useFetchApi('POST', 'user_pin', {
      body: { pin: parseInt(valuePin.value) },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status) {
      // console.log('Berhasil');
      goToHomepage();
    }
  } catch (err) {
    console.log('Error: Unable to verify PIN', err);
    error.value = err?._data.message || '';
    valuePin.value = '';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
