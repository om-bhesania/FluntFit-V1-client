import { Route, Routes } from "react-router-dom";
import Layout from "../components/header";
import PageNotFound from "../pages/404/PageNotFound";
import Dashboard from "../pages/dasahboard/Dashboard";
import { AddProducts } from "../pages/products/addProduct";
import { DashAllCollection } from "../pages/products/all-collections";
import ProtectedRoute from "../ProtectedRoutes";

function Router() {
  return (
    <Layout>
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
              <Route path="/*" element={<PageNotFound />} />
            </Route>

    
          </Routes>
        </main>
      </div>
    </Layout>
  );
}

export default Router;
