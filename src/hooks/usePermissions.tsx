import { useEffect, useState } from "react";
import { PermissionsApi } from "../pages/auth/login/AuthApis";

interface Permissions {
  [key: string]: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
  };
}

const usePermissions = (notify:any) => {
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res:any = await PermissionsApi(notify);
        console.log('perms',res)
        if (res.status === "Success") {
          setPermissions(res.data.module);
        } else {
          notify("Failed to fetch permissions", "error");
        }
      } catch (error) {
        notify("Error fetching permissions", "error");
      }
    };

    fetchPermissions();
  }, []);

  const hasPermission = (
    module: string,
    action: "read" | "write" | "update" | "delete"
  ) => {
    return permissions?.[module]?.[action] ?? false;
  };

  // const enforcePermission = (module: string) => {
  //   if (!hasPermission(module, "read")) {
  //     Swal.fire({
  //       title: "Unauthorized Access",
  //       text: "You don't have permission to access this page.",
  //       icon: "error",
  //       background: "#333",
  //       color: "#fff",
  //     });
  //     navigate("/"); // Redirect to home or another authorized page
  //   }
  // };

  return { hasPermission,  permissions };
};

export default usePermissions;
