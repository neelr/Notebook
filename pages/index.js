import React from 'react'
import { Client } from '../prismic-configuration'
import Prismic from "prismic-javascript"
import { Text, Flex, Heading, Button } from "rebass";
import Head from "next/head"
import StoryBoard from "../components/StoryBoard"
import { local } from "./api/get"

export default class extends React.Component {

    render() {
        return (
            <Flex flexDirection="column">
                <Head>
                    <title>Notebook v2.0</title>
                    <meta property="og:title" content="Notebook v2.0" />
                    <meta property="og:image" content="http://notebook.neelr.dev/openg.png" />
                    <meta property="og:description" content="A nice way to jot down thoughts, ideas, or articles I have!" />
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:title" content="Notebook v2.0" />
                    <meta property="twiter:image" content="http://notebook.neelr.dev/openg.png" />
                    <meta property="twitter:description" content="A nice way to jot down thoughts, ideas, or articles I have!" />
                </Head>
                <Heading fontSize={[4, 5, 6]}>Notebook v2.0</Heading>
                <Text>Rebuilding my Notebook from an Airtable CMS, to Prismic, and adding cool new designs! This is just a fun way for me to write down thoughts, ideas, or articles!</Text>
                <StoryBoard stories={this.props.doc} votes={this.props.upvotes} />
            </Flex>
        )
    }
}
export async function getStaticProps(ctx) {
    const response = await Client.query(
        Prismic.Predicates.at("document.type", "stories"),
        {
            orderings: '[my.stories.date_created desc]',
            pageSize: 1500,
            page: 1
        }
    )
    let upvotes = {}
    for (let i = 0; i < response.results.length; i++) {
        let votes = await local(response.results[i].id)
        upvotes[response.results[i].id] = votes
    }
    return {
        props: {
            doc: response,
            upvotes: upvotes
        },
        revalidate: 10
    }
}