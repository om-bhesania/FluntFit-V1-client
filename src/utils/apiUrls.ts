export const baseUrl = "https://flauntfit-v1-server.onrender.com/v1/";
// export const baseUrl = "http://localhost:3012/v1/";
const apiUrls = {
  baseUrl: baseUrl,
  users: {
    get: "users/get",
    post: "users/post",
  },
  auth: {
    login: "auth/login",
    register: "auth/register",
    verify: "auth/verify-token",
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
};
export default apiUrls;
