import React from 'react'
import { Client } from '../prismic-configuration'
import Prismic from "prismic-javascript"
import { Text, Flex, Heading, Button } from "rebass";
import Head from "next/head"
import StoryBoard from "../components/StoryBoard"
import Link from "next/link"

export default class extends React.Component {
    static async getInitialProps(ctx) {
        const response = await Client.query(
            Prismic.Predicates.at("document.type", "stories"),
            {
                orderings: '[my.stories.date_created desc]',
                pageSize: 100,
                page: ctx.query.page ? ctx.query.page : 1
            }
        )
        return {
            doc: response,
            page: ctx.query.page ? ctx.query.page : 1
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
                <StoryBoard stories={this.props.doc} />
                {this.props.doc.total_pages > 1 ?
                    <Flex>
                        <Link href={`/tags/${this.props.id}?page=${parseInt(this.props.page) - 1}`}>
                            <Button mx="auto" my="10px" sx={{ ":hover": { cursor: "pointer", bg: "secondary" } }}>Back</Button>
                        </Link>
                        <Link href={`/tags/${this.props.id}?page=${parseInt(this.props.page) + 1}`}>
                            <Button mx="auto" my="10px" sx={{ ":hover": { cursor: "pointer", bg: "secondary" } }}>Load More...</Button>
                        </Link>
                    </Flex>
                    : null
                }
            </Flex>
        )
    }
}