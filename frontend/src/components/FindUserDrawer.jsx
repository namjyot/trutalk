import { ChatIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Chat } from "../context/ChatState.jsx";

const FindUserDrawer = () => {
  const { showToast, getChats } = useContext(Chat);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [email, setEmail] = useState("");
  const [foundUsers, setFoundUsers] = useState();
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
  const createChat = async (user) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/chat/createChat`,
        {
          otherUserId: user._id,
        }
      );
      if (!res.data.success) {
        showToast("Failed to Create Chat", "error");
      } else {
        getChats();
        showToast("Chat Created", "success");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };
  return (
    <>
      <Flex
        ref={btnRef}
        onClick={onOpen}
        position={"fixed"}
        right={10}
        bottom={10}
        bg={"purple.500"}
        borderRadius={20}
        p={4}
        css={{ transition: ".3s" }}
        _hover={{ bg: "purple.600", cursor: "pointer" }}
      >
        <ChatIcon w={4} h={5} color={"white"} />
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={"lg"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Find Users</DrawerHeader>

          <DrawerBody>
            <Flex>
              <Box w={"full"} mr={3}>
                <form onSubmit={searchUsers}>
                  <FormControl>
                    <Input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      placeholder="Type email here..."
                      focusBorderColor="purple.500"
                    />
                  </FormControl>
                </form>
              </Box>
              <Button onClick={searchUsers} type="submit" colorScheme="purple">
                Search
              </Button>
            </Flex>

            <Box pt={5}>
              {foundUsers &&
                foundUsers.map((user) => (
                  <Flex
                    key={user._id}
                    onClick={() => {
                      createChat(user);
                      onClose();
                    }}
                    bg={"gray.50"}
                    borderRadius={5}
                    px={2}
                    py={5}
                    mb={1}
                    alignItems={"center"}
                  >
                    <Avatar name={user.username} size={"md"} ml={3} mr={4} />
                    <Box>
                      <Text fontWeight={600}>{user.username}</Text>
                      <Text fontSize={"xs"} fontWeight={300}>
                        {user.email}
                      </Text>
                    </Box>
                  </Flex>
                ))}
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button
              mb={6}
              variant="outline"
              colorScheme="purple"
              onClick={onClose}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FindUserDrawer;
