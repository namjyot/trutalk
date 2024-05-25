import React, { useContext, useEffect } from "react";
import FindUserDrawer from "./FindUserDrawer";
import { Avatar, Flex, Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Chat } from "../context/ChatState";
import { socket } from "../socket";
import NoChatText from "./NoChatText";

const ShowMessages = () => {
  const { chats, getChats, user } = useContext(Chat);
  const navigate = useNavigate();
  const openChatWindow = async (chat) => {
    socket.emit("leave-room", user);
    sessionStorage.setItem("chat", JSON.stringify(chat));
    sessionStorage.setItem("userId", user);
    navigate("/chat");
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    socket.on("fetch-data", () => {
      getChats();
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
      {chats && chats.length === 0 && (
        <NoChatText message={"Start a conversation now!"} />
      )}
      {chats &&
        chats.map((item) => (
          <Flex
            w={"95%"}
            bg={"gray.50"}
            borderRadius={5}
            px={2}
            py={5}
            mb={1}
            mx={6}
            alignItems={"center"}
            onClick={() => {
              openChatWindow(item);
            }}
            key={item._id}
          >
            <Avatar name={item.users[0].username} size={"md"} ml={1} mr={4} />
            <Box>
              <Text fontWeight={600}>{item.users[0].username}</Text>
              <Text fontSize={"xs"} fontWeight={300}>
                {item.lastMessage}
              </Text>
            </Box>
          </Flex>
        ))}
    </Flex>
  );
};

export default ShowMessages;
