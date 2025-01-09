import * as Yup from "yup";
import CustomerDetailsComponent from "./CustomerDetailsComponent";
 
import { FormValues } from "./CustomerDetailsModal";
import { FormikHelpers } from "formik";
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
}
const CustomerDetailsController: React.FC<CustomerDetailsControllerProps> = ({
  isOpen,
  onOpen,
  onClose,
  validationSchema,
  onSubmit,
  productData,
}) => {
  //   const [isOpen, setIsOpen] = useState(false);

  //   const handleSubmit = (
  //     values: FormValues,
  //     { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  //   ) => {
  //     console.log(values);
  //     setSubmitting(false);
  //     setIsOpen(false);
  //   };

  //   const handleOpenModal = () => setIsOpen(true);
  //   const handleCloseModal = () => setIsOpen(false);
  console.log("onOpen", onOpen);
  console.log("isOpen", isOpen);
  console.log("onClose", onClose);
  return (
    <CustomerDetailsComponent
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      productData={productData}
    />
  );
};

export default CustomerDetailsController;
