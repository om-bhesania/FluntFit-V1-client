import * as Yup from "yup";
import CustomerDetailsComponent from "./CustomerDetailsComponent";

import { FormikHelpers } from "formik";
import { FormValues } from "./CustomerDetailsModal";
export interface CustomerDetailsComponentProps {
  isOpen: boolean;
  onOpen: () => void;
  productData: any;
  onClose: () => void;
  initialValues: FormValues;
  validationSchema: any;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
}
export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  number: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  email: Yup.string().email("Invalid email address"),
});

export const initialValues: FormValues = {
  name: "",
  number: "",
  address: "",
  email: "",
};
export interface CustomerDetailsControllerProps {
  isOpen: boolean;
  onOpen: any;
  onClose: any;
  initialValues: any;
  validationSchema: any;
  onSubmit: (
    values: FormValues,
    actions: { setSubmitting: (isSubmitting: boolean) => void }
  ) => void;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  productData: any;
  data: any;
}
const CustomerDetailsController: React.FC<CustomerDetailsControllerProps> = ({
  isOpen,
  onOpen,
  onClose,
  validationSchema,
  onSubmit,
  productData,
  data,
}) => {
  return (
    <CustomerDetailsComponent
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      productData={productData}
      data={data}
    />
  );
};

export default CustomerDetailsController;
