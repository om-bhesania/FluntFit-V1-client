import { FormikHelpers } from "formik";
import CustomerDetailsModal, { FormValues } from "./CustomerDetailsModal";

export interface CustomerDetailsComponentProps {
  isOpen: boolean;
  onOpen: () => void;
  productData: any;
  onClose: () => void;
  initialValues: FormValues;
  validationSchema: any;
  handleSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
  data: any;
}
function CustomerDetailsComponent({
  isOpen,
  onClose,
  initialValues,
  handleSubmit,
}: CustomerDetailsComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <CustomerDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default CustomerDetailsComponent;
