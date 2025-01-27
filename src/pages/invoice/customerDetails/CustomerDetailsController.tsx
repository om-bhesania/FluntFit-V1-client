import * as Yup from "yup";
import CustomerDetailsComponent from "./CustomerDetailsComponent";

import { FormValues } from "./CustomerDetailsModal";
import { FormikHelpers } from "formik";
import service from "../../../services/services";
import apiUrls from "../../../utils/apiUrls";
import { useEffect, useState } from "react";
import useToast from "../../../hooks/useToast";
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
  phone: "",
  address: "",
  email: "",
  state: "",
  city: "",
  dob: null,
};
export interface CustomerDetailsControllerProps {
  isOpen: boolean;
  onOpen: any;
  onClose: any;
  initialValues: any;
  validationSchema: any;
  handleSubmit: (
    values: FormValues,
    actions: { setSubmitting: (isSubmitting: boolean) => void }
  ) => void;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  productData: any;
}
const CustomerDetailsController: React.FC<CustomerDetailsControllerProps> = ({
  isOpen,
  onOpen,
  onClose,
  validationSchema,
  handleSubmit,
  productData,
}) => {
  const [data, setData] = useState(null);
  const { notify } = useToast();

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      const result: any = await service({
        method: "get",
        url: apiUrls.products.get,
      });
      setData(result?.products || []);
    } catch (error: any) {
      notify(error?.response.data.message, { type: "error" });
    } finally {
    }
  };
  return (
    <CustomerDetailsComponent
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleSubmit={handleSubmit}
      productData={productData}
      data={data}
    />
  );
};

export default CustomerDetailsController;
