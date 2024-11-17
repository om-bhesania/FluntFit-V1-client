export const baseUrl = "https://flauntfit-v1-server.onrender.com/v1/";
const apiUrls = {
  baseUrl: baseUrl,
  users: {
    get: "users/get",
    post: "users/post",
  },
  auth: {
    login: "auth/login",
    register: "auth/register",
  },
  products: {
    get: "products/",
    post: "products/",
    put: "products/",
    delete: "products/",
  },
};
export default apiUrls;
