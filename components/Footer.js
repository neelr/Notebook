import React from "react"
import { Text, Flex } from "rebass"
import { Styled } from "theme-ui"

export default () => (
    <Flex height="20vh" mt="auto">
        <Text m="auto">Created with ☕ by <Styled.a href="https://neelr.dev">@neelr</Styled.a></Text>
    </Flex>
)