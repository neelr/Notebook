import React from 'react'
import { Client } from '../prismic-configuration'
import Prismic from "prismic-javascript"
import { Text, Flex, Heading, Image, Link as RebassLink } from "rebass";
import Head from "next/head"
import StoryBoard from "../components/StoryBoard"

export default class extends React.Component {
    render() {
        return (
            <Flex flexDirection="column">
                <Head>
                    <title>Error 404</title>
                </Head>
                <Heading fontSize={[4, 5, 6]} color="red">Error 404</Heading>
            </Flex>
        )
    }
}