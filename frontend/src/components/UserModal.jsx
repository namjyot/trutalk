import {
  Avatar,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const UserModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box onClick={onOpen} _hover={{ cursor: "pointer" }}>
        <Avatar name={props.name} size={"sm"} mr={3} />
      </Box>
      <Modal isOpen={isOpen} size={"sm"} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>User's Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              bg={"gray.50"}
              flexDir={"column"}
              mt={5}
              pt={10}
              pb={8}
              borderRadius={10}
              alignItems={"center"}
            >
              <Avatar name={props.name} size={"xl"} />
              <Text fontWeight={600} mt={2} color={"gray.700"}>
                {props.name}
              </Text>
              <Text color={"gray.500"} fontSize={"sm"}>
                {props.email}
              </Text>
              <Text color={"blue.400"} fontSize={"sm"}>
                {props.about}
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserModal;
