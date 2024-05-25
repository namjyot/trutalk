import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import welcome from "../assets/welcome.png";
import { TypeAnimation } from "react-type-animation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const authUser = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/user/authUser`
      );
      if (res.data.success) {
        navigate("/home");
      }
    };
    setTimeout(() => {
      authUser();
    }, 1000);
  }, []);
  return (
    <>
      <Box>
        <Flex
          px={{ base: 6, md: 20 }}
          justifyContent={"space-between"}
          alignItems={"center"}
          h={"10svh"}
        >
          <Text fontWeight={600} fontSize={"lg"} color={"#7650cc"}>
            Trutalk
          </Text>
          <Flex>
            <Text
              mr={5}
              px={3}
              py={2}
              transition={".3s"}
              _hover={{ cursor: "pointer", color: "purple.500" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Text>
            <Text
              px={3}
              py={2}
              transition={".3s"}
              _hover={{ cursor: "pointer", color: "purple.500" }}
              onClick={() => navigate("/register")}
            >
              Register
            </Text>
          </Flex>
        </Flex>
        <Flex
          justifyContent={{ md: "space-between" }}
          flexDir={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "start" }}
          px={20}
          mb={20}
          pt={10}
        >
          <Box maxW={400}>
            <Image src={welcome} />
          </Box>
          <Box maxW={"40em"} pt={{ base: 0, md: 16 }} pl={{ base: 0, md: 6 }}>
            <Text
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight={"bold"}
              lineHeight={1.2}
              textAlign={{ base: "center", md: "left" }}
            >
              Trutalk - Real Time Chat Application
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              textAlign={{ base: "center", md: "left" }}
              mt={5}
              mb={6}
              h={5}
            >
              <TypeAnimation
                sequence={[
                  "Find your voice and connect with others on Trutalk.",
                  3000, // Waits 3s
                  "Truth be told, it's Trutalk time.",
                  3000, // Waits 3s
                  "Made with ❤️ by Namjyot.",
                  3000, // Waits 3s
                  () => {
                    console.log("Sequence completed");
                  },
                ]}
                wrapper="p"
                cursor={true}
                repeat={Infinity}
                style={{ display: "inline-block" }}
              />
            </Text>
            <Flex
              mt={{ base: 10, md: 5 }}
              flexDir={{ base: "column", md: "row" }}
            >
              <Button colorScheme="purple" onClick={() => navigate("/login")}>
                Login
              </Button>

              <Button
                mx={{ base: 0, md: 2 }}
                mt={{ base: 2, md: 0 }}
                onClick={() => navigate("/register")}
              >
                Create New Account
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Welcome;
