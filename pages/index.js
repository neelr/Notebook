import React from 'react'
import { Client } from '../prismic-configuration'
import Prismic from "prismic-javascript"
import { Text, Flex, Heading, Button } from "rebass";
import Head from "next/head"
import StoryBoard from "../components/StoryBoard"
import Link from "next/link"
import getConfig from 'next/config'
import fetch from "isomorphic-unfetch"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default class extends React.Component {
    static async getInitialProps(ctx) {
        const response = await Client.query(
            Prismic.Predicates.at("document.type", "stories"),
            {
                orderings: '[my.stories.date_created desc]',
                pageSize: 15,
                page: ctx.query.page ? ctx.query.page : 1
            }
        )
        const votes = await fetch(serverRuntimeConfig.UPVOTE_URL)
        let json = await votes.json()
        return {
            doc: response,
            page: ctx.query.page ? ctx.query.page : 1,
            upvotes: json
        }
    }
    render() {
        return (
            <Flex flexDirection="column">
                <Head>
                    <title>Notebook v2.0</title>
                    <meta property="og:title" content="Notebook v2.0" />
                    <meta property="og:image" content="http://notebook.neelr.dev/openg.png" />
                    <meta property="description" content="A nice way to jot down thoughts, ideas, or articles I have!" />
                </Head>
                <Heading fontSize={[4, 5, 6]}>Notebook v2.0</Heading>
                <Text>Rebuilding my Notebook from an Airtable CMS, to Prismic, and adding cool new designs! This is just a fun way for me to write down thoughts, ideas, or articles!</Text>
                <StoryBoard stories={this.props.doc} votes={this.props.upvotes} />
                <Flex>
                    {parseInt(this.props.page) == 1 ? null :
                        <Button href={`/?page=${parseInt(this.props.page) - 1}`} as="a" mx="auto" my="10px" sx={{ ":hover": { cursor: "pointer", bg: "secondary" } }}>&lt;&lt; Back</Button>
                    }
                    {
                        this.props.doc.total_pages == parseInt(this.props.page) ? null :
                            <Button href={`/?page=${parseInt(this.props.page) + 1}`} as="a" mx="auto" my="10px" sx={{ ":hover": { cursor: "pointer", bg: "secondary" } }}>Next Page >></Button>
                    }
                </Flex>
            </Flex>
        )
    }
}