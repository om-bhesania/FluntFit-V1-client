// components/AddProduct/AddProductController.jsx

import { useState } from "react";
import useToast from "../../hooks/useToast";
import { AddCustomersApi } from "./CustomerApis";
import AddProductComponent from "./CustomersComponent";

const AddProductController = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { notify } = useToast();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await AddCustomersApi(data, notify);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  // const deleteAllProducts = async () => {
  //   try {
  //     await DeleteAllProductsApi(notify);
  //   } catch (error) {
  //     notify("Error deleting products", { type: "error" });
  //   }
  // };
  return <AddProductComponent handleSubmit={handleSubmit} loading={loading} />;
};

export default AddProductController;
