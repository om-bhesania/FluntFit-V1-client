export interface serviceParams {
  method: "get" | "post" | "put" | "delete";
  url: string;
  data?: any;
  headers?: Record<string, string>;
  config?: any;
  withCredentials?: boolean;
}

export interface ModalComponentProps {
  title?: string;
  bodyContent: React.ReactNode;
  footerButtons?: {
    label: string;
    color?: "primary" | "secondary" | "danger" | "success";
    variant?: "solid" | "light" | "outline" | "ghost";
    onPress: () => void;
  }[];
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  triggerLabel: string;
  onOpen?: () => void;
  onClose?: () => void;
  handleModalOpen?: boolean;
  buttonClassName?: string;
  variant?:
    | "bordered"
    | "faded"
    | "flat"
    | "solid"
    | "light"
    | "ghost"
    | "shadow";
  color?: "default" | "primary" | "secondary" | "danger" | "success";
  data?: any;
}
