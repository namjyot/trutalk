import {
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import bear from "../assets/bear.png";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Chat } from "../context/ChatState";

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(Chat);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => setShow(!show);
  const passHandler = (e) => {
    setPassword(e.target.value);
  };
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const nameHandler = (e) => {
    setUsername(e.target.value);
  };
  const confirmPassHandler = (e) => {
    setConfirmPass(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      showToast("Password doesn't match", "error");
      return;
    } else if (password.length < 6) {
      showToast("Password must contain 6 characters", "error");
    } else {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/user/register`,
          formData
        );
        if (!res.data.success) {
          setLoading(false);
          showToast(res.data.message, "error");
        } else {
          navigate("/home");
        }
      } catch (error) {
        setLoading(false);
        showToast(`Something went wrong, Error: ${error}`, "error");
      }
    }
  };

  return (
    <>
      <Flex justifyContent={"center"} h={"100svh"} alignItems={"center"}>
        <Flex pr={5} display={{ base: "none", md: "block" }}>
          <Image mt={14} h={500} src={bear} alt="" />
        </Flex>
        <Flex flexDir={"column"} justifyContent={"center"}>
          <Flex
            mt={0}
            w={360}
            h={500}
            border={"1px solid gray"}
            alignItems={"center"}
            flexDir={"column"}
          >
            <Text className="logo-font" pt={10}>
              Trutalk
            </Text>
            <VStack pt={10} spacing={5} mb={7}>
              <Input
                focusBorderColor="purple.500"
                type="text"
                placeholder="Username"
                w={300}
                value={username}
                onChange={nameHandler}
              />
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
              <InputGroup>
                <Input
                  focusBorderColor="purple.500"
                  type={show ? "text" : "password"}
                  placeholder="Confirm Password"
                  w={300}
                  value={confirmPass}
                  onChange={confirmPassHandler}
                />
              </InputGroup>

              <Button
                size={"sm"}
                w={"full"}
                colorScheme="purple"
                mt={2}
                onClick={submitHandler}
                isLoading={loading}
              >
                Sign up
              </Button>
            </VStack>
            <Text fontSize={13}>
              Already have an account?{" "}
              <Link to={"../login"} style={{ color: "blue" }}>
                Log in
              </Link>{" "}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Register;
