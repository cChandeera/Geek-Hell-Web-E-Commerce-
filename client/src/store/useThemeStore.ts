import { create } from 'zustand';

export type FranchiseTheme = 'marvel' | 'dc' | 'default';

interface ThemeState {
  franchiseTheme: FranchiseTheme;
  setFranchiseTheme: (theme: FranchiseTheme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  franchiseTheme: 'default',
  setFranchiseTheme: (franchiseTheme) => set({ franchiseTheme }),
}));
