import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/header";
import PageNotFound from "../pages/404/PageNotFound";
import Dashboard from "../pages/dasahboard/Dashboard";
import { InvoiceGenerator } from "../pages/invoice";
import { AddProducts } from "../pages/products/addProduct";
import { DashAllCollection } from "../pages/products/all-collections";
import ProtectedRoute from "../ProtectedRoutes";
import { AuthContext } from "./auth/AuthProvider";
import { AddCustomerDetails } from "../pages/customers";

function Router() {
  const { isAuthenticated } = useContext(AuthContext);
  const isLogin = new URLSearchParams(window.location.search).has("isLogin");
  return (
    <Layout isLogin={isLogin || isAuthenticated}>
      <div className="app-layout !bg-transparent">
        <main className="app-content mt-6">
          <Routes>
            {/* Protected routes block */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/products/all-products"
                element={<DashAllCollection />}
              />
              <Route path="/products/add-products" element={<AddProducts />} />
              <Route path="/customers" element={<AddCustomerDetails />} />
              <Route path="/*" element={<PageNotFound />} />
              <Route path="/invoice/generate" element={<InvoiceGenerator />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Layout>
  );
}

export default Router;
