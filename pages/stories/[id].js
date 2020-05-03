import React from 'react'
import { renderToString } from 'react-dom/server'
import { Client } from '../../prismic-configuration'
import marked from "marked"
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
                    <meta property="og:title" content={RichText.asText(this.props.story.data.title)} />
                    <meta property="og:image" content={this.props.story.data.cover_image.url} />
                    <meta property="description" content={RichText.asText(this.props.story.data.description)} />
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
                {this.props.story.data.body1.map(slice => (
                    slice.slice_type == "html" ?
                        <Flex sx={{
                            blockquote: {
                                fontStyle: "italic",
                                borderLeft: "5px solid red",
                                pl: "15px"
                            },
                            code: {
                                bg: "hsl(230, 25%, 18%)",
                                color: "white",
                                p: "5px"
                            }
                        }} flexDirection="column" dangerouslySetInnerHTML={{ __html: marked(RichText.asText(slice.primary.html)) }} />
                        : <RichText render={slice.primary.text} />
                ))}
            </Flex>
        )
    }
    static async getInitialProps(ctx) {
        const response = await Client.getByID(ctx.query.id)
        return { story: response }
    }
}