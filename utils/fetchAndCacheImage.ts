export const fetchAndCacheImage = async (url: string) => {
  const menuStore = useMenuStore();

  const CACHE_NAME = `diamond-clinic-cache-v2 - ${self.location.origin}`;

  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
      console.log('Image found in cache.');
      return cachedResponse.url;
    }

    console.log('Fetching image from network...');
    menuStore.setImagesLoaded(true);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await cache.put(url, response.clone());
    return response.url;
  } catch (error) {
    console.error('Error fetching or caching image:', error);
    return null;
  }
};
