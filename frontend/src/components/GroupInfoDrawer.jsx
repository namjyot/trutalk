import React, { useEffect, useState } from "react";
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
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import ExitGroupModal from "./ExitGroupModal";

const GroupInfoDrawer = () => {
  const [selfUser, setSelfUser] = useState();
  const [groupUsers, setGroupUsers] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  useEffect(() => {
    setGroupUsers(JSON.parse(sessionStorage.getItem("group")).users);

    setSelfUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  return (
    <>
      <Avatar
        src={JSON.parse(sessionStorage.getItem("group")).avatar}
        ref={btnRef}
        onClick={onOpen}
        size={"sm"}
        mr={3}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Group Info</DrawerHeader>

          <DrawerBody>
            <VStack>
              <Avatar
                src={JSON.parse(sessionStorage.getItem("group")).avatar}
                size={"xl"}
              />
              <Text fontWeight={500} mr={2}>
                {JSON.parse(sessionStorage.getItem("group")).chatName}{" "}
              </Text>
              <Text fontSize={"xs"} mt={-2}>
                {JSON.parse(sessionStorage.getItem("group")).users.length + 1}{" "}
                members
              </Text>
              {/* <Divider /> */}
            </VStack>
            <Box mt={10}>
              <Text
                fontSize={".6em"}
                color={"blue.500"}
                fontWeight={500}
                px={2}
              >
                Members
              </Text>
              <Flex
                key={selfUser && selfUser._id}
                alignItems={"center"}
                borderRadius={5}
                transition={".2s"}
                _hover={{ backgroundColor: "gray.50" }}
                p={2}
              >
                <Avatar size={"xs"} name={selfUser && selfUser.username} />
                <Box ml={2}>
                  <Text fontSize={".8em"} fontWeight={500}>
                    You
                  </Text>
                  <Text fontSize={".7em"}>{selfUser && selfUser.about}</Text>
                </Box>
              </Flex>
              {groupUsers &&
                groupUsers.map((user) => (
                  <Flex
                    key={user._id}
                    alignItems={"center"}
                    borderRadius={5}
                    transition={".2s"}
                    _hover={{ backgroundColor: "gray.50" }}
                    p={2}
                  >
                    <Avatar size={"xs"} name={user.username} />
                    <Box ml={2}>
                      <Text fontSize={".8em"} fontWeight={500}>
                        {user.username}
                      </Text>
                      <Text fontSize={".7em"}>{user.about}</Text>
                    </Box>
                  </Flex>
                ))}
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <ExitGroupModal />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default GroupInfoDrawer;
