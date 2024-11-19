export default defineNuxtRouteMiddleware(async () => {
  const TOKEN = useCookie('TOKEN');

  if (!TOKEN.value) {
    return navigateTo('/');
  }
});
