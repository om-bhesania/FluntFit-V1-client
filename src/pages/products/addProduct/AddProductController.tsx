// components/AddProduct/AddProductController.jsx

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

  const getFiles = () => {};

  const handleSubmit = async (values: any) => {
    try {
      await AddProductApi(values, notify);
      await uploadFilesToImgur(values.mediaContent);
    } catch (error) {
      notify("Error submitting form", { type: "error" });
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
    />
  );
};

export default AddProductController;
