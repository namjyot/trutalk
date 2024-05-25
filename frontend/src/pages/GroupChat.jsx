import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import SentMessage from "../components/SentMessage";
import { Link } from "react-router-dom";
import GroupReceivedMessage from "../components/GroupReceivedMessage";
import axios from "axios";
import { socket } from "../socket";
import GroupInfoDrawer from "../components/GroupInfoDrawer";
import { Chat } from "../context/ChatState";
import Loader from "../components/Loader";
import BeatLoader from "react-spinners/BeatLoader";

const GroupChat = () => {
  const [message, setMessage] = useState("");
  const { messages, setMessages } = useContext(Chat);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    const scrollTarget = document.getElementById("scroll-focus");
    scrollTarget.scrollIntoView();
  };

  const fetchMessages = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/chat/fetchGroupMessages`,
      {
        chatId: JSON.parse(sessionStorage.getItem("group"))._id,
      }
    );
    if (!res.data.success) {
      showToast("Something went wrong", "error");
      navigate("/home");
    } else {
      setMessages(res.data.messages);
    }
  };

  useEffect(() => {
    socket.connect();
    fetchMessages();
    socket.emit("join-room", JSON.parse(sessionStorage.getItem("group"))._id);
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on("receive-message", () => {
      fetchMessages();
    });
  }, [socket]);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/chat/sendGroupMessage`,
        {
          chatId: JSON.parse(sessionStorage.getItem("group"))._id,
          message: message,
        }
      );
      if (!res.data.success) {
        console.log("Something went wrong while sending message");
        setLoading(false);
      } else {
        setMessages((prevArr) => [...prevArr, res.data.message]);
        const users = JSON.parse(sessionStorage.getItem("group")).users.map(
          (item) => item._id
        );
        socket.emit("send-message", res.data.message.chat, users);
        setMessage("");
        setLoading(false);
      }
    } catch (error) {
      console.log(`Something went wrong ${error}`);
      setLoading(false);
    }
    scrollToBottom();
  };

  return (
    <>
      <Box h={"100svh"} position={"relative"}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          h={"8%"}
          py={3}
          css={{ boxShadow: "0 0 10px #e7e7e7" }}
        >
          <Box ml={3}>
            <Link to={"/home"}>
              <ArrowBackIcon boxSize={5} color={"purple.500"} />
            </Link>
          </Box>
          <Text fontWeight={600}>
            {JSON.parse(sessionStorage.getItem("group")).chatName}
          </Text>
          <GroupInfoDrawer />
        </Flex>
        {!messages ? (
          <Loader />
        ) : (
          <Box
            pt={2}
            h={"82%"}
            overflowY={"scroll"}
            css={{ transition: ".2s" }}
          >
            {/* Messages */}

            {messages &&
              messages.map((item) =>
                item.sender._id === sessionStorage.getItem("userId") ? (
                  <SentMessage key={item._id} message={item.content} />
                ) : (
                  <GroupReceivedMessage
                    key={item._id}
                    message={item.content}
                    username={item.sender.username}
                    email={item.sender.email}
                    avatar={item.sender.avatar}
                    about={item.sender.about}
                  />
                )
              )}

            <Box id="scroll-focus"></Box>
          </Box>
        )}

        {/* Footer */}
        <Flex
          w={"full"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          h={"10%"}
          css={{ boxShadow: "0 0 10px #e7e7e7" }}
          py={4}
        >
          {/* Input field */}
          <form style={{ width: "75%" }} onSubmit={handleSubmitMessage}>
            <FormControl>
              <Input
                focusBorderColor="purple.500"
                isDisabled={loading}
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onClick={scrollToBottom}
                placeholder="Type message here..."
              />
            </FormControl>
          </form>

          {/* Button */}
          <Button
            w={"15%"}
            colorScheme="purple"
            onClick={handleSubmitMessage}
            isLoading={loading}
            spinner={<BeatLoader size={5} color="white" />}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
            >
              <path
                fill="#fff"
                d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"
              />
            </svg>
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default GroupChat;
