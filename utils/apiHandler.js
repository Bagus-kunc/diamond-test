// Fungsi untuk mengambil data dari API eksternal
export const fetchApiData = async (url) => {
  const config = useRuntimeConfig();
  try {
    const res = await fetch(config.public.API_URL + url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    return { success: true, data }; // Mengembalikan data dalam format yang lebih jelas
  } catch (err) {
    console.error('Failed to fetch data from API:', err);
    return { success: false, error: err.message }; // Mengembalikan error dengan pesan yang jelas
  }
};

// Fungsi untuk menyimpan data ke dalam cache
export const cacheApiResponse = async (url, data) => {
  const cacheName = 'diamond-api-cache';
  try {
    const cache = await caches.open(cacheName);
    const response = new Response(JSON.stringify(data), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    });
    await cache.put(url, response);
    console.log('Data disimpan di cache');
  } catch (error) {
    console.error('Gagal menyimpan data ke cache:', error);
  }
};

// Fungsi untuk mengambil data dari cache
export const getCachedApiResponse = async (url) => {
  const cacheName = 'diamond-api-cache';
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(url); // Menghapus mode CORS
    if (cachedResponse) {
      const data = await cachedResponse.json();
      console.log('Data dari cache:', data);
      return { success: true, data }; // Format data lebih jelas
    } else {
      console.log('Tidak ada data di cache untuk URL ini');
      return { success: false, data: null }; // Jika tidak ada data di cache
    }
  } catch (error) {
    console.error('Gagal mengakses cache:', error);
    return { success: false, error: error.message }; // Mengembalikan error jika gagal mengakses cache
  }
};

// Fungsi untuk memeriksa dan mengambil data dari cache, jika ada
export const checkCacheAndFetchData = async (url) => {
  const cachedData = await getCachedApiResponse(url);
  if (cachedData.success && cachedData.data) {
    console.log('Mengambil data dari cache:', cachedData.data);
    return cachedData.data;
  } else {
    console.log('Cache kosong, mengambil data dari API...');
    const apiData = await fetchApiData(url);
    if (apiData.success) {
      await cacheApiResponse(url, apiData.data); // Simpan data ke cache
      return apiData.data;
    } else {
      return null; // Mengembalikan null jika API juga gagal
    }
  }
};
