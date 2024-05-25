import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

const NoChatText = (props) => {
  return (
    <>
      <Flex h={"65svh"} alignItems={"center"}>
        <Box>
          <Text fontWeight={"bold"}>{props.message}</Text>
        </Box>
      </Flex>
    </>
  );
};

export default NoChatText;
