import {
  Button,
  Modal,
  ModalContent,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { DeleteIcon, EditIcon } from "../../assets/images/Icon";
import CommonInput from "../../components/input/CommonInput";
import useToast from "../../hooks/useToast";
import { darkSelectClassNames, formatToIST } from "../../utils/utils";
import { GetEmployeeApi, UpdateEmployeeApi } from "./EmployeeApis";
import EmployeeTable from "./EmployeeTable";
import { RolesApi } from "../auth/login/AuthApis";

// Validation schema
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.number().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  role: Yup.string().required("Role is required"),
  roleName: Yup.string().required("Role name is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
});

function EmployeeTableController() {
  const [loading, setLoading] = useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const [roles, setRoles] = useState<any>([]);
  const { notify } = useToast();
  useEffect(() => {
    fetchRoles();
  }, []);
  const fetchRoles = async () => {
    const res: any = await RolesApi(notify);
    setRoles(res?.data);
  };
  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const res: any = await GetEmployeeApi(notify);
      setEmployeeData(res);
    } catch (error) {
      return true;
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      address: "",
      role: "",
      roleName: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = {
          _id: employee._id,
          userId: employee.userId,
          ...values,
          phone: Number(values.phone),
        };

        const res = await UpdateEmployeeApi(formData, notify);
        if (res.status !== "error") {
          notify("Employee updated successfully", { type: "success" });
          fetchEmployee();
          closeModal();
        }
      } catch (error) {
        notify(`Failed to update employee: ${error}`, { type: "error" });
      }
    },
  });

  const handleEdit = (employee: any) => () => {
    console.log("employee", employee);
    setEmployee(employee);
    formik.setValues({
      username: employee.username || "",
      email: employee.email || "",
      phone: employee.phone?.toString() || "",
      address: employee.address || "",
      role: employee.role || "",
      roleName: employee.roleName || "",
      password: employee.password || "",
    });
    setIsOpen(true);
  };

  const handleDelete = (employee: any) => () => {
    console.log("employee", employee);
  };

  const closeModal = () => {
    setIsOpen(false);
    formik.resetForm();
  };

  const columns = useMemo(
    () => [
      {
        header: "Serial Number",
        accessorKey: "id",
        cell: ({ table, row }: any) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const serialNumber = pageIndex * pageSize + row.index + 1;
          return serialNumber;
        },
      },
      {
        header: "Name",
        accessorKey: "username",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Contact",
        accessorKey: "phone",
      },
      {
        header: "Role",
        accessorKey: "roleName",
        cell: (row: any) => {
          return <span>{row.getValue("roleName")}</span>;
        },
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: (row: any) => {
          return <span>{formatToIST(row.getValue("createdAt"))}</span>;
        },
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: (row: any) => {
          return (
            <div className="flex gap-2">
              <Button isIconOnly onClick={handleEdit(row?.row.original)}>
                <EditIcon />
              </Button>
              <Button isIconOnly onClick={handleDelete(row?.row.original)}>
                <DeleteIcon />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <EmployeeTable columns={columns} data={employeeData} loading={loading} />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        backdrop="blur"
        classNames={{
          base: "dark",
          backdrop: "bg-gray-900/50 backdrop-opacity-40",
          body: "py-6",
          header: "border-b border-gray-700",
          footer: "border-t border-gray-700",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={formik.handleSubmit} className="space-y-4 p-6">
              <CommonInput
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.username && formik.errors.username}
                isRequired
              />

              <CommonInput
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.email && formik.errors.email}
                isRequired
              />

              <CommonInput
                label="Phone"
                name="phone"
                type="number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.phone && formik.errors.phone}
                isRequired
              />

              <Textarea
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.address && formik.errors.address}
                className="w-full"
                isRequired
              />

              <Select
                label="Role"
                name="role"
                classNames={darkSelectClassNames}
                variant="flat"
                value={formik.values.role}
                defaultSelectedKeys={[employee.role]}
                onChange={(value) => {
                  formik.setFieldValue("role", value);
                  const roleName = roles.find(
                    (option: any) => option.roleId === value
                  )?.roleName;
                  formik.setFieldValue("roleName", roleName);
                }}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.role && formik.errors.role}
                isRequired
              >
                {roles.map((option: any) => (
                  <SelectItem key={option.roleId} value={option.roleName}>
                    {option.roleName}
                  </SelectItem>
                ))}
              </Select>

              {/* <CommonInput
                label="Role Name"
                name="roleName"
                value={formik.values.roleName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.roleName && formik.errors.roleName}
                isRequired
              /> */}

              <CommonInput
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.password && formik.errors.password}
              />

              <div className="flex justify-end gap-3 mt-6">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Update
                </Button>
              </div>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EmployeeTableController;
