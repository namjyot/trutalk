import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import SentMessage from "../components/SentMessage";
import ReceivedMessage from "../components/ReceivedMessage";
import { useNavigate } from "react-router-dom";
import UserModal from "../components/UserModal";
import { Chat as chat } from "../context/ChatState";
import axios from "axios";
import { socket } from "../socket";
import Loader from "../components/Loader";
import BeatLoader from "react-spinners/BeatLoader";

const Chat = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(chat);
  const [user, setUser] = useState();
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState();
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    const scrollTarget = document.getElementById("scroll-focus");
    scrollTarget.scrollIntoView();
  };

  const fetchMessages = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/chat/fetchMessages`,
      {
        chatId: JSON.parse(sessionStorage.getItem("chat"))._id,
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
    setUser(sessionStorage.getItem("userId"));
    setChatId(JSON.parse(sessionStorage.getItem("chat"))._id);

    fetchMessages();
    socket.emit("join-room", JSON.parse(sessionStorage.getItem("chat"))._id);
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
        `${process.env.REACT_APP_SERVER_URL}/api/chat/sendMessage`,
        {
          chatId: chatId,
          message: message,
        }
      );
      if (!res.data.success) {
        console.log("Something went wrong while sending message");
        setLoading(false);
      } else {
        setMessages([...messages, res.data.message]);
        socket.emit("send-message", res.data.message.chat, [
          JSON.parse(sessionStorage.getItem("chat")).users[0]._id,
        ]);
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
            <Box
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                socket.emit("leave-room", chatId);
                navigate("/home");
              }}
            >
              <ArrowBackIcon boxSize={5} color={"purple.500"} />
            </Box>
          </Box>
          <Text fontWeight={600}>
            {JSON.parse(sessionStorage.getItem("chat")).users[0].username}
          </Text>
          <UserModal
            name={JSON.parse(sessionStorage.getItem("chat")).users[0].username}
            email={JSON.parse(sessionStorage.getItem("chat")).users[0].email}
            about={JSON.parse(sessionStorage.getItem("chat")).users[0].about}
            avatar={JSON.parse(sessionStorage.getItem("chat")).users[0].avatar}
          />
        </Flex>
        {!messages ? (
          <Loader />
        ) : (
          <Box h={"82%"} overflowY={"scroll"} css={{ transition: ".2s" }}>
            {/* Modal */}
            {/* Messages */}

            {messages &&
              messages.map((item) =>
                item.sender === user ? (
                  <SentMessage message={item.content} key={item._id} />
                ) : (
                  <ReceivedMessage message={item.content} key={item._id} />
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
          py={4}
          css={{ boxShadow: "0 0 10px #e7e7e7" }}
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

export default Chat;
