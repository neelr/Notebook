import React from "react";
import { Text, Flex, Styled } from "theme-ui";

export default () => (
  <Flex
    sx={{
      height: "20vh",
    }}
    mt="auto"
  >
    <Text m="auto">
      Created with ☕ by <Styled.a href="https://neelr.dev">@neelr</Styled.a>
    </Text>
  </Flex>
);
