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
  return <LoginComponents variant={variant} color={color} />;
}

export default LoginController;
