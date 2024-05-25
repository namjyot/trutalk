import React, { useContext, useEffect } from "react";
import FindUserDrawer from "./FindUserDrawer";
import { Avatar, Flex, Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Chat } from "../context/ChatState";
import { socket } from "../socket";
import NoChatText from "./NoChatText";

const ShowGroups = () => {
  const navigate = useNavigate();
  const { groups, getGroups, user, userForGroup } = useContext(Chat);

  const openGroupChat = (group) => {
    socket.emit("leave-room", user);
    sessionStorage.setItem("group", JSON.stringify(group));
    sessionStorage.setItem("userId", user);
    sessionStorage.setItem("user", JSON.stringify(userForGroup));
    navigate("/groupchat");
  };

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    socket.on("fetch-data", () => {
      getGroups();
    });
  }, [socket]);

  return (
    <Flex
      flexDir={"column"}
      overflowX={"hidden"}
      alignItems={"center"}
      mt={1}
      overflowY={"scroll"}
      position={"relative"}
    >
      {/* Chat Icon Drawer */}
      <FindUserDrawer />
      {/* User */}
      {groups && groups.length === 0 && (
        <NoChatText message={"Start making groups now!"} />
      )}
      {groups &&
        groups.map((item) => (
          <Flex
            w={"95%"}
            key={item._id}
            bg={"gray.50"}
            borderRadius={5}
            px={2}
            py={5}
            mb={1}
            mx={6}
            alignItems={"center"}
            onClick={() => {
              openGroupChat(item);
            }}
          >
            <Avatar src={item.avatar} size={"md"} ml={1} mr={4} />
            <Box>
              <Text fontWeight={600}>{item.chatName}</Text>
              <Text fontSize={"xs"} fontWeight={300}>
                {item.lastMessage}
              </Text>
            </Box>
          </Flex>
        ))}
    </Flex>
  );
};

export default ShowGroups;
