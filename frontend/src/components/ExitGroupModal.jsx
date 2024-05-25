import React, { useContext } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { Chat } from "../context/ChatState";
import { useNavigate } from "react-router-dom";

const ExitGroupModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { showToast } = useContext(Chat);
  const exitGroup = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/chat/removeFromGroup`,
        {
          chatId: JSON.parse(sessionStorage.getItem("group"))._id,
        }
      );
      if (!res.data.success) {
        showToast(res.data.message, "error");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Exit Group
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>
            Exit "{JSON.parse(sessionStorage.getItem("group")).chatName}" group?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>Do you want to exit this group?</ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={exitGroup}>
              Exit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExitGroupModal;
