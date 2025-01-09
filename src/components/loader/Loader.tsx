import { Spinner } from "@nextui-org/react";
interface loaderProps {
  color?:
    | "primary"
    | "secondary"
    | "current"
    | "danger"
    | "success"
    | "warning"
    | "white";
  label?: string;
  size: "sm" | "md" | "lg";
}

const Loader: React.FC<loaderProps> = ({ color, size }) => {
  return <Spinner color={color} size={size} />;
};

export default Loader;
