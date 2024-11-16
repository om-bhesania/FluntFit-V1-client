import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { ModalComponentProps } from "../../utils/interfaces";

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  bodyContent,
  footerButtons = [],
  triggerLabel,
  onOpen,
  onClose,
  buttonClassName,
  variant,
  color,
}) => {
  const { isOpen, onOpen: openModal, onOpenChange } = useDisclosure();

  const handleOpen = () => {
    if (onOpen) onOpen();
    openModal();
  };

  const handleClose = () => {
    if (onClose) onClose();
    onOpenChange();
  };

  return (
    <>
      <Button
        onPress={handleOpen}
        className={buttonClassName}
        variant={variant}
        color={color}
      >
        {triggerLabel}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => (open ? handleOpen() : handleClose())}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        placement="center"
      >
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>

              <ModalBody>{bodyContent}</ModalBody>

              <ModalFooter>
                {footerButtons.map((button, index) => (
                  <Button
                    key={index}
                    color={index === 0 ? "default" : "primary"}
                    variant={index === 0 ? "light" : "shadow"}
                    onPress={() => {
                      button.onPress();
                      close();
                    }}
                  >
                    {index === 0 ? "Cancel" : button.label}
                  </Button>
                ))}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComponent;
