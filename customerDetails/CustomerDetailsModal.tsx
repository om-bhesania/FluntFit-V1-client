import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Field, Form, Formik, FormikHelpers } from "formik";
  
import CustomTooltip from "../src/components/tooltip/Tooltip";
 
export interface FormValues {
  name: string;
  number: string;
  address: string;
  email?: string;
}
interface CustomerDetailsModalProps {
  isOpen: boolean;
  productData: any;
  onClose: () => void;
  initialValues: FormValues;
  validationSchema: any;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
}

function CustomerDetailsModal({
  isOpen,
  onClose,
  initialValues,
  validationSchema,
  onSubmit,
  productData,
}: CustomerDetailsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <ModalHeader className="flex gap-1">
                  Customer Details ~{" "}
                  <CustomTooltip
                    trigger={productData.productName}
                    content={productData.productName}
                    className="line-clamp-1"
                  />
                </ModalHeader>
                <ModalBody>
                  <Field name="name">
                    {({ field }: { field: any }) => (
                      <Input
                        {...field}
                        label="Name"
                        placeholder="Enter your name"
                        variant="bordered"
                        isInvalid={!!(errors.name && touched.name)}
                        errorMessage={touched.name && errors.name}
                      />
                    )}
                  </Field>
                  <Field name="number">
                    {({ field }: { field: any }) => (
                      <Input
                        {...field}
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        variant="bordered"
                        isInvalid={!!(errors.number && touched.number)}
                        errorMessage={touched.number && errors.number}
                      />
                    )}
                  </Field>
                  <Field name="address">
                    {({ field }: { field: any }) => (
                      <Textarea
                        {...field}
                        label="Address"
                        placeholder="Enter your address"
                        variant="bordered"
                        isInvalid={!!(errors.address && touched.address)}
                        errorMessage={touched.address && errors.address}
                      />
                    )}
                  </Field>
                  <Field name="email">
                    {({ field }: { field: any }) => (
                      <Input
                        {...field}
                        label="Email (Optional)"
                        placeholder="Enter your email"
                        variant="bordered"
                        type="email"
                        isInvalid={!!(errors.email && touched.email)}
                        errorMessage={touched.email && errors.email}
                      />
                    )}
                  </Field>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit" disabled={isSubmitting}>
                    Save
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CustomerDetailsModal;
