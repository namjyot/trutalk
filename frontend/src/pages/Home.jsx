import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import Settings from "../components/Settings";
import ShowMessages from "../components/ShowMessages";
import ShowGroups from "../components/ShowGroups";
import { Chat } from "../context/ChatState";
import axios from "axios";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { setUser, setUserForGroup, setMessages } = useContext(Chat);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("online");
  useEffect(() => {
    socket.disconnect();
    const authUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/user/authUser`
        );
        if (!res.data.success) {
          navigate("/");
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getUserId = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/user/getUser`
        );
        if (res.data.success) {
          setUser(res.data.user._id);
          setUserForGroup(res.data.user);
          setEmail(res.data.user.email);
          socket.connect();
          socket.emit("join-room", res.data.user._id);
        }
      } catch (error) {
        setStatus("offline");
        console.log(`Something went wrong ${error}`);
      }
    };
    authUser();
    getUserId();
    setMessages();
    sessionStorage.removeItem("chat");
    sessionStorage.removeItem("group");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("user");
  }, []);

  const { tabSelector, setTabSelector } = useContext(Chat);
  return (
    <>
      {/* Search User and Menu here */}
      <Box bg={"white"}>
        <Flex py={4} justifyContent={"space-between"} alignItems={"center"}>
          <Text
            size={"lg"}
            position={"relative"}
            top={2}
            ml={4}
            p={1}
            className="logo-font-2"
          >
            Trutalk
          </Text>
          <Flex alignItems={"center"}>
            <Badge
              fontSize={".55em"}
              mr={1}
              variant={"solid"}
              colorScheme={status === "online" ? "green" : "red"}
            >
              {status}
            </Badge>
            <Text fontSize={"xs"} color={"gray.500"} mb={0.5} mr={2}>
              {email}
            </Text>
            <Settings />
          </Flex>
        </Flex>
        <Box>
          <Tabs
            defaultIndex={tabSelector}
            w={"full"}
            isFitted
            variant="soft-rounded"
            colorScheme="purple"
          >
            <TabList>
              <Tab
                onClick={() => {
                  setTabSelector(0);
                }}
              >
                Chats
              </Tab>
              <Tab
                onClick={() => {
                  setTabSelector(1);
                }}
              >
                Groups
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ShowMessages />
              </TabPanel>
              <TabPanel>
                <ShowGroups />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </>
  );
};

export default Home;
