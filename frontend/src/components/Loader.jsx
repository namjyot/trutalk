import React from "react";
import { Flex, Spinner, Box } from "@chakra-ui/react";

const Loader = () => {
  return (
    <>
      <Flex
        pt={2}
        h={"82%"}
        overflowY={"scroll"}
        css={{ transition: ".2s" }}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Box id="scroll-focus"></Box>
      </Flex>
    </>
  );
};

export default Loader;
