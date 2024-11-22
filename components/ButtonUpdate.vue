<template>
  <div class="px-1">
    <Toast />
    <Button
      id="updateButton"
      class="btn-update w-full px-5 mt-2 border-none"
      :class="isLoading ? '!text-black' : className"
      :disabled="isLoading"
      @click="updateCache"
    >
      {{ label }}
    </Button>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const Success = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Cache has been updated', life: 3000 });
};

const Progress = () => {
  toast.add({ severity: 'info', summary: 'Updating...', detail: 'Cache update in progress', life: 3000 });
};

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  },
});

const isLoading = ref(false);

const updateCache = () => {
  isLoading.value = true;

  Progress();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({
        action: 'update-cache',
      });
    });
  }

  emit('click', true);

  setTimeout(() => {
    Success();
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
.btn-update {
  background-color: #4caf50;
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
