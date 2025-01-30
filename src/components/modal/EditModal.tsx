import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../../assets/images/Icon";
import { ModalComponentProps } from "../../utils/interfaces";

const EditModal: React.FC<ModalComponentProps> = ({
  title,
  bodyContent,
  isDismissable = false,
  isKeyboardDismissDisabled = true,
  onOpen,
  onClose,
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
        isIconOnly
        onPress={handleOpen}
        variant={"solid"}
        className="bg-transparent"
      >
        <EditIcon />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => (open ? handleOpen() : handleClose())}
        isDismissable={isDismissable}
        isKeyboardDismissDisabled={isKeyboardDismissDisabled}
        size="5xl"
      >
        <ModalContent className="max-h-[90vh] !overflow-y-auto rounded-2xl">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-gray-300">{title}</ModalHeader>

              <ModalBody>{bodyContent}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
