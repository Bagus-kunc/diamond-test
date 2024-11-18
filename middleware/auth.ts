type VerifyTokenResponse = {
  status: number;
  data: {
    valid: boolean;
  };
};

const isTokenverify = ref(false);

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
      if (to.path !== '/') {
        // Menambahkan penundaan untuk memberi waktu bagi rendering halaman
        setTimeout(() => {
          navigateTo('/');
        }, 500); // Penundaan 500ms
      }
      return;
    }

    try {
      const response = await $fetch<VerifyTokenResponse>('/api/verify-token', {
        method: 'POST',
        body: { token: authToken },
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.status || !response.data?.valid) {
        if (to.path !== '/') {
          setTimeout(() => {
            navigateTo('/');
          }, 500); // Penundaan 500ms
        }
      }
      isTokenverify.value = true;
    } catch (err) {
      console.error('Error while verifying token', err);
      if (to.path !== '/') {
        setTimeout(() => {
          navigateTo('/');
        }, 500); // Penundaan 500ms
      }
    }
  }
});
