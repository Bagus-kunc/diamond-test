import { useCookie, useRequestHeaders } from '#app';

type VerifyTokenResponse = {
  status: number;
  data: {
    valid: boolean;
  };
};

const isTokenVerified = ref(false);

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Mengecek apakah middleware berjalan di sisi server atau klien
  const isClient = process.client;
  const authToken = isClient
    ? useCookie('TOKEN').value
    : useRequestHeaders().cookie?.split(';').find(cookie => cookie.trim().startsWith('TOKEN='))?.split('=')[1];

  // Jika ada token dan tujuan halaman adalah '/', arahkan ke dashboard atau halaman lain
  if (authToken) {
    if (to.path === '/') {
      return navigateTo('/dashboard'); // Ganti dengan halaman tujuan Anda, seperti '/dashboard'
    }
  }

  // Jika tidak ada token, arahkan ke halaman login
  if (!authToken) {
    if (to.path !== '/') {
      return navigateTo('/'); // Arahkan ke halaman login
    }
    return; // Jika sudah di halaman login, tidak perlu melakukan apa-apa
  }

  // Verifikasi token dengan API di sisi server atau klien
  try {
    const response = await $fetch<VerifyTokenResponse>('/api/verify-token', {
      method: 'POST',
      body: { token: authToken },
      headers: { 'Content-Type': 'application/json' },
    });

    // Jika token tidak valid, arahkan ke halaman login
    if (!response?.data?.valid) {
      console.warn('Token is invalid, redirecting to login.');
      return navigateTo('/'); // Arahkan ke halaman login
    }

    // Tandai token valid
    isTokenVerified.value = true;

    // Jika token valid, lanjutkan ke halaman tujuan
    return;
  } catch (err) {
    console.error('Error while verifying token:', err);
    // Jika terjadi error dalam verifikasi token, arahkan ke halaman login
    return navigateTo('/');
  }
});
