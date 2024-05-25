import {
  Flex,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  UnorderedList,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Chat } from "../context/ChatState";
import NewGroupModal from "./NewGroupModal";

const Settings = () => {
  const { showToast, setChats, setGroups } = useContext(Chat);
  const navigate = useNavigate();
  const handleLogout = async () => {
    setChats()
    setGroups()
    navigate("/");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/user/logout`
      );
      if (!res.data.success) {
        showToast("Logout Failed", "error");
      }
    } catch (error) {
      console.log(`Something went wrong ${error}`);
    }
  };
  return (
    <>
      <Flex p={2} mr={2}>
        <Menu>
          <MenuButton px={2}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="5"
              viewBox="0 0 128 512"
            >
              <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
            </svg>
          </MenuButton>
          <MenuList>
            <UnorderedList css={{ listStyle: "none" }}>
              <ListItem
                py={3}
                onClick={() => {
                  navigate("../profile");
                }}
                fontSize={"sm"}
                ml={-1}
              >
                Profile
              </ListItem>
              <ListItem
                py={3}
                onClick={() => {
                  return;
                }}
                fontSize={"sm"}
                ml={-1}
              >
                <NewGroupModal />
              </ListItem>
              <ListItem onClick={handleLogout} py={3} fontSize={"sm"} ml={-1}>
                Logout
              </ListItem>
            </UnorderedList>
          </MenuList>
        </Menu>
      </Flex>
    </>
  );
};

export default Settings;
