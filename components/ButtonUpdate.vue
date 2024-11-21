<template>
  <div>
    <Button
      id="updateButton"
      class="btn-update w-full px-5 mt-2"
      @click="updateCache"
    >
      Update
    </Button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoading = ref(false);

const updateCache = () => {
  isLoading.value = true;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        action: 'update-cache',
      });
    });
  }
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('Cache telah diperbarui!');
      isLoading.value = false;
    }
  });
}
</script>

<style scoped>
.btn-update {
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
}

.btn-update:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-image {
  width: 100px;
  height: auto;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
