import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    selected: null as number | null,
    cover: ('' as string) || '',
  }),
  actions: {
    setSelected(id: number) {
      this.selected = id;
    },
    setCover(coverItem: string) {
      this.cover = coverItem;
    },
  },
});
