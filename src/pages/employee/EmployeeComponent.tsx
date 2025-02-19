import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useFormik } from "formik";
import {
  Activity,
  EyeClosedIcon,
  EyeIcon,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import React from "react";
import * as Yup from "yup";
import CommonCard from "../../components/cards/CommonCard";
import { darkSelectClassNames } from "../../utils/utils";

// Updated type to include role
type EmployeeFormValues = {
  username: string;
  phone: string;
  email: string;
  address: string;
  role: string;
  password: string;
  roleName: string;
};

type AddEmployeeProps = {
  handleSubmit: (values: EmployeeFormValues) => void;
  loading: boolean;
  roles: any;
  handleTogglePassword: any;
  togglePassword: any;
};

const AddEmployeeComponent: React.FC<AddEmployeeProps> = ({
  handleSubmit,
  loading,
  roles,
  handleTogglePassword,
  togglePassword,
}) => {
  // Initial form values
  const initialValues: EmployeeFormValues = {
    username: "",
    phone: "",
    email: "",
    address: "",
    role: "",
    password: "",
    roleName: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      username: Yup.string().required("User name is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .test(
          "valid-phone",
          "Phone number must be 11 digits and cannot start with 0",
          (value) => {
            if (!value) return false;
            const phoneWithoutLeadingZero = value.startsWith("0")
              ? value.slice(1)
              : value;
            return /^[0-9]{10}$/.test(phoneWithoutLeadingZero);
          }
        ),
      email: Yup.string().email("Invalid email address"),
      address: Yup.string().required("Address is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        await handleSubmit(values);

        // formik.resetForm({
        //   values: initialValues,
        // });
      } catch (error) {}
    },
  });
  // const EightBitPasswordGenerator = () => {
  //   const characters =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+/?|";
  //   let password = "";
  //   for (let i = 0; i < 16; i++) {
  //     const randomIndex = Math.floor(Math.random() * characters.length);
  //     password += characters[randomIndex];
  //   }
  //   setGeneratedPassword(password);
  //   return password;
  // };
  return (
    <div className="container mx-auto p-4">
      <form onSubmit={formik.handleSubmit}>
        <CommonCard className="mb-6" title="Employee Information">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Name Input */}
            <Input
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Employee's name"
              variant="flat"
              description={
                formik.touched.username && formik.errors.username
                  ? formik.errors.username
                  : ""
              }
              isInvalid={formik.touched.username && !!formik.errors.username}
              startContent={<User className="text-gray-400" />}
            />

            {/* Phone Input */}
            <Input
              name="phone"
              value={formik.values.phone}
              type="number"
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

            {/* Role Input */}
            <Select
              name="role"
              selectedKeys={[formik.values.role]}
              onChange={(event) => {
                const selectedRole = roles.find(
                  (role: any) => role.roleId === event.target.value
                );
                formik.setFieldValue("role", event.target.value);
                formik.setFieldValue("roleName", selectedRole?.name);
              }}
              onBlur={formik.handleBlur}
              placeholder="Select role"
              classNames={darkSelectClassNames}
              className="self-start"
              description={
                formik.touched.role && formik.errors.role
                  ? formik.errors.role
                  : ""
              }
              isInvalid={formik.touched.role && !!formik.errors.role}
              startContent={<Activity className="text-gray-400" />}
            >
              {roles?.map((item: any) => (
                <SelectItem key={item.roleId} value={item.roleId}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>

            {/* Password Input */}
            <Input
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter password"
              variant="flat"
              type={togglePassword ? "text" : "password"}
              description={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : ""
              }
              isInvalid={formik.touched.password && !!formik.errors.password}
              startContent={<Lock className="text-gray-400" />}
              endContent={
                togglePassword ? (
                  <EyeIcon
                    onClick={handleTogglePassword}
                    className="text-gray-400 cursor-pointer"
                  />
                ) : (
                  <EyeClosedIcon
                    onClick={handleTogglePassword}
                    className="text-gray-400 cursor-pointer"
                  />
                )
              }
            />

            {/* Address Input */}
            <Textarea
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Employee's address"
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
        </CommonCard>

        <Button
          type="submit"
          variant="shadow"
          color="primary"
          isLoading={loading}
          disabled={loading}
          className="mt-4 w-full"
        >
          {loading ? "Creating..." : "Create Employee"}
        </Button>
      </form>
    </div>
  );
};

export default AddEmployeeComponent;
