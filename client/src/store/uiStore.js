import { create } from 'zustand';

export const useUiStore = create((set) => ({
  detailItem: null,
  searchOpen: false,
  setDetailItem: (item) => set({ detailItem: item }),
  closeDetail: () => set({ detailItem: null }),
  setSearchOpen: (open) => set({ searchOpen: open }),
}));
