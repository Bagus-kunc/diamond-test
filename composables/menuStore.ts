import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    selected: null as number | null,
  }),
  actions: {
    setSelected(id: number) {
      this.selected = id;
    },
  },
});
