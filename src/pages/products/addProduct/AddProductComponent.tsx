import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CommonCard from "../../../components/cards/CommonCard";
import FileInput from "../../../components/fileUpload/FileInput";
import CommonInput from "../../../components/input/CommonInput";
import { darkSelectClassNames } from "../../../utils/utils";

interface AddProductComponentProps {
  categories: { value: string; label: string }[];
  sizeOptions: { value: string; label: string }[];
  subcategories: { value: string; label: string }[];
  GSTOptions: { value: string; label: string }[];
  InventoryOptions: { value: string; label: string }[];
  handleSKUGeneration: (
    setFieldValue: (field: string, value: any) => void
  ) => void;
  handleSubmit: (values: any) => void;
  isEdit?: boolean;
  prefilledData?: any;
  handleSaveEdit?: (updatedProduct: any, data: any) => void;
  getFiles: (files: any) => void;
  deleteAllProducts?: () => void;
  loading: boolean;
}

const AddProductComponent: React.FC<AddProductComponentProps> = ({
  categories,
  handleSKUGeneration,
  handleSubmit,
  isEdit = false,
  prefilledData,
  handleSaveEdit,
  // deleteAllProducts,Button
  sizeOptions,
  GSTOptions,
  InventoryOptions,
}) => {
  const initialValues =
    isEdit && prefilledData
      ? {
          id: prefilledData._id || "",
          productName: prefilledData?.productName || "",
          productDescription: prefilledData?.productDescription || "",
          category: prefilledData?.category || [],
          subcategory: prefilledData?.subcategory || "",
          productType: prefilledData?.productType || "",
          brand: prefilledData?.brand || "",
          price: prefilledData?.price || "",
          salePrice: prefilledData?.salePrice || "",
          sku: prefilledData?.sku || "",
          quantityInStock: prefilledData?.quantityInStock || "",
          mediaContent: prefilledData?.mediaContent || [],
          sizeOptions: prefilledData?.sizeOptions || [],
          careInstructions: prefilledData?.careInstructions || "",
          inventoryStatus: prefilledData?.inventoryStatus || [],
          gst: prefilledData?.gst || [],
          costPrice: prefilledData?.costPrice || "",
        }
      : {
          id: "",
          productName: "",
          productDescription: "",
          category: [],
          subcategory: "",
          productType: "",
          brand: "",
          price: "",
          salePrice: "",
          costPrice: "",
          gst: [],
          sku: "",
          quantityInStock: "",
          mediaContent: [],
          sizeOptions: [],
          careInstructions: "",
          inventoryStatus: [],
        };

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Product Name is required"),
    productDescription: Yup.string().max(
      1000,
      "Description can't exceed 1000 characters"
    ),
    category: Yup.string().required("Category is required"),
    subcategory: Yup.string().required("Subcategory is required"),
    productType: Yup.string().required("Product Type is required"),
    brand: Yup.string().required("Brand is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    costPrice: Yup.number()
      .required("Cost Price is required")
      .positive("Cost Price must be a positive number"),
    salePrice: Yup.number()
      .nullable()
      .positive("Sale Price must be positive")
      .max(
        Yup.ref("price"),
        "Sale Price should be less than or equal to Price"
      ),
    sku: Yup.string().required("SKU is required"),
    // quantityInStock: Yup.number()
    //   .required("Stock quantity is required")
    //   .integer("Stock quantity must be an integer")
    //   .min(0, "Quantity cannot be negative"),
    sizeOptions: Yup.array().min(1, "At least one size option is required"),
    careInstructions: Yup.string().max(
      500,
      "Care instructions can't exceed 500 characters"
    ),
    inventoryStatus: Yup.string().required("Inventory status is required"),
    gst: Yup.string().required("GST is required"),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm, setFieldValue }): Promise<void> => {
      try {
        // Process the media content files
        let uploadedUrls: any = [];
        if (values.mediaContent.length > 0) {
          // uploadedUrls = await uploadFilesToImgur(values.mediaContent);
          delete values.mediaContent;
          setFieldValue("mediaContent", uploadedUrls);
        }
        const formData = {
          productName: values.productName,
          productDescription: values.productDescription,
          category: values.category,
          subcategory: values.subcategory,
          productType: values.productType,
          brand: values.brand,
          price: Number(values.price),
          salePrice: Number(values.salePrice),
          sku: values.sku,
          // quantityInStock: Number(values.quantityInStock),
          quantityInStock: null,
          mediaContent: values.mediaContent, // Store the uploaded URLs instead of base64 files
          sizeOptions: values.sizeOptions,
          careInstructions: values.careInstructions,
          inventoryStatus: values.inventoryStatus,
          gst: values.gst,
          costPrice: Number(values.costPrice),
        };

        if (!isEdit) {
          await handleSubmit(formData);
        } else if (handleSaveEdit) {
          await handleSaveEdit(prefilledData._id, formData);
        }

        // Optionally reset all fields
        resetForm({
          values: {
            id: "",
            productName: "",
            productDescription: "",
            category: [],
            subcategory: "",
            productType: "",
            brand: "",
            price: "",
            salePrice: "",
            costPrice: "",
            gst: [],
            sku: "",
            quantityInStock: "",
            mediaContent: [],
            sizeOptions: [],
            careInstructions: "",
            inventoryStatus: [],
          },
        });
      } catch (error) {
        return;
      }
    },
  });

  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <CommonCard className="mb-6" title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CommonInput
              name="productName"
              value={formik.values.productName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Product Name *"
              variant="flat"
              description={
                formik.errors.productName && formik.touched.productName
                  ? String(formik.errors.productName)
                  : ""
              }
              isInvalid={
                !!(formik.errors.productName && formik.touched.productName)
              }
            />
            <Textarea
              name="productDescription"
              value={formik.values.productDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Product Description"
              variant="flat"
              title="Product Description"
            />
          </div>
        </CommonCard>
        <CommonCard className="mb-6" title="Category & Classification">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              classNames={darkSelectClassNames}
              variant="flat"
              onChange={(event) => {
                const selectedValue = event.target.value;
                formik.setFieldValue("category", selectedValue);
              }}
              value={formik.values.category}
              label="Category *"
              placeholder="Select Category"
              aria-label="Category"
              isInvalid={!!(formik.errors.category && formik.touched.category)}
              description={
                formik.errors.category && formik.touched.category
                  ? String(formik.errors.category)
                  : ""
              }
            >
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            <CommonInput
              name="subcategory"
              value={formik.values.subcategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Enter subcategory *"
              variant="flat"
              description={
                formik.errors.subcategory && formik.touched.subcategory
                  ? String(formik.errors.subcategory)
                  : ""
              }
              isInvalid={
                !!(formik.errors.subcategory && formik.touched.subcategory)
              }
            />
            <CommonInput
              name="productType"
              value={formik.values.productType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Product Type *"
              variant="flat"
              isInvalid={
                !!(formik.errors.productType && formik.touched.productType)
              }
              description={
                formik.errors.productType && formik.touched.productType
                  ? String(formik.errors.productType)
                  : ""
              }
            />
            <CommonInput
              name="brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Product Brand *"
              variant="flat"
              isInvalid={!!(formik.errors.brand && formik.touched.brand)}
              description={
                formik.errors.brand && formik.touched.brand
                  ? String(formik.errors.brand)
                  : ""
              }
            />
          </div>
        </CommonCard>
        <CommonCard className="mb-6" title="Pricing & Stock (₹)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CommonInput
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Selling Price *"
              variant="flat"
              description={
                formik.errors.price && formik.touched.price
                  ? String(formik.errors.price)
                  : ""
              }
              isInvalid={!!(formik.errors.price && formik.touched.price)}
            />
            <CommonInput
              name="salePrice"
              value={formik.values.salePrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Sale or Discounted Price (optional)"
              variant="flat"
              description={
                formik.errors.salePrice && formik.touched.salePrice
                  ? String(formik.errors.salePrice)
                  : ""
              }
              isInvalid={
                !!(formik.errors.salePrice && formik.touched.salePrice)
              }
            />
            <CommonInput
              name="costPrice"
              value={formik.values.costPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Cost Price *"
              variant="flat"
              description={
                formik.errors.costPrice && formik.touched.costPrice
                  ? String(formik.errors.costPrice)
                  : ""
              }
              isInvalid={
                !!(formik.errors.costPrice && formik.touched.costPrice)
              }
            />
            <Select
              classNames={darkSelectClassNames}
              variant="flat"
              onChange={(event) => {
                const selectedValue = event.target.value;
                formik.setFieldValue("gst", selectedValue);
              }}
              value={formik.values.category}
              label="GST(%) *"
              placeholder="Enter GST"
              aria-label="GST"
              isInvalid={!!(formik.errors.gst && formik.touched.gst)}
              description={
                formik.errors.gst && formik.touched.gst
                  ? String(formik.errors.gst)
                  : ""
              }
            >
              {GSTOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            <div className="">
              <div className={`flex items-center gap-3 rounded-xl pr-2`}>
                <CommonInput
                  variant="flat"
                  name="sku"
                  value={formik.values.sku}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="SKU / Barcode *"
                  isInvalid={!!(formik.errors.sku && formik.touched.sku)}
                  description={
                    formik.errors.sku && formik.touched.sku
                      ? String(formik.errors.sku)
                      : ""
                  }
                  endContent={
                    <Button
                      onClick={() => handleSKUGeneration(formik.setFieldValue)}
                      className="py-1.5 rounded-xl text-gra-300"
                      variant="bordered"
                    >
                      <span className="px-1.5 !text-xs">Generate SKU</span>
                    </Button>
                  }
                />
              </div>
            </div>
            {/* <CommonInput
              name="quantityInStock"
              value={formik.values.quantityInStock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Quantity in Stock *"
              variant="flat"
              description={
                formik.errors.quantityInStock && formik.touched.quantityInStock
                  ? String(formik.errors.quantityInStock)
                  : ""
              }
              isInvalid={
                !!(
                  formik.errors.quantityInStock &&
                  formik.touched.quantityInStock
                )
              }
            /> */}
          </div>
        </CommonCard>
        <CommonCard className="mb-6" title="Media Uploads">
          <div className="space-y-4">
            <FileInput
              onFilesChange={(files) => {
                formik.setFieldValue("mediaContent", files);
              }}
            />
          </div>
        </CommonCard>
        <CommonCard className="mb-6" title="Additional Options">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              classNames={darkSelectClassNames}
              variant="flat"
              label="Select Size *"
              placeholder="Select Size"
              aria-label="Select Size"
              selectionMode="multiple"
              selectedKeys={
                formik.values.sizeOptions &&
                formik.values.sizeOptions.map((s: any) => s.size)
              }
              onSelectionChange={(selectedKeys) => {
                const selectedValues = Array.from(selectedKeys).map((size) => ({
                  size,
                  quantity:
                    formik.values.sizeOptions.find((s: any) => s.size === size)
                      ?.quantity || 1, // Default quantity
                }));
                formik.setFieldValue("sizeOptions", selectedValues);
              }}
              isInvalid={
                !!(formik.errors.sizeOptions && formik.touched.sizeOptions)
              }
              description={
                formik.errors.sizeOptions && formik.touched.sizeOptions
                  ? String(formik.errors.sizeOptions)
                  : ""
              }
            >
              {sizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>

            {/* Render selected sizes with quantity input */}
            <div className="mt-4 flex space-x-6 gap-2">
              {formik.values.sizeOptions.map(({ size, quantity }: any) => (
                <div key={size} className="flex items-center gap-4">
                  <span className="font-semibold">{size}:</span>
                  <Input
                    type="number"
                    min="1"
                    variant="bordered"
                    value={quantity}
                    onChange={(e) => {
                      const updatedSizes = formik.values.sizeOptions.map(
                        (s: any) =>
                          s.size === size
                            ? { ...s, quantity: e.target.value }
                            : s
                      );
                      formik.setFieldValue("sizeOptions", updatedSizes);
                    }}
                    className="w-16"
                    aria-label={`Quantity for ${size}`}
                  />
                </div>
              ))}
            </div>

            <Select
              classNames={darkSelectClassNames}
              variant="flat"
              onChange={(event) => {
                const selectedValue = event.target.value;
                formik.setFieldValue("inventoryStatus", selectedValue); // Setting the value directly
              }}
              value={formik.values.inventoryStatus} // Formik's current value
              placeholder="Select Inventory Status"
              aria-label="Inventory Status"
              label="Inventory Status *"
              isInvalid={
                !!(
                  formik.errors.inventoryStatus &&
                  formik.touched.inventoryStatus
                )
              }
              description={
                formik.errors.inventoryStatus && formik.touched.inventoryStatus
                  ? String(formik.errors.inventoryStatus)
                  : ""
              }
            >
              {InventoryOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>

            <Textarea
              name="careInstructions"
              value={formik.values.careInstructions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Care Instructions"
              variant="flat"
            />
          </div>
        </CommonCard>

        <Button
          variant="shadow"
          color="primary"
          type="submit"
          className="mt-4 w-full mb-6"
        >
          {isEdit ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProductComponent;
