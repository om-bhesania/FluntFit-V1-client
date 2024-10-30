import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";
import { ModalComponentProps } from "../../utils/interfaces";

const EditModal: React.FC<ModalComponentProps> = ({
  title,
  bodyContent,
  footerButtons = [],
  isDismissable = false,
  isKeyboardDismissDisabled = true,
  triggerLabel,
  onOpen,
  onClose,
  buttonClassName,
  variant,
  color,
  data,
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
        className={"bg-blue-500 text-white"}
        variant={"solid"}
      >
        {triggerLabel}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => (open ? handleOpen() : handleClose())}
        isDismissable={isDismissable}
        isKeyboardDismissDisabled={isKeyboardDismissDisabled}
        size="2xl"
      >
        <ModalContent className="max-h-[90vh] !overflow-y-auto rounded-2xl">
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>

              <ModalBody>{bodyContent}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
