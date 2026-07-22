import { create } from 'zustand';
import { ProductItem } from '../types';

interface ProductsState {
  products: ProductItem[];
  selectedProduct: ProductItem | null;
  setProducts: (products: ProductItem[]) => void;
  setSelectedProduct: (product: ProductItem | null) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  selectedProduct: null,
  setProducts: (products) => set({ products }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
}));
