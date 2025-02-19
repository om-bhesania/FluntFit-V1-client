// zustand/index.ts
import { create } from "zustand";

// Define the invoice store state and methods
export const useInvoiceStore: any = create<{
  invoices: any[];
  addInvoice: (invoice: any) => void;
  getInvoiceById: (id: string) => any | undefined;
}>((set) => ({
  invoices: [],
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [...state.invoices, invoice] })),
  getInvoiceById: (id) => {
    const state = useInvoiceStore.getState();
    return state.invoices.find((invoice: any) => invoice._id === id);
  },
}));

interface Permissions {
  [key: string]: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
  };
}

interface UserState {
  id: string;
  email: string;
  username: string;
  phone: number;
  address: string;
  roleId: string;
  roleName: string;
  permissions: Permissions;
  token: string;
  setUser: (data: UserState) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: "",
  email: "",
  username: "",
  phone: 0,
  address: "",
  roleId: "",
  roleName: "",
  permissions: {},
  token: "",
  setUser: (data) => set(() => ({ ...data })),
  clearUser: () =>
    set(() => ({
      id: "",
      email: "",
      username: "",
      phone: 0,
      address: "",
      roleId: "",
      roleName: "",
      permissions: {},
      token: "",
    })),
}));
