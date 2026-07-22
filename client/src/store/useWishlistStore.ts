import { create } from 'zustand';

interface WishlistState {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  productIds: [],
  toggleWishlist: (productId) =>
    set((state) => ({
      productIds: state.productIds.includes(productId)
        ? state.productIds.filter((id) => id !== productId)
        : [...state.productIds, productId],
    })),
}));
