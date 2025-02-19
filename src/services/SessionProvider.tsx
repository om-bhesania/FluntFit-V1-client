import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSessionStorage from "../hooks/useSessionStorage";
import useToast from "../hooks/useToast";
import { PingApi } from "../pages/auth/login/AuthApis";

const SessionProvider = ({ children }: any) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const navigate = useNavigate();
  const token = useSessionStorage("authToken");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notify } = useToast();

  useEffect(() => {
    const fetchAndValidatePermissions = async () => {
      await PingApi(notify);
      // await PermissionsApi(notify);
    };

    fetchAndValidatePermissions();

    const checkSessionExpiration = () => {
      if (!token) {
        setIsSessionExpired(true);
        return;
      }

      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const expirationTime = tokenPayload.exp * 1000;
        if (Date.now() > expirationTime) {
          setIsSessionExpired(true);
        }
      } catch (error) {
        console.error("Invalid token format");
        setIsSessionExpired(true);
      }
    };

    checkSessionExpiration();
    const intervalId = setInterval(checkSessionExpiration, 60000);

    return () => clearInterval(intervalId);
  }, [token]);

  useEffect(() => {
    if (isSessionExpired) {
      onOpen();
    }
  }, [isSessionExpired, onOpen]);

  const handleSessionExpire = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="top-bar">
        <div className="bg-yellow-300 text-black lowercase font-semibold text-center p-2 lg:hidden visible">
          For optimal usage of the app, please use larger screen devices.
        </div>
        {children}

        <Modal
          key={isSessionExpired ? "session-expired-modal" : "no-modal"}
          isOpen={isOpen}
          onOpenChange={onClose}
          className="dark"
        >
          <ModalContent className="text-gray-300">
            <ModalHeader className="flex flex-col gap-1">
              Session Expired
            </ModalHeader>
            <ModalBody>
              <p>Your session has expired. Please log in again.</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  handleSessionExpire();
                  onClose();
                }}
              >
                Okay
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default SessionProvider;
