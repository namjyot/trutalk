import { ArrowBackIcon } from "@chakra-ui/icons";
import { Avatar, Box, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import profile from "../assets/profile.svg";
import about from "../assets/about.svg";
import email from "../assets/email.svg";
import EditUsernameModal from "../components/EditUsernameModal";
import EditAboutModal from "../components/EditAboutModal";
import { Chat } from "../context/ChatState";

const Profile = () => {
  const { getUser, userProfile } = useContext(Chat);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
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
        <Text fontWeight={600} mr={6}>
          Profile
        </Text>
      </Flex>
      <Flex flexDir={"column"} h={"92%"}>
        <Flex
          flexDir={"column"}
          py={10}
          borderRadius={10}
          alignItems={"center"}
        >
          <Avatar size={"xl"} name={userProfile && userProfile.username} />
          <Flex
            w={"full"}
            mt={2}
            px={10}
            py={6}
            justifyContent={"space-between"}
          >
            <Flex alignItems={"center"}>
              <Box mt={4}>
                <img src={profile} alt="" />
              </Box>
              <Box>
                <Text ml={3} fontSize={"xs"} color={"gray.500"}>
                  Username
                </Text>
                <Text ml={3} fontSize={"md"}>
                  {userProfile && userProfile.username}
                </Text>
              </Box>
            </Flex>
            <EditUsernameModal />
          </Flex>
          <Divider />
          <Flex w={"full"} py={5} px={10} justifyContent={"space-between"}>
            <Flex alignItems={"center"}>
              <Box mt={4}>
                <img src={about} alt="" />
              </Box>
              <Box>
                <Text ml={3} fontSize={"xs"} color={"gray.500"}>
                  About
                </Text>
                <Text ml={3} fontSize={"md"}>
                  {userProfile && userProfile.about}
                </Text>
              </Box>
            </Flex>
            <EditAboutModal />
          </Flex>
          <Divider />

          <Flex w={"full"} py={4} px={10} justifyContent={"space-between"}>
            <Flex alignItems={"center"}>
              <Box mt={4}>
                <img src={email} alt="" />
              </Box>
              <Box>
                <Text ml={3} fontSize={"xs"} color={"gray.500"}>
                  Email
                </Text>
                <Text ml={3} fontSize={"md"}>
                  {userProfile && userProfile.email}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Profile;
