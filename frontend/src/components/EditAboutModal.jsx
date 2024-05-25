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
  const [about, setAbout] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const editAbout = async (e) => {
    e.preventDefault();
    if (about.trim().length <= 0) {
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/user/editAbout`,
        {
          about: about,
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
            setAbout(userProfile.about);
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
          <ModalHeader>Edit About</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={editAbout}>
              <FormControl>
                <FormLabel>About</FormLabel>
                <Input
                  focusBorderColor="purple.500"
                  ref={initialRef}
                  value={about}
                  onChange={(e) => {
                    setAbout(e.target.value);
                  }}
                  placeholder="Enter here"
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={editAbout}>
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
