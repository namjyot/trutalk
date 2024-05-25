import { useToast } from "@chakra-ui/react";
import React, { createContext, useState } from "react";
import axios from "axios";

export const Chat = createContext();
const ChatState = (props) => {
  const toast = useToast();
  const [tabSelector, setTabSelector] = useState(0);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState();
  const [userForGroup, setUserForGroup] = useState();
  const [groups, setGroups] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const [messages, setMessages] = useState();

  const getChats = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/chat/getChat`
      );
      if (!res.data.success) {
        console.log(
          `Something went wrong while fetching chats ${res.data.message}`
        );
        setChats([]);
      } else {
        setChats(res.data.chats);
      }
    } catch (error) {
      console.log("Something went wrong");
      setChats([]);
    }
  };
  const getGroups = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/chat/getGroups`
      );
      if (!res.data.success) {
        console.log(`Something went wrong while getting groups`);
        setGroups([]);
      } else {
        setGroups(res.data.groups);
      }
    } catch (error) {
      console.log(`Something went wrong ${error}`);
      setGroups([]);
    }
  };
  const getUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/user/getUser`
      );
      if (res.data.success) {
        setUserProfile(res.data.user);
      }
    } catch (error) {
      console.log(`Something went wrong ${error}`);
    }
  };
  const showToast = (title, statuss) => {
    toast({
      title: title,
      status: statuss,
      duration: 2000,
      isClosable: true,
    });
  };
  const charCapitalize = (name) => {
    let firstHalf = name.split(" ")[0];
    return firstHalf.charAt(0).toUpperCase() + firstHalf.slice(1);
  };

  const passingValues = {
    showToast,
    tabSelector,
    setTabSelector,
    chats,
    setChats,
    getChats,
    user,
    setUser,
    getGroups,
    groups,
    setGroups,
    getUser,
    userProfile,
    messages,
    setMessages,
    userForGroup,
    setUserForGroup,
  };
  return <Chat.Provider value={passingValues}>{props.children}</Chat.Provider>;
};

export default ChatState;
