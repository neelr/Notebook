import React from 'react'
import { Client } from '../../prismic-configuration'
import Prismic from "prismic-javascript"
import { Text, Flex, Heading, Button } from "rebass";
import StoryBoard from "../../components/StoryBoard"
import Head from "next/head"
import Link from "next/link"

export default class extends React.Component {
    static async getInitialProps(ctx) {
        const response = await Client.query(
            Prismic.Predicates.at("document.tags", [ctx.query.id]),
            {
                orderings: '[my.stories.data.date_created desc]',
                pageSize: 100,
                page: ctx.query.page ? ctx.query.page : 1
            }
        )
        return {
            doc: response,
            id: ctx.query.id,
            page: ctx.query.page ? ctx.query.page : 1
        }
    }
    render() {
        return (
            <Flex flexDirection="column">
                <Head>
                    <title>#{this.props.id}</title>
                </Head>
                <Heading fontSize={[4, 5, 6]}>#{this.props.id}</Heading>
                <Text>All articles with the #{this.props.id} tag!</Text>
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