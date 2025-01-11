import { getLocalTimeZone } from "@internationalized/date";
import {
  Button,
  Card,
  CardBody,
  DatePicker,
  DateValue,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { City, State } from "country-state-city";
import { useFormik } from "formik";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import { parseDate } from "@internationalized/date";
export interface FormValues {
  name: string;
  phone: string;
  address: string;
  email?: string;
  state: string;
  city?: string;
  dob?: DateValue | null;
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
  const [value, setValue] = useState<DateValue | null>(null);
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
      state: Yup.string().required("State is Required"),
    }),
    onSubmit: async (values) => {
      await onSubmit(values);
      formik.resetForm();
    },
  });
  const [citiesOfState, setCitiesOfState] = useState<any>();
  const states = State.getStatesOfCountry("IN");
  const cities = City.getCitiesOfState("IN", citiesOfState);
  const currentDate = new Date().toISOString().split("T")[0];
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
                <DatePicker
                  label="Birth date"
                  calendarProps={{
                    defaultFocusedValue: value || undefined,
                    nextButtonProps: {
                      variant: "light",
                    },
                    prevButtonProps: {
                      variant: "light",
                    },
                  }}
                  maxValue={parseDate(currentDate)}
                  showMonthAndYearPickers={true}
                  shouldForceLeadingZeros
                  onChange={(newValue) => {
                    const formattedDate = newValue
                      .toDate(getLocalTimeZone())
                      .toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      });
                    setValue(newValue);
                    formik.setFieldValue("dob", formattedDate);
                  }}
                  onBlur={formik.handleBlur} // Handle blur for Formik validation
                  aria-label="Date of Birth"
                />

                <Select
                  name="state"
                  placeholder="Select State"
                  value={formik.values.state}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    const selectedState = states.find(
                      (state) => state.isoCode === selectedValue
                    )?.name;
                    formik.setFieldValue("state", selectedState);
                    setCitiesOfState(selectedValue);
                  }}
                  onBlur={formik.handleBlur}
                  aria-label="State"
                  isInvalid={!!(formik.errors.state && formik.touched.state)}
                  description={
                    formik.errors.state && formik.touched.state
                      ? String(formik.errors.state)
                      : ""
                  }
                >
                  {states.map((item) => (
                    <SelectItem key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  name="city"
                  placeholder="Select City (optional)"
                  value={formik.values.city} // Ensure this holds the city name
                  onChange={(event) => {
                    const selectedCity = event.target.value;
                    formik.setFieldValue("city", selectedCity);
                  }}
                  onBlur={formik.handleBlur}
                  aria-label="City"
                  isInvalid={!!(formik.errors.city && formik.touched.city)}
                  description={
                    formik.errors.city && formik.touched.city
                      ? String(formik.errors.city)
                      : ""
                  }
                >
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </CardBody>
            <div className="   text-end w-full">
              <Button
                type="submit"
                variant="shadow"
                color="primary"
                className="mt-2 min-w-[unset]"
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
