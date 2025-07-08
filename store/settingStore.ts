// ***using zusland since the divvi/mobile already as redux initialize
import { create } from 'zustand';

interface SettingsState {
  country: string;
  hideBalance: boolean;
  setCountry: (country: string) => void;
  toggleHideBalance: () => void;
  setHideBalance: (value: boolean) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  
  country: 'Kenya',
  hideBalance: false,

  
  setCountry: (country: string) => set({ country }),

  toggleHideBalance: () =>
    set((state) => ({ hideBalance: !state.hideBalance })),

  setHideBalance: (value: boolean) => set({ hideBalance: value }),

  
  reset: () => set({ country: 'Kenya', hideBalance: false }),
}));
