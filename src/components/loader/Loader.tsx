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
  className?: string;
}

const Loader: React.FC<loaderProps> = ({ color = 'white', size, className }) => {
  return <Spinner color={color} size={size} className={className} />;
};

export default Loader;
