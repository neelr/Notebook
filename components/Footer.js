import React from "react";
import { Text, Flex, Styled } from "theme-ui";

export default () => (
  <Flex
    sx={{
      height: "80px",
      borderTop: "1px solid",
      borderColor: "gray",
      mt: "auto",
    }}
  >
    <Text m="auto" sx={{ color: "muted", fontSize: 1 }}>
      Created with ☕ by <Styled.a href="https://neelr.dev">@neelr</Styled.a>
    </Text>
  </Flex>
);
