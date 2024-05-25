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
import axios from "axios";
import React, { useContext, useState } from "react";
import { Chat } from "../context/ChatState";
import { socket } from "../socket";

const NewGroupModal = () => {
  const images = [
    "https://res.cloudinary.com/dfsjlew69/image/upload/v1710947382/imresizer-1710946709804_ajnr35.jpg",
    "https://res.cloudinary.com/dfsjlew69/image/upload/v1710947382/imresizer-1710946845921_xrm5be.jpg",
    "https://res.cloudinary.com/dfsjlew69/image/upload/v1710947382/imresizer-1710946900722_zcuhcd.jpg",
    "https://res.cloudinary.com/dfsjlew69/image/upload/v1710947382/imresizer-1710947220892_pq4hol.jpg",
    "https://res.cloudinary.com/dfsjlew69/image/upload/v1710947382/imresizer-1710947274080_mefxii.jpg",
  ];
  const { showToast, getGroups } = useContext(Chat);
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [foundUsers, setFoundUsers] = useState();
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [groupImage, setGroupImage] = useState(
    "https://res.cloudinary.com/dfsjlew69/image/upload/v1710947382/imresizer-1710946709804_ajnr35.jpg"
  );
  const searchUsers = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/user/findUser`,
        {
          email: email,
        }
      );
      if (res.data.success) {
        setFoundUsers(res.data.users);
      } else {
        setFoundUsers();
        showToast("User Doesn't Exist", "error");
      }
    } catch (error) {
      console.log(`Something went wrong ${error}`);
    }
  };

  const createGroup = async () => {
    const userIds = [];
    Array.from(selectedUsers).map((item) => {
      userIds.push(item._id);
    });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/chat/createGroup`,
        {
          groupName: groupName,
          userArr: userIds,
          groupImage: groupImage,
        }
      );
      if (!res.data.success) {
        showToast("Something went wrong", "error");
      } else {
        getGroups();
        socket.emit("fetch-groups", userIds);
        resetInfo();
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectThisUser = (user) => {
    setSelectedUsers((previousState) => new Set([...previousState, user]));
  };

  const removeThisUser = (user) => {
    const tempSet = selectedUsers;
    tempSet.delete(user);
    setSelectedUsers(new Set(tempSet));
  };
  const resetInfo = () => {
    setSelectedUsers(new Set());
    setFoundUsers();
    setEmail("");
    setGroupName("");
  };

  const selectImage = (item) => {
    // border={"2px solid #2e79c1"}
    const currentElement = document.getElementById(item);
    const prevElement = document.getElementById(groupImage);
    setGroupImage(item);
    prevElement.style.border = "none";
    currentElement.style.border = "2px solid #805AD5";
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <>
      <Text
        onClick={() => {
          onOpen();
        }}
      >
        New group
      </Text>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Create New Group Chat</ModalHeader>
          <ModalCloseButton onClick={resetInfo} />
          <ModalBody pb={2}>
            <Flex flexWrap={"wrap"} justifyContent={"center"}>
              {images.map((item) => (
                <Avatar
                  key={item}
                  id={item}
                  size={{ base: "md", sm: "lg" }}
                  src={item}
                  onClick={() => {
                    selectImage(item);
                  }}
                  m={1}
                  _hover={{ cursor: "pointer" }}
                />
              ))}
            </Flex>
            <FormControl>
              <FormLabel mt={3}>Group name</FormLabel>
              <Input
                focusBorderColor="purple.500"
                ref={initialRef}
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
                placeholder="Group name"
              />
            </FormControl>

            <form onSubmit={searchUsers}>
              <FormControl mt={4}>
                <FormLabel>Find Users</FormLabel>
                <Input
                  focusBorderColor="purple.500"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter email"
                />
              </FormControl>
            </form>
            {/* Show Users Here */}
            <Box overflowY={"scroll"} mt={2} maxH={"10em"}>
              {foundUsers &&
                foundUsers.map((user) => (
                  <Flex
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                      selectThisUser(user);
                    }}
                    key={user._id}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    bg={"gray.50"}
                    p={4}
                    mx={1}
                    my={1}
                    borderRadius={5}
                  >
                    <Flex alignItems={"center"}>
                      <Avatar name={user.username} size={"xs"} />
                      <Text fontSize={"xs"} ml={2}>
                        {user.email}
                      </Text>
                    </Flex>
                    <Text fontWeight={"bold"}>+</Text>
                  </Flex>
                ))}
            </Box>
            <FormLabel mt={4}>Selected Users</FormLabel>
            <Flex mt={2} flexWrap={"wrap"}>
              {Array.from(selectedUsers).map((user) => (
                <Flex
                  _hover={{ cursor: "pointer" }}
                  key={user._id}
                  mb={1}
                  ml={1}
                  py={2}
                  px={4}
                  bg={"gray.50"}
                  alignItems={"center"}
                >
                  <Text
                    mr={2}
                    fontWeight={"bold"}
                    onClick={() => {
                      removeThisUser(user);
                    }}
                  >
                    -
                  </Text>
                  <Avatar name={user.username} size={"xs"} />
                  <Text fontSize={"xs"} ml={2}>
                    {user.email}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={createGroup}>
              Create
            </Button>
            <Button
              onClick={() => {
                resetInfo();
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

export default NewGroupModal;
