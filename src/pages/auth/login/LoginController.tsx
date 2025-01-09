import { useEffect } from "react";
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

  // Redirect to products if the token is present
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      nav("/products/all-products?isLogin=true");
    }
  }, [nav]); // This will run once when the component mounts

  const handleSubmit = async (data: any) => {
    try {
      const res: any = await LoginApi(data, notify);
      sessionStorage.setItem("authToken", res.data.data.token);
      if (res.status === "Success" || res.status === "success") {
        nav("/products/all-products?isLogin=true");
      }
    } catch (error: any) {
      // Handle error here
      console.error("Login error:", error);
    }
  };

  return (
    <LoginComponents
      variant={variant}
      color={color}
      handleSubmit={handleSubmit}
    />
  );
}

export default LoginController;
