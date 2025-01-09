import { FormikHelpers } from "formik";
import { FormValues } from "./CustomerDetailsModal";

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
}

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
