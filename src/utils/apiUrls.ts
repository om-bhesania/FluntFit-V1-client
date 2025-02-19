// export const baseUrl = "https://flauntfit-v1-server.onrender.com/v1/";
export const baseUrl = "http://localhost:3012/v1/";
const apiUrls = {
  baseUrl: baseUrl,
  users: {
    get: "users/",
    post: "users/post",
  },
  auth: {
    login: "auth/login",
    register: "auth/register",
    verify: "auth/verify-token",
    logout: "auth/logout",
    ping: "auth/ping",
    permissions: "permissions/get-all",
    currentUserPerms: "permissions/current-user-permissions",
  },
  products: {
    get: "products",
    post: "products",
    put: "products",
    delete: "products/delete",
    deleteAll: "products/delete-all",
    fileUpload: "upload",
  },
  customer: {
    get: "customers",
    post: "customers",
  },
  employee: {
    create: "auth/register",
    get: "users",
    update: "users",
  },
  invoice: {
    post: "invoices",
    get: "invoices",
    delete: "invoices",
  },
  roles: {
    get: "roles",
  },
};
export default apiUrls;
