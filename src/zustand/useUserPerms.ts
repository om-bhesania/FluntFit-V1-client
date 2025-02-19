import { create } from "zustand";

interface UserPermsState {
  permissions: Permissions | null;
  loading: boolean;
  error: string | null;
  setPermissions: (permissions: Permissions | null) => void;
  hasPermission: (module: string, action: any) => boolean;
  hasFullAccess: (module: string) => boolean;
  getAccessibleModules: () => string[];
  reset: () => void;
}

const useUserPerms = create<UserPermsState>((set, get) => ({
  permissions: null,
  loading: false,
  error: null,

  setPermissions: (permissions) => {
    set({ permissions, loading: false, error: null });
  },

  hasPermission: (module, action) => {
    const state: any = get();
    return state.permissions?.module?.[module]?.[action] ?? false;
  },

  hasFullAccess: (module) => {
    const state: any = get();
    const modulePerms = state.permissions?.module?.[module];
    if (!modulePerms) return false;

    return (
      !!modulePerms.read &&
      !!modulePerms.write &&
      !!modulePerms.update &&
      !!modulePerms.delete
    );
  },

  getAccessibleModules: () => {
    const state: any = get();
    if (!state.permissions?.module) return [];

    return Object.keys(state.permissions.module).filter((module) =>
      Object.values(state.permissions.module[module]).some((value) => value)
    );
  },

  reset: () => {
    set({
      permissions: null,
      loading: false,
      error: null,
    });
  },
}));

export default useUserPerms;
