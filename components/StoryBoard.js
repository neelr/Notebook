/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { Text, Flex, Heading, Image, Link as RebassLink } from "rebass";
import Link from "next/link"
import { Star } from "react-feather"

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

export default class extends React.Component {
    render() {
        return (
            <Flex flexDirection="column">
                {
                    this.props.stories.results.map(d => (
                        <Flex flexDirection="column">
                            <Flex width="100%" height="3px" my="15px" bg="secondary" />
                            <Link href={`/stories/${d.id}`}>
                                <Flex sx={{
                                    flexDirection: ["column", "column", "row"],
                                    transition: "all 0.3s",
                                    ":hover": {
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                        cursor: "pointer"
                                    }
                                }}>
                                    <Flex width="50%">
                                        <img sx={{
                                            width: ["auto", "100%"],
                                            mx: ["auto", "0"]
                                        }} alt={d.data.cover_image.alt} src={d.data.cover_image.url} />
                                    </Flex>
                                    <Flex flexDirection="column" p="10px">
                                        <Heading>{d.data.title[0].text}</Heading>
                                        <Text fontStyle="italic">{d.data.date_created}</Text>
                                        <Text>{d.data.description[0].text}</Text>
                                        <Flex flexWrap="wrap">
                                            {d.tags.map(tag => (
                                                <Link href={`/tags/${tag}`}>
                                                    <A mx="5px">
                                                        <Text sx={{ fontSize: 1, fontStyle: "italic" }}>#{tag}</Text>
                                                    </A>
                                                </Link>
                                            ))}
                                        </Flex>
                                        <Flex m="10px">
                                            <Text pr="3px">{this.props.votes[d.id] ? this.props.votes[d.id] : 0}</Text>
                                            <Star size={24} sx={{ fill: "gold", color: "transparent" }} />
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Link>
                        </Flex>
                    ))
                }
            </Flex>
        )
    }
}