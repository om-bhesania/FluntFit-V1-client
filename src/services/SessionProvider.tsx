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
  const navigate = useNavigate(); // Using useNavigate instead of useHistory
  const token = useSessionStorage("authToken");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notify } = useToast();
  const ping = async () => {
    await PingApi(notify);
  };
  useEffect(() => {
    ping();
    // Function to check the session expiry by decoding the token or using expiration time
    const checkSessionExpiration = () => {
      if (!token) {
        setIsSessionExpired(true);
        return;
      }

      // Example: decode token (e.g., JWT) and check if it has expired
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const expirationTime = tokenPayload.exp * 1000; // Convert expiration to milliseconds
      const currentTime = Date.now();
      if (currentTime > expirationTime) {
        setIsSessionExpired(true);
      }
    };

    checkSessionExpiration();

    // Optionally, set a timer to check the session every minute
    const intervalId = setInterval(checkSessionExpiration, 60000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [token]);

  useEffect(() => {
    if (isSessionExpired) {
      onOpen(); // Automatically open the modal when session expires
    }
  }, [isSessionExpired, onOpen]);

  const handleSessionExpire = () => {
    sessionStorage.clear(); // Clear all session storage
    navigate("/login"); // Redirect to login page using useNavigate
  };

  return (
    <>
      {children}

      {/* Using key to re-mount the modal whenever the session expires */}
      <Modal
        key={isSessionExpired ? "session-expired-modal" : "no-modal"}
        isOpen={isOpen}
        onOpenChange={onClose}
      >
        <ModalContent>
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
    </>
  );
};

export default SessionProvider;
