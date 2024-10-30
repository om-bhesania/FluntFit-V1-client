import { Route, Routes } from "react-router-dom";
import PageNotFound from "../pages/404/PageNotFound";
import { Login } from "../pages/auth/login";
import Dashboard from "../pages/dasahboard/Dashboard";
import { Home } from "../pages/home";
import { AddProducts } from "../pages/products/addProduct";
import { DashAllCollection } from "../pages/products/all-collections";

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="add-products" element={<AddProducts />} />
      <Route path="all-collections" element={<DashAllCollection />} />
      {/* Add more nested routes here as needed */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;