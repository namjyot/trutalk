import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

const ReceivedMessage = (props) => {
  return (
    <>
      <Flex my={2} p={2} ml={1}>
        <Box
          maxW={"85%"}
          bg={"#e7e7e7"}
          color={"black"}
          borderRadius={10}
          borderLeftRadius={0}
          borderBottomRadius={10}
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

export default ReceivedMessage;
