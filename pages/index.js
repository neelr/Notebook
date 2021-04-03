import React, { useState } from "react";
import { Client } from "../prismic-configuration";
import Prismic from "prismic-javascript";
import { Text, Flex, Heading, Image } from "theme-ui";
import Book from "@components/book";
import Star from "@components/star";
import useSound from "use-sound";
import { Column, Section } from "@components/semantics";
import Head from "next/head";
import { local } from "./api/get";

export default function Home({ featured, ...props }) {
  let [tilt, setTilt] = useState(-1);
  const [playGlug] = useSound("/sounds/glug-a.mp3", {
    playbackRate: 0.8 + Math.abs(tilt) / 10,
    volume: 0.5,
  });
  const [playHover] = useSound("/sounds/hover.mp3", {
    volume: 0.2,
  });

  let Post = ({ title, src, tags, desc, date, ...props }) => (
    <Column
      onMouseEnter={() => playHover()}
      sx={{
        bg: "secondary",
        mx: "10px",
        my: "5px",
        boxShadow: "2px 2px #272838",
        transition: "all 0.2s",
        borderRadius: "2px",
        width: "300px",
        overflow: "hidden",
        mb: "auto",
        ":hover": {
          boxShadow: "5px 5px #272838",
          cursor: "pointer",
        },
      }}
    >
      <Image src={src} />
      <Column
        sx={{
          mx: "30px",
          my: "10px",
        }}
      >
        <Heading>{title}</Heading>
        <Text
          sx={{
            fontSize: 1,
            color: "muted",
            fontStyle: "italic",
          }}
        >
          {date}
        </Text>
        <Text
          sx={{
            fontSize: 1,
            color: "muted",
          }}
        >
          {desc}
        </Text>
        <Flex
          sx={{
            flexWrap: "wrap",
          }}
        >
          {tags.map((v) => (
            <Text
              sx={{
                color: "highlight",
                mx: "5px",
                my: "2px",
                ":hover": {
                  color: "muted",
                  cursor: "pointer",
                },
              }}
            >
              #{v}
            </Text>
          ))}
        </Flex>
      </Column>
    </Column>
  );

  console.log(props);
  return (
    <Flex sx={{ flexDirection: "column" }}>
      <Head>
        <title>Notebook v2.0</title>
        <meta property="og:title" content="Notebook v2.0" />
        <meta
          property="og:image"
          content="http://notebook.neelr.dev/openg.png"
        />
        <meta
          property="og:description"
          content="A nice way to jot down thoughts, ideas, or articles I have!"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Notebook v2.0" />
        <meta
          property="twiter:image"
          content="http://notebook.neelr.dev/openg.png"
        />
        <meta
          property="twitter:description"
          content="A nice way to jot down thoughts, ideas, or articles I have!"
        />
      </Head>
      <Section>
        <Column
          sx={{
            "& > svg": {
              fill: "text",
              width: "100%",
              height: "100%",
            },
            width: [0, "130px", "25vw", "25vw"],
            position: "absolute",
            right: "15px",
            top: [0, 18, "5px", "5px"],
            zIndex: "-100",
          }}
        >
          <Book />
        </Column>
        <Heading
          sx={{
            fontSize: [4, 5, 6],
            mx: "auto",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
            textDecorationColor: "#EE6C4D",
            my: "18px",
            transition: "all 0.2s",
            userSelect: "none",
            ":hover": {
              rotate: `${tilt}deg`,
              cursor: "pointer",
            },
          }}
          onClick={() => {
            playGlug();
            setTilt(tilt - 3);
          }}
          onMouseLeave={() => setTilt(-1)}
        >
          Notebook 3.0
        </Heading>
        <Text
          mx="auto"
          sx={{
            width: ["90vw", "50vw", "35vw"],
          }}
        >
          A fun place to jot down my thoughts and ideas! You'll find everything
          from my favorite music to political thoughts! Have a stroll, and stay
          a while!
        </Text>
      </Section>
      <Section
        sx={{
          width: ["90vw", "85vw", "75vw"],
          mx: "auto",
        }}
      >
        <Heading
          sx={{
            fontSize: [3, 4, 5],
            mr: "auto",
            borderBottom: "5px solid highlight",
            ml: "20px",
            mb: "10px",
          }}
        >
          <Flex>
            Featured{" "}
            <Flex
              sx={{
                height: "40px",
                width: "40px",
                ml: "10px",
              }}
            >
              <Star />
            </Flex>
          </Flex>
        </Heading>
        <Flex sx={{ flexDirection: "row", flexWrap: "wrap" }}>
          {featured.map((v) => (
            <Post
              title={v.data.title[0].text}
              src={v.data.cover_image.url}
              tags={v.tags}
              desc={v.data.description[0].text}
              date={v.data.date_created}
            />
          ))}
        </Flex>
      </Section>
    </Flex>
  );
}
export async function getStaticProps(ctx) {
  let response = await Client.query(
    Prismic.Predicates.at("document.type", "stories"),
    {
      orderings: "[my.stories.date_created desc]",
      pageSize: 1500,
      page: 1,
    }
  );
  let upvotes = {};
  for (let i = 0; i < response.results.length; i++) {
    let votes = await local(response.results[i].id);
    upvotes[response.results[i].id] = votes;
  }
  let docs = response.results.filter((v) => !v.tags.includes("featured"));
  let featured = response.results.filter((v) => v.tags.includes("featured"));
  console.log(featured);
  return {
    props: {
      docs,
      featured,
      upvotes: upvotes,
    },
    revalidate: 10,
  };
}
