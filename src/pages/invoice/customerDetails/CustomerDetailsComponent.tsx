import { FormikHelpers } from "formik";
import CustomerDetailsModal, { FormValues } from "./CustomerDetailsModal";
 
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
function CustomerDetailsComponent({
  isOpen, 
  onClose,
  initialValues,
  validationSchema,
  onSubmit,
  productData,
}: CustomerDetailsComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <CustomerDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        productData={productData}
      />
    </div>
  );
}

export default CustomerDetailsComponent;
