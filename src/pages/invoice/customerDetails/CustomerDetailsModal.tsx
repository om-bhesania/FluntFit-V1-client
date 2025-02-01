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
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { parseDate } from "@internationalized/date";
import { darkSelectClassNames } from "../../../utils/utils";
import Loader from "../../../components/loader/Loader";

export interface FormValues {
  name: string;
  phone: string;
  address: string;
  email?: string;
  state: string;
  city?: string;
  customer?: [];
  dob?: DateValue | null;
}

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: FormValues;
  handleSubmit: any;
}

function CustomerDetailsModal({
  isOpen,
  onClose,
  initialValues,
  handleSubmit,
}: CustomerDetailsModalProps) {
  const [value, setValue] = useState<DateValue | null>(null);
  useEffect(() => {
    fetchStates();
  }, []);
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
      await handleSubmit(values);
      formik.resetForm();
      formik.setFieldValue("dob", "");
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [cities, setCities] = useState<any>([]);
  const [states, setStates] = useState<any>([]);
  const currentDate = new Date().toISOString().split("T")[0];

  const fetchStates = async () => {
    setLoading(true);
    try {
      const stateList = State.getStatesOfCountry("IN");
      setStates(stateList);
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (StateId: string) => {
    setLoading(true);
    try {
      let cityList = await City.getCitiesOfState("IN", StateId);
      setCities(cityList);
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
      <ModalContent className="bg-gray-950 text-gray-300">
        <ModalHeader>
          <h2 className="text-lg font-semibold text-gray-300">
            Customer Information
          </h2>
        </ModalHeader>
        <form onSubmit={formik.handleSubmit} className="container">
          <Card className="mb-6 h-full bg-transparent shadow-none">
            <CardBody>
              <div className="flex flex-col gap-4 dark">
                {/* Name Input */}
                <Input
                  name="name"
                  value={formik.values?.name}
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
                  value={formik.values?.phone}
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
                  value={formik.values?.email}
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
                  value={formik.values?.address}
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
                  name="dob"
                  calendarProps={{
                    defaultFocusedValue: value || undefined,
                    nextButtonProps: {
                      variant: "bordered",
                    },
                    prevButtonProps: {
                      variant: "bordered",
                    },
                  }}
                  classNames={{
                    base: "dark text-gray-950",
                    calendar:
                      "bg-gray-950 text-gray-300 disabled:!text-gray-200",
                    helperWrapper: "bg-gray-950",
                    calendarContent: "bg-gray-950 disabled:!text-gray-200",
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
                  onBlur={formik.handleBlur}
                  aria-label="Date of Birth"
                />

                <Select
                  classNames={darkSelectClassNames}
                  variant="flat"
                  name="state"
                  placeholder="Select State"
                  value={formik.values?.state}
                  isLoading={loading}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    const selectedState = states.find(
                      (state: any) => state.isoCode === selectedValue
                    )?.name;
                    formik.setFieldValue("state", selectedState);
                    fetchCities(selectedValue);
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
                  {states.map((item: any) => (
                    <SelectItem
                      key={item.isoCode}
                      value={item.isoCode}
                      className="text-gray-300"
                    >
                      {loading ? <Loader size="lg" /> : item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  classNames={darkSelectClassNames}
                  variant="flat"
                  name="city"
                  placeholder="Select City (optional)"
                  value={formik.values?.city} // Ensure this holds the city name
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
                  disabled={loading}
                >
                  {cities.map((city: any) => (
                    <SelectItem
                      key={city.name}
                      value={city.name}
                      className="text-gray-300"
                    >
                      {loading ? <Loader size="lg" /> : city.name}
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
