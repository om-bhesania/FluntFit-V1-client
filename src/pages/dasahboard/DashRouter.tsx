import { Route, Routes } from "react-router-dom";
import PageNotFound from "../404/PageNotFound";
import { AddProducts } from "../products/addProduct";
import { DashAllCollection } from "../products/all-collections";

function DashRouter() {
  return (
    <Routes>
      <Route path="add-products" element={<AddProducts />} />
      <Route path="all-collections" element={<DashAllCollection />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default DashRouter;
