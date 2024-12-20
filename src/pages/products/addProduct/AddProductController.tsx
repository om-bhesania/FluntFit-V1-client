// components/AddProduct/AddProductController.jsx

import { useState } from "react";
import useToast from "../../../hooks/useToast";
import { AddProductApi } from "../ProductsApi";
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

  const handleSKUGeneration = (setFieldValue: any) => {
    const randomSKU = `SKU-${Math.floor(Math.random() * 100000)}`;
    setFieldValue("sku", randomSKU);
  };
  const { notify } = useToast();

  const getFiles = (files: any) => {
    console.log("firstname", files);
  };

  const handleSubmit = async (values: any) => {
    try {
      await AddProductApi(values, notify);
      // await uploadFilesToImgur(values.mediaContent);
    } catch (error) {
      console.error("Error submitting form:", error);
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
    />
  );
};

export default AddProductController;
