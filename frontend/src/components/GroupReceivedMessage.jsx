import React from "react";
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

const GroupReceivedMessage = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex my={2} p={2} ml={1}>
        <Box>
          <Avatar onClick={onOpen} name={props.username} size={"xs"} mr={1} />
        </Box>
        <Box
          maxW={"80%"}
          bg={"#e7e7e7"}
          color={"black"}
          borderRadius={10}
          borderLeftRadius={0}
          borderBottomRadius={10}
          p={2}
        >
          <Flex justifyContent={"space-between"}>
            <Text
              px={2}
              color={"purple.500"}
              fontWeight={600}
              fontSize={"xs"}
              mt={-1}
            >
              {props.username}
            </Text>
            <Text px={2} fontSize={"xs"} color={"gray"} mt={-1}>
              {props.email}
            </Text>
          </Flex>
          <Text px={2} fontSize={"sm"}>
            {props.message}
          </Text>
        </Box>
      </Flex>

      {/* Modal */}
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
              <Avatar name={props.username} size={"xl"} />
              <Text fontWeight={600} mt={2} color={"gray.700"}>
                {props.username}
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

export default GroupReceivedMessage;
