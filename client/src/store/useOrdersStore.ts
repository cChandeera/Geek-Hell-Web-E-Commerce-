import { create } from 'zustand';

interface OrdersState {
  orderIds: string[];
  setOrders: (orderIds: string[]) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orderIds: [],
  setOrders: (orderIds) => set({ orderIds }),
}));
