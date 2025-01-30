// components/AddProduct/AddProductController.jsx

import { useState } from "react";
import uploadFilesToImgur from "../../../hooks/useFileUpload";
import useToast from "../../../hooks/useToast";
import { AddProductApi, DeleteAllProductsApi } from "../ProductsApi";
import AddProductComponent from "./AddProductComponent";

const AddProductController = ({
  isEdit,
  prefilledData,
  handleSaveEdit,
}: {
  isEdit?: boolean;
  prefilledData?: any[];
  handleSaveEdit?: (updatedProduct: any, data: any) => void;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const categories = [
    { value: "Men's wear", label: "Men's wear" },
    { value: "Women's wear", label: "Women's wear" },
    { value: "Unisex wear", label: "Unisex wear" },
  ];

  const subcategories = [
    { value: "Tshirts", label: "Tshirts" },
    { value: "Shirts", label: "Shirts" },
    { value: "Polos", label: "Polos" },
  ];

  const sizeOptions = [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
  ];

  const GSTOptions = [
    { value: "5%", label: "5%" },
    { value: "12%", label: "12%" },
    { value: "18%", label: "18%" },
    { value: "28%", label: "28%" },
  ];
  const InventoryOptions = [
    { value: "In Stock", label: "In Stock" },
    { value: "Out of Stock", label: "Out of Stock" },
    { value: "Discontinued", label: "Discontinued" },
    { value: "Coming Soon", label: "Coming Soon" },
  ];
  const handleSKUGeneration = (setFieldValue: any) => {
    const randomSKU = `SKU-${Math.floor(Math.random() * 100000)}`;
    setFieldValue("sku", randomSKU);
  };
  const { notify } = useToast();

  const getFiles = () => {};

  const handleSubmit = async (values: any): Promise<void> => {
    setLoading(true);
    try {
      await AddProductApi(values, notify);
      await uploadFilesToImgur(values.mediaContent);
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };
  const deleteAllProducts = async () => {
    try {
      await DeleteAllProductsApi(notify);
    } catch (error) {
      notify("Error deleting products", { type: "error" });
    }
  };
  return (
    <AddProductComponent
      categories={categories}
      subcategories={subcategories}
      handleSKUGeneration={handleSKUGeneration}
      handleSubmit={handleSubmit}
      isEdit={isEdit}
      prefilledData={prefilledData}
      handleSaveEdit={handleSaveEdit}
      getFiles={getFiles}
      deleteAllProducts={deleteAllProducts}
      sizeOptions={sizeOptions}
      GSTOptions={GSTOptions}
      InventoryOptions={InventoryOptions}
      loading={loading}
    />
  );
};

export default AddProductController;
