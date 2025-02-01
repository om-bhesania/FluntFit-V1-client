import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../../../hooks/useToast";
import { LoginApi } from "./AuthApis";
import LoginComponents from "./LoginComponents";

function LoginController({
  color,
  variant,
}: {
  variant?:
    | "bordered"
    | "faded"
    | "flat"
    | "solid"
    | "light"
    | "ghost"
    | "shadow";
  color?: "default" | "primary" | "secondary" | "danger" | "success";
}) {
  const { notify } = useToast();
  const nav = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  // Redirect to products if the token is present
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      nav("/products/all-products?isLogin=true");
    }
  }, [nav]); // This will run once when the component mounts

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res: any = await LoginApi(data, notify);
      console.log("res", res.data.token);
      sessionStorage.setItem("authToken", res.data.token);
      console.log('first')
      sessionStorage.setItem("name", res.data.name);
      sessionStorage.setItem("email", res.data.userEmail);
      sessionStorage.setItem("role", res.data.role);
      if (res.status === "Success" || res.status === "success") {
        nav("/products/all-products?isLogin=true");
      }
    } catch (error: any) {
      // Handle error here
      console.error("Login error:", error);
      return true;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginComponents
      variant={variant}
      color={color}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
}

export default LoginController;
