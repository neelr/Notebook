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
import fetch from "isomorphic-unfetch"
import { local } from "../api/get"

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
                headers: {
                    'Content-Type': 'application/json'
                },
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
                    <meta
                        property="og:title"
                        content={RichText.asText(this.props.story.data.title)}
                    />

                    <meta
                        property="og:image"
                        content={this.props.story.data.cover_image.url}
                    />

                    <meta
                        property="og:description"
                        content={RichText.asText(this.props.story.data.description)}
                    />
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta
                        property="twitter:title"
                        content={RichText.asText(this.props.story.data.title)}
                    />

                    <meta
                        property="twitter:image"
                        content={this.props.story.data.cover_image.url}
                    />

                    <meta
                        property="twitter:description"
                        content={RichText.asText(this.props.story.data.description)}
                    />
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

                <Image
                    m="15px"
                    width="50%"
                    src={this.props.story.data.cover_image.url}
                    alt={this.props.story.data.cover_image.alt}
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
            </Flex>
        );
    }
}

export let getServerSideProps = async (ctx) => {
    const response = await Client.getByID(ctx.query.id);
    let stars = await local(ctx.query.id)
    return { props: { story: response, votes: stars } };
}