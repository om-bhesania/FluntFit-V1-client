import LoginModal from "./LoginModal";

function LoginComponents({
  variant,
  color,
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
  return (
    <>
      <LoginModal variant={variant} color={color} />
    </>
  );
}

export default LoginComponents;
