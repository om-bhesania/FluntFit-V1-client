// components/AddProduct/AddProductController.jsx

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useToast from "../../hooks/useToast";
import { RolesApi } from "../auth/login/AuthApis";
import { AddEmployeeApi } from "./EmployeeApis";
import AddProductComponent from "./EmployeeComponent";

const EmployeeController = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<any>([]);
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const { notify } = useToast();
  useEffect(() => {
    fetchRoles();
  }, []);
  const fetchRoles = async () => {
    const res: any = await RolesApi(notify);
    console.log("roles", res);
    setRoles(res?.data?.roles);
  };
  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await AddEmployeeApi(data, notify);
      console.log("res", res);
      if (res?.status?.toLowerCase() === "success") {
        Swal.fire({
          title: "Employee Created Successfully",
          html: `
          <div style="display: flex; justify-content:center; flex-direction: column; align-items:center; text-align:justify;">
            <p style="margin-bottom:10px"><strong>Name:</strong><span> ${data.username}</span></p>
            <p style="margin-bottom:10px"><strong>Email:</strong> <span>${data.email}</span></p>
            <p style="margin-bottom:10px"><strong>Password:</strong> <span>${data.password}</span></p>
            <p style="margin-bottom:10px"><strong>Role Name:</strong> <span>${data.roleName}</span></p> 
            <p style="margin-bottom:10px"><strong>Phone:</strong> <span>${data.phone}</span></p>
            <p style=""><strong>Address:</strong> <span>${data.address}</span></p>
          </div>
        `,
          icon: "success",
          confirmButtonText: "OK",
          background: "#1a1a1a",
          color: "white",
          customClass: {
            popup: "swal2-dark",
            title: "text-white",
            htmlContainer: "!text-gray-300 space-y-6",
            confirmButton:
              "bg-secondary hover:bg-secondary/80 duration-250 ease-in-out transition text-primary font-bold py-2 px-4 rounded w-full",
          },
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  const handleTogglePassword = () => {
    setTogglePassword(!togglePassword);
  };

  return (
    <AddProductComponent
      handleSubmit={handleSubmit}
      loading={loading}
      roles={roles}
      handleTogglePassword={handleTogglePassword}
      togglePassword={togglePassword}
    />
  );
};

export default EmployeeController;
