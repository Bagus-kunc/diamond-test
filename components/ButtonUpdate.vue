<template>
  <div class="px-1">
    <Button
      id="updateButton"
      class="btn-update w-full px-5 mt-2 border-none"
      :class="isLoading ? '!text-black' : className"
      :disabled="isLoading"
      @click="updateCache"
    >
      {{ label }}
    </Button>

    <div v-if="isLoading" :class="notifClass" class="notif">
      <transition name="fade">
        <h1 key="loading-text" class="loading-text">{{ loadingMessage }}</h1>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['click', 'disabled']);

const isLoading = ref(false);
const loadingMessage = ref('Please wait...');
const notifClass = ref('bg-yellow-400');

const updateCache = () => {
  isLoading.value = true;
  loadingMessage.value = 'Updating Cache...';
  notifClass.value = 'bg-yellow-300';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        action: 'update-cache',
      });
    });
  }

  emit('click', true);

  setTimeout(() => {
    loadingMessage.value = 'Completed!';
    notifClass.value = 'bg-green-300';
    setTimeout(() => {
      emit('click', false);
      isLoading.value = false;
      window.location.reload();
    }, 1000);
  }, 4000);
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('Cache telah diperbarui!');
    }
  });
}
</script>

<style scoped>
.notif {
  position: fixed;
  right: 20px;
  top: 20px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}

.loading-text {
  font-size: 16px;
  color: white;
  font-weight: bold;
  transition: opacity 0.5s ease-in-out;
}

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
</style>
