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
import { useNavigate } from "react-router-dom";
import { File, PlusIcon } from "lucide-react";

interface AddProductComponentProps {
  categories: { value: string; label: string }[];
  subcategories: { value: string; label: string }[];
  handleSKUGeneration: (
    setFieldValue: (field: string, value: any) => void
  ) => void;
  handleSubmit: (values: any) => void;
  isEdit?: boolean;
  prefilledData?: any;
  handleSaveEdit?: (updatedProduct: any, data: any) => void;
}

const AddProductComponent: React.FC<AddProductComponentProps> = ({
  categories,
  subcategories,
  handleSKUGeneration,
  handleSubmit,
  isEdit = false,
  prefilledData,
  handleSaveEdit,
}) => {
  console.log("prefilledData:", prefilledData);
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
          sizeOptions: prefilledData?.sizeOptions || "",
          colorOptions: prefilledData?.colorOptions || "",
          careInstructions: prefilledData?.careInstructions || "",
          inventoryStatus: prefilledData?.inventoryStatus || "",
          countryOfOrigin: prefilledData?.countryOfOrigin || "",
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
          sku: "",
          quantityInStock: "",
          mediaContent: [],
          sizeOptions: "",
          colorOptions: "",
          careInstructions: "",
          inventoryStatus: "",
          countryOfOrigin: "",
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
    mediaContent: Yup.array()
      .of(Yup.mixed().required("Image file is required"))
      .min(1, "At least one product image is required"),
    sizeOptions: Yup.string(),
    colorOptions: Yup.string(),
    careInstructions: Yup.string().max(
      500,
      "Care instructions can't exceed 500 characters"
    ),
    inventoryStatus: Yup.string().oneOf(
      ["In Stock", "Out of Stock", "Discontinued"],
      "Invalid status"
    ),
    countryOfOrigin: Yup.string().required("Country of origin is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm, setFieldValue }) => {
      try {
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
          mediaContent: values.mediaContent,
          sizeOptions: values.sizeOptions,
          colorOptions: values.colorOptions,
          careInstructions: values.careInstructions,
          inventoryStatus: values.inventoryStatus,
          countryOfOrigin: values.countryOfOrigin,
        };

        if (!isEdit) {
          await handleSubmit(formData);
        } else if (handleSaveEdit) {
          console.log(formData, "formData");
          await handleSaveEdit(prefilledData.id, formData);
        }

        // Clear specific fields after successful submission
        setFieldValue("category", "", false);
        setFieldValue("subcategory", "", false);
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
          },
        });
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });
  const navigate = useNavigate();
  return (
    <div className="w-full container">
      <div className=" text-end w-full">
        <Button
          variant="flat"
          onClick={() => navigate("/dashboard/all-collections")}
          className="mb-6 bg-accent/20 text-gray-600"
        >
          <File size={20} /> View All Products
        </Button>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="productName"
                value={formik.values.productName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Product Name"
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
                placeholder="Select Category"
                aria-label="Category"
              >
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  formik.setFieldValue("subcategory", selectedValue);
                }}
                value={formik.values.subcategory}
                placeholder="Select Subcategory"
                aria-label="Subcategory"
              >
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.value} value={subcategory.value}>
                    {subcategory.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                name="productType"
                value={formik.values.productType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Product Type"
                variant="flat"
              />
              <Input
                name="brand"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Product Brand"
                variant="flat"
                labelPlacement="inside"
              />
            </div>
          </CardBody>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Pricing & Stock</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Price"
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
                label="Sale Price (optional)"
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
                    label="SKU"
                    isInvalid={!!(formik.errors.sku && formik.touched.sku)}
                  />
                  <Button
                    onClick={() => handleSKUGeneration(formik.setFieldValue)}
                    className="py-1.5 rounded-xl"
                  >
                    Generate SKU
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
                label="Quantity in Stock"
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
                fieldName="mediaContent"
                setFieldValue={formik.setFieldValue}
                onFilesChange={(files) => {
                  formik.setFieldValue("mediaContent", files);
                }}
                isInvalid={
                  !!(formik.errors.mediaContent && formik.touched.mediaContent)
                }
                error={formik.errors.mediaContent as string}
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
              <Input
                name="sizeOptions"
                value={formik.values.sizeOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Size Options"
                variant="flat"
              />
              <Input
                name="colorOptions"
                value={formik.values.colorOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Color Options"
                variant="flat"
              />
              <Select
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  formik.setFieldValue("inventoryStatus", selectedValue);
                }}
                value={formik.values.inventoryStatus}
                placeholder="Select Inventory Status"
                aria-label="Inventory Status"
                label="Inventory Status"
              >
                {["In Stock", "Out of Stock", "Discontinued"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </Select>
              <Input
                name="countryOfOrigin"
                value={formik.values.countryOfOrigin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Country of Origin"
                variant="flat"
                description={
                  formik.errors.countryOfOrigin &&
                  formik.touched.countryOfOrigin
                    ? String(formik.errors.countryOfOrigin)
                    : ""
                }
                isInvalid={
                  !!(
                    formik.errors.countryOfOrigin &&
                    formik.touched.countryOfOrigin
                  )
                }
              />
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
        >
          {isEdit ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProductComponent;
