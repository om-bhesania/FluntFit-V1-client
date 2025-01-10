import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { Phone, Mail, MapPin, User } from "lucide-react";
import * as Yup from "yup";

export interface FormValues {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: FormValues;
  onSubmit: (values: FormValues) => void;
}

function CustomerDetailsModal({
  isOpen,
  onClose,
  initialValues,
  onSubmit,
}: CustomerDetailsModalProps) {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(
          /^[1-9][0-9]{9}$/,
          "Phone number must be 10 digits and not start with 0"
        ),
      address: Yup.string().required("Address is required"),
      email: Yup.string().email("Invalid email address"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-lg font-semibold">Customer Information</h2>
        </ModalHeader>
        <form onSubmit={formik.handleSubmit} className="container">
          <Card className="mb-6 h-full bg-transparent shadow-none">
            <CardBody>
              <div className="flex flex-col gap-4">
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
                  type="tel"
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
                  type="email"
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
            <div className="   text-end w-full">
              <Button
                type="submit"
                variant="shadow"
                color="primary"
                className="!w-20 min-w-[unset]"
              >
                Create Customer
              </Button>
            </div>
          </Card>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default CustomerDetailsModal;
