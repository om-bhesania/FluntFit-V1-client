import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Mail, Phone, MapPin } from "lucide-react";

// Define the customer form values interface
type CustomerFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

type AddCustomerProps = {
  handleSubmit: (values: CustomerFormValues) => void;
  loading: boolean;
};

const AddCustomerComponent: React.FC<AddCustomerProps> = ({
  handleSubmit,
  loading,
}) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .test(
          "valid-phone",
          "Phone number must be 11 digits and cannot start with 0",
          (value) => {
            if (!value) return false;
            const phoneWithoutLeadingZero = value.startsWith("0")
              ? value.slice(1)
              : value;
            return /^[0-9]{10}$/.test(phoneWithoutLeadingZero);
          }
        ),

      address: Yup.string().required("Address is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={formik.handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Customer Information</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Name Input */}
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter customer's name"
                variant="flat"
                description={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ""
                }
                isInvalid={formik.touched.name && !!formik.errors.name}
                startContent={<User className="text-gray-400" />}
              />

              {/* Phone Input */}
              <Input
                name="phone"
                value={formik.values.phone}
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter phone number"
                variant="flat"
                description={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : ""
                }
                isInvalid={formik.touched.phone && !!formik.errors.phone}
                startContent={<Phone className="text-gray-400" />}
              />

              {/* Email Input */}
              <Input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter email address"
                variant="flat"
                description={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ""
                }
                isInvalid={formik.touched.email && !!formik.errors.email}
                startContent={<Mail className="text-gray-400" />}
              />

              {/* Address Input */}
              <Textarea
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="col-span-3"
                placeholder="Enter customer's address"
                variant="flat"
                description={
                  formik.touched.address && formik.errors.address
                    ? formik.errors.address
                    : ""
                }
                isInvalid={formik.touched.address && !!formik.errors.address}
                startContent={<MapPin className="text-gray-400" />}
              />
            </div>
          </CardBody>
        </Card>

        <Button
          type="submit"
          variant="shadow"
          color="primary"
          isLoading={loading}
          disabled={loading}
          className="mt-4 w-full"
        >
          {loading ? "Creating..." : "Create Customer"}
        </Button>
      </form>
    </div>
  );
};

export default AddCustomerComponent;
