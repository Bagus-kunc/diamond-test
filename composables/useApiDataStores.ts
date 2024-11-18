import { defineStore } from 'pinia';

// Tipe untuk state
interface ApiDataState {
  data: any | null;
  error: Error | null;
  loading: boolean;
}

export const useApiDataStore = defineStore('apiData', {
  state: (): ApiDataState => ({
    data: null,
    error: null,
    loading: false,
  }),
  actions: {
    async fetchData(): Promise<void> {
      if (this.data) {
        console.log('Data already fetched, skipping API call');
        return;
      }

      this.loading = true;
      try {
        const res = await useFetchApi('GET', 'json');
        this.data = res;
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err;
        } else {
          this.error = new Error('Unknown error occurred');
        }
        console.error('Fetch error:', this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});
