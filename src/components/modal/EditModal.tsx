import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { ModalComponentProps } from "../../utils/interfaces";
import { Edit } from "lucide-react";

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
        <Edit className={"text-blue-500 "} />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => (open ? handleOpen() : handleClose())}
        isDismissable={isDismissable}
        isKeyboardDismissDisabled={isKeyboardDismissDisabled}
        size="2xl"
      >
        <ModalContent className="max-h-[90vh] !overflow-y-auto rounded-2xl">
          {() => (
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
