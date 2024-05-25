import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import edit from "../assets/edit.svg";
import axios from "axios";
import { Chat } from "../context/ChatState";

const EditUsernameModal = () => {
  const { showToast, getUser, userProfile } = useContext(Chat);
  const [username, setUsername] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const editUsername = async (e) => {
    e.preventDefault();
    if (username.trim().length <= 0) {
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/user/editUsername`,
        {
          username: username,
        }
      );
      if (!res.data.success) {
        showToast("Something went wrong", "error");
      } else {
        getUser();
        onClose();
      }
    } catch (error) {
      showToast(`Something went wrong ${error}`, "error");
    }
  };
  return (
    <>
      <Flex px={2}>
        <img
          src={edit}
          alt=""
          onClick={() => {
            onOpen();
            setUsername(userProfile.username);
          }}
        />
      </Flex>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Edit Username</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={editUsername}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  focusBorderColor="purple.500"
                  ref={initialRef}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder="Enter username"
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={editUsername}>
              Save
            </Button>
            <Button
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditUsernameModal;
