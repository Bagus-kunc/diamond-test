import { useCookie, useRequestHeaders } from '#app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isClient = process.client;

  const authToken = useCookie('TOKEN').value

  if (authToken && to.path === '/') {
    return navigateTo('/dashboard');
  }

  if (!authToken && to.path !== '/') {
    return navigateTo('/');
  }
});
