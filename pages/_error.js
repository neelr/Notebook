import React from "react";
import { Flex, Heading } from "@theme-ui/components";
import Head from "next/head";

export default class extends React.Component {
  render() {
    return (
      <Flex flexDirection="column">
        <Head>
          <title>Error 404</title>
        </Head>
        <Heading fontSize={[4, 5, 6]} m="auto">
          Error 404
        </Heading>
      </Flex>
    );
  }
}
