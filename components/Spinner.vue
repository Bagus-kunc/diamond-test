<!-- components/ReusableSpinner.vue -->
<template>
  <div v-if="isVisible" class="absolute flex justify-center items-center w-full h-full">
    <ProgressSpinner />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  duration: {
    type: Number,
    default: 1000, // Durasi dalam milidetik (default 1 detik)
  },
});

const isVisible = ref(true);

onMounted(() => {
  // Hentikan spinner setelah waktu yang ditentukan
  setTimeout(() => {
    isVisible.value = false;
  }, props.duration);
});
</script>

<style scoped>
/* Tambahkan style untuk spinner sesuai kebutuhan */
</style>
