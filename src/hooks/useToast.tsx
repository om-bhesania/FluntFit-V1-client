import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useToast = () => {
  interface ToastOptions {
    type?: "info" | "success" | "warning" | "error";
    theme?: "colored" | "light" | "dark";
    position?:
      | "top-right"
      | "top-center"
      | "top-left"
      | "bottom-right"
      | "bottom-center"
      | "bottom-left";
    [key: string]: any;
  }

  const notify = (message: string, options: ToastOptions = {}) => {
    toast(message, {
      type: options.type || "info",
      theme: options.theme || "colored",
      position: options.position || "top-right",
      ...options,
    });
  };

  return { notify };
};

export default useToast;
