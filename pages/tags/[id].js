import React from 'react'
import { Client } from '../../prismic-configuration'
import Prismic from "prismic-javascript"
import { Text, Flex, Heading, Button } from "rebass";
import StoryBoard from "../../components/StoryBoard"
import Head from "next/head"
import { local } from "../api/get"

export default class extends React.Component {
    render() {
        return (
            <Flex flexDirection="column">
                <Head>
                    <title>#{this.props.id}</title>
                    <meta property="og:title" content={`Notebook v2.0 #${this.props.id}`} />
                    <meta property="og:image" content="http://notebook.neelr.dev/openg.png" />
                    <meta property="description" content="A nice way to jot down thoughts, ideas, or articles I have!" />
                </Head>
                <Heading fontSize={[4, 5, 6]}>#{this.props.id}</Heading>
                <Text>All articles with the #{this.props.id} tag!</Text>
                <StoryBoard stories={this.props.doc} votes={this.props.upvotes} />
                <Flex>
                    {parseInt(this.props.page) == 1 ? null :
                        <Button href={`/tags/${this.props.id}/?page=${parseInt(this.props.page) - 1}`} as="a" mx="auto" my="10px" sx={{ ":hover": { cursor: "pointer", bg: "secondary" } }}>&lt;&lt; Back</Button>
                    }
                    {
                        this.props.doc.total_pages == parseInt(this.props.page) ? null :
                            <Button href={`/tags/${this.props.id}/?page=${parseInt(this.props.page) + 1}`} as="a" mx="auto" my="10px" sx={{ ":hover": { cursor: "pointer", bg: "secondary" } }}>Next Page >></Button>
                    }
                </Flex>
            </Flex>
        )
    }
}
export let getServerSideProps = async (ctx) => {
    const response = await Client.query(
        Prismic.Predicates.at("document.tags", [ctx.query.id]),
        {
            orderings: '[my.stories.date_created desc]',
            pageSize: 5,
            page: ctx.query.page ? ctx.query.page : 1
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
            id: ctx.query.id,
            page: ctx.query.page ? ctx.query.page : 1,
            upvotes: upvotes
        }
    }
}