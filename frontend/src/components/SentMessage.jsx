import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

const SentMessage = (props) => {
  return (
    <>
      <Flex my={2} p={2} mr={1} justifyContent={"end"}>
        <Box
          maxW={"85%"}
          bg={"#805AD5"}
          color={"white"}
          borderRadius={10}
          borderRightRadius={0}
          borderTopRadius={10}
          p={2}
        >
          <Text px={2} fontSize={"sm"}>
            {props.message}
          </Text>
        </Box>
      </Flex>
    </>
  );
};

export default SentMessage;
