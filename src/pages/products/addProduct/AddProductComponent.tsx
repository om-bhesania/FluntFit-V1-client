import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileInput from "../../../components/fileUpload/FileInput";
import useToast from "../../../hooks/useToast";

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
  // deleteAllProducts,
  sizeOptions,
  GSTOptions,
  InventoryOptions,
  loading,
}) => {
  const { notify } = useToast();
  const initialValues =
    isEdit && prefilledData
      ? {
          id: prefilledData._id || "",
          productName: prefilledData?.productName || "",
          productDescription: prefilledData?.productDescription || "",
          category: prefilledData?.category || "",
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
          inventoryStatus: prefilledData?.inventoryStatus || "",
          gst: prefilledData?.gst || "",
          costPrice: prefilledData?.costPrice || "",
        }
      : {
          id: "",
          productName: "",
          productDescription: "",
          category: "",
          subcategory: "",
          productType: "",
          brand: "",
          price: "",
          salePrice: "",
          costPrice: "",
          gst: "",
          sku: "",
          quantityInStock: "",
          mediaContent: [],
          sizeOptions: [],
          careInstructions: "",
          inventoryStatus: "",
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
    salePrice: Yup.number()
      .nullable()
      .positive("Sale Price must be positive")
      .max(
        Yup.ref("price"),
        "Sale Price should be less than or equal to Price"
      ),
    sku: Yup.string().required("SKU is required"),
    quantityInStock: Yup.number()
      .required("Stock quantity is required")
      .integer("Stock quantity must be an integer")
      .min(0, "Quantity cannot be negative"),
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
    onSubmit: async (values, { resetForm, setFieldValue }) => {
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
          quantityInStock: Number(values.quantityInStock),
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
        // // Clear specific fields after successful submission
        setFieldValue("category", "", false);
        setFieldValue("gst", "", false);
        setFieldValue("sizeOptions", "", false);
        setFieldValue("inventoryStatus", "", false);
        setFieldValue("mediaContent", [], false); // Clear file input

        // Optionally reset all fields
        resetForm({
          values: {
            ...initialValues,
            category: "",
            subcategory: "",
            inventoryStatus: "",
            mediaContent: "",
            gst: "",
            sizeOptions: "",
          },
        });
      } catch (error) {
        notify("Error submitting form", { type: "error" });
      }
    },
  });

  return (
    <div className="w-full mt-3">
      <form onSubmit={formik.handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </CardHeader>
          {/* <button onClick={deleteAllProducts}>Delete All</button> */}
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
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
              />
            </div>
          </CardBody>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Category & Classification</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  formik.setFieldValue("category", selectedValue);
                }}
                value={formik.values.category}
                label="Category *"
                placeholder="Select Category"
                aria-label="Category"
                isInvalid={
                  !!(formik.errors.category && formik.touched.category)
                }
              >
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
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
              <Input
                name="productType"
                value={formik.values.productType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Product Type *"
                variant="flat"
              />
              <Input
                name="brand"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Product Brand *"
                variant="flat"
                labelPlacement="inside"
              />
            </div>
          </CardBody>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Pricing & Stock (₹)</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
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
              <Input
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
              <Input
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
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  formik.setFieldValue("gst", selectedValue);
                }}
                value={formik.values.category}
                label="GST(%) *"
                placeholder="Enter GST"
                aria-label="GST"
                isInvalid={!!(formik.errors.gst && formik.touched.gst)}
              >
                {GSTOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
              <div className="">
                <div
                  className={`${
                    formik.errors.sku && formik.touched.sku
                      ? "!border-0 !bg-danger-50"
                      : " bg-default-100"
                  } flex items-center gap-3 rounded-xl pr-2`}
                >
                  <Input
                    name="sku"
                    value={formik.values.sku}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="SKU / Barcode *"
                    isInvalid={!!(formik.errors.sku && formik.touched.sku)}
                  />
                  <Button
                    onClick={() => handleSKUGeneration(formik.setFieldValue)}
                    className="py-1.5 rounded-xl"
                  >
                    <span className="px-1.5 !text-xs">Generate SKU</span>
                  </Button>
                </div>
                <div className="text-tiny text-foreground-400">
                  {formik.errors.sku && formik.touched.sku
                    ? String(formik.errors.sku as string)
                    : ""}
                </div>
              </div>
              <Input
                name="quantityInStock"
                value={formik.values.quantityInStock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Quantity in Stock *"
                variant="flat"
                description={
                  formik.errors.quantityInStock &&
                  formik.touched.quantityInStock
                    ? String(formik.errors.quantityInStock)
                    : ""
                }
                isInvalid={
                  !!(
                    formik.errors.quantityInStock &&
                    formik.touched.quantityInStock
                  )
                }
              />
            </div>
          </CardBody>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Media Uploads</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <FileInput
                onFilesChange={(files) => {
                  formik.setFieldValue("mediaContent", files);
                }}
              />
            </div>
          </CardBody>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Additional Options</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Select Size *"
                placeholder="Select Size"
                aria-label="Select Size"
                selectionMode="multiple"
                selectedKeys={formik.values.sizeOptions}
                onSelectionChange={(selectedKeys) => {
                  const selectedValues = Array.from(selectedKeys);
                  formik.setFieldValue("sizeOptions", selectedValues);
                }}
                isInvalid={
                  !!(formik.errors.sizeOptions && formik.touched.sizeOptions)
                }
              >
                {sizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  console.log(selectedValue);
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
          </CardBody>
        </Card>

        <Button
          variant="shadow"
          color="primary"
          type="submit"
          className="mt-4 w-full"
          // disabled={loading}
        >
          {isEdit ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProductComponent;
