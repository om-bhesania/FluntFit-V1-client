import { create } from "zustand";

interface InvoiceDataState {
  data: Record<string, any> | any[];
  setData: (data: Record<string, any> | any[]) => void;
}

export const useInvoiceData = create<InvoiceDataState>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  getData: () => {
    const state = useInvoiceData.getState();
    return state.data;
  },
}));
