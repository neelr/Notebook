/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from "react";
import { Client } from "../../prismic-configuration";
import marked from "marked";
import { Text, Flex, Heading, Image, Link as RebassLink } from "rebass";
import Link from "next/link";
import { RichText } from "prismic-reactjs";
import Head from "next/head";
import { Star } from "react-feather"
import getConfig from 'next/config'
import fetch from "isomorphic-unfetch"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

const A = ({ sx, ...props }) => (
    <RebassLink
        sx={{
            color: "primary",

            textDecoration: "underline",

            textDecorationStyle: "wavy",

            ":hover": {
                color: "secondary",

                cursor: "pointer"
            },

            ...sx
        }}
        {...props}
    />
);

export default class Story extends React.Component {
    state = {
        starColor: null,
        votes: 0
    }
    upvote() {
        if (!this.state.starColor) {
            this.setState({ starColor: "gold", votes: 1 })
            fetch("/api/upvote", {
                method: "POST",
                body: JSON.stringify({
                    id: this.props.story.id
                })
            })
        }
    }
    render() {
        return (
            <Flex
                flexDirection="column"
                sx={{
                    a: {
                        color: "primary",

                        textDecoration: "underline",

                        textDecorationStyle: "wavy",

                        ":hover": {
                            color: "secondary",

                            cursor: "pointer"
                        }
                    }
                }}
            >
                <Head>
                    <title>{RichText.asText(this.props.story.data.title)}</title>
<<<<<<< HEAD
                    <meta
                        property="og:title"
                        content={RichText.asText(this.props.story.data.title)}
                    />

                    <meta
                        property="og:image"
                        content={this.props.story.data.cover_image.url}
                    />

                    <meta
                        property="description"
                        content={RichText.asText(this.props.story.data.description)}
                    />
=======
                    <meta property="og:title" content={RichText.asText(this.props.story.data.title)} />
                    <meta property="og:image" content={this.props.story.data.cover_image.url} />
                    <meta property="description" content={RichText.asText(this.props.story.data.description)} />
>>>>>>> ab2e476a5acb3ae7cd107b024b45b8227f75043a
                </Head>

                <Heading fontSize={[4, 5, 6]}>
                    {RichText.asText(this.props.story.data.title)}
                </Heading>
                <Flex m="10px" onClick={() => this.upvote()}>
                    <Text pr="3px">{this.props.votes + this.state.votes}</Text>
                    <Star size={24} sx={{
                        fill: this.state.starColor,
                        color: this.state.starColor ? "transparent" : "secondary",
                        ":hover": {
                            cursor: "pointer"
                        }
                    }} />
                </Flex>
                <Text m="10px" fontWeight="500">
                    {this.props.story.data.date_created}
                </Text>

                <Flex flexWrap="wrap">
                    {this.props.story.tags.map(tag => (
                        <Link href={`/tags/${tag}`}>
                            <A mx="5px">
                                <Text sx={{ fontSize: 1, fontStyle: "italic" }}>#{tag}</Text>
                            </A>
                        </Link>
                    ))}
                </Flex>
<<<<<<< HEAD

                <Image
                    m="15px"
                    width="50%"
                    src={this.props.story.data.cover_image.url}
                />

                {this.props.story.data.body1.map(slice =>
                    slice.slice_type == "html" ? (
                        <Flex
                            sx={{
                                blockquote: {
                                    fontStyle: "italic",

                                    borderLeft: "5px solid red",

                                    pl: "15px"
                                },

                                code: {
                                    bg: "highlight",

                                    color: "orange",

                                    p: "5px"
                                }
                            }}
                            flexDirection="column"
                            dangerouslySetInnerHTML={{
                                __html: marked(RichText.asText(slice.primary.html))
                            }}
                        />
                    ) : (
                            <RichText render={slice.primary.text} />
                        )
                )}
                <Flex width="100%" height="3px" my="15px" bg="secondary" />
                <Flex onClick={() => this.upvote()}>
                    <Text pr="10px">Liked what you read? Star it!</Text>
                    <Star size={24} sx={{
                        fill: this.state.starColor,
                        color: this.state.starColor ? "transparent" : "secondary",
                        ":hover": {
                            cursor: "pointer"
                        }
                    }} />
                </Flex>
=======
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
>>>>>>> ab2e476a5acb3ae7cd107b024b45b8227f75043a
            </Flex>
        );
    }
<<<<<<< HEAD

    static async getInitialProps(ctx) {
        const response = await Client.getByID(ctx.query.id);
        const votes = await fetch(serverRuntimeConfig.UPVOTE_URL)
        let json = await votes.json()
        return { story: response, votes: json[ctx.query.id] ? json[ctx.query.id] : 0 };
=======
    static async getInitialProps(ctx) {
        const response = await Client.getByID(ctx.query.id)
        return { story: response }
>>>>>>> ab2e476a5acb3ae7cd107b024b45b8227f75043a
    }
}
