import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import cat from "../assets/cat.png";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Chat } from "../context/ChatState";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(Chat);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => setShow(!show);

  const passHandler = (e) => {
    setPassword(e.target.value);
  };
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  const fillCredentials = () => {
    setEmail("abc@gmail.com");
    setPassword("helloww");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/user/login`,
        {
          email: email,
          password: password,
        }
      );
      if (!res.data.success) {
        setLoading(false);
        showToast(res.data.message, "error");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setLoading(false);
      showToast(`Something went wrong ${error}`, "error");
    }
  };

  return (
    <>
      <Flex justifyContent={"center"} h={"100svh"}>
        <Flex pr={10} display={{ base: "none", md: "block" }}>
          <Image mt={20} h={500} src={cat} alt="" />
        </Flex>
        <Flex flexDir={"column"} justifyContent={"center"}>
          <Flex
            mt={10}
            w={350}
            h={430}
            border={"1px solid gray"}
            alignItems={"center"}
            flexDir={"column"}
          >
            <Text className="logo-font" pt={10}>
              Trutalk
            </Text>
            <VStack pt={10} spacing={5} mb={8}>
              <Input
                focusBorderColor="purple.500"
                type="email"
                placeholder="Email address"
                w={300}
                value={email}
                onChange={emailHandler}
              />
              <InputGroup>
                <Input
                  focusBorderColor="purple.500"
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  w={300}
                  value={password}
                  onChange={passHandler}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    variant={"outline"}
                    size={"xs"}
                    onClick={handleClick}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Box w={"full"}>
                <Button
                  size={"sm"}
                  w={"full"}
                  colorScheme="purple"
                  mt={2}
                  onClick={submitHandler}
                  isLoading={loading}
                >
                  Log in
                </Button>
              </Box>
              <Button
                size={"sm"}
                w={"full"}
                colorScheme="gray"
                mt={-2}
                onClick={fillCredentials}
              >
                Guest Credentials
              </Button>
            </VStack>

            <Text fontSize={13}>
              Don't have an account?{" "}
              <Link to={"../register"} style={{ color: "blue" }}>
                Sign up
              </Link>{" "}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Login;
