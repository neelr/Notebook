import React from 'react'
import { Client } from '../../prismic-configuration'
import Prismic from "prismic-javascript"
import { Text, Flex, Heading, Image, Link as RebassLink } from "rebass";
import Link from "next/link"
import { RichText } from "prismic-reactjs"
import Head from "next/head"

const A = ({ sx, ...props }) => (
    <RebassLink
        sx={{
            color: "primary",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
            ":hover": {
                color: "secondary",
                cursor: "pointer",
            },
            ...sx
        }}
        {...props} />
)
export default class Story extends React.Component {
    render() {
        return (
            <Flex flexDirection="column" sx={{
                a: {
                    color: "primary",
                    textDecoration: "underline",
                    textDecorationStyle: "wavy",
                    ":hover": {
                        color: "secondary",
                        cursor: "pointer",
                    }
                }
            }}>
                <Head>
                    <title>{RichText.asText(this.props.story.data.title)}</title>
                </Head>
                <Heading fontSize={[4, 5, 6]}>{RichText.asText(this.props.story.data.title)}</Heading>
                <Text m="10px" fontWeight="500">{this.props.story.data.date_created}</Text>
                <Flex flexWrap="wrap">
                    {this.props.story.tags.map(tag => (
                        <Link href={`/tags/${tag}`}>
                            <A mx="5px">
                                <Text sx={{ fontSize: 1, fontStyle: "italic" }}>#{tag}</Text>
                            </A>
                        </Link>
                    ))}
                </Flex>
                <Image m="15px" width="50%" src={this.props.story.data.cover_image.url} />
                <RichText render={this.props.story.data.body} />
            </Flex>
        )
    }
    static async getInitialProps(ctx) {
        const response = await Client.getByID(ctx.query.id)

        return { story: response }
    }
}