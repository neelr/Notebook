import React, { useState } from "react";
import { Client } from "../prismic-configuration";
import Prismic from "prismic-javascript";
import { Text, Flex, Heading, Image } from "theme-ui";
import Book from "@components/icons/book";
import Star from "@components/icons/star";
import useSound from "use-sound";
import { Column, Section, Boop } from "@components/semantics";
import Head from "next/head";
import { local } from "./api/get";
import Clock from "@components/icons/clock";
import Masonry from "react-masonry-css";
import Post from "@components/post";
import Link from "next/link";

export default function Home({ featured, docs, upvotes, ...props }) {
  let [tilt, setTilt] = useState(-1);
  const [playGlug] = useSound("/sounds/glug-a.mp3", {
    playbackRate: 0.8 + Math.abs(tilt) / 10,
    volume: 0.5,
  });
  const [playPop] = useSound("/sounds/pop.mp3", {
    volume: 0.7,
  });
  return (
    <Flex sx={{ flexDirection: "column" }}>
      <Head>
        <title>Notebook v3.0</title>
        <meta property="og:title" content="Notebook v3.0" />
        <meta
          property="og:image"
          content="http://notebook.neelr.dev/openg.png"
        />
        <meta
          property="og:description"
          content="A nice way to jot down thoughts, ideas, or articles I have!"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Notebook v3.0" />
        <meta
          property="twiter:image"
          content="http://notebook.neelr.dev/openg.png"
        />
        <meta
          property="twitter:description"
          content="A nice way to jot down thoughts, ideas, or articles I have!"
        />
        <script src='https://analytics.stacc.cc/api/script/v925J2qMyDZV'></script>
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
          onMouseLeave={() => {
            if (tilt < -5) {
              playPop();
            }
            setTilt(-1);
          }}
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
        <Masonry
          breakpointCols={{
            10000: 3,
            1024: 2,
            640: 1,
            default: 1,
          }}
          className="masonry-posts"
          columnClassName="masonry-posts-column"
        >
          {featured.map((v) => {
            return (
              <Boop rotation="3">
                <Post
                  title={v.data.title[0].text}
                  src={v.data.cover_image.url}
                  tags={v.tags}
                  desc={v.data.description[0].text}
                  date={v.data.date_created}
                  votes={upvotes[v.id]}
                  slug={v.slugs[0]}
                />
              </Boop>
            );
          })}
        </Masonry>
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
            Recent{" "}
            <Flex
              sx={{
                height: "50px",
                width: "50px",
                stroke: "muted",
                ml: "10px",
                fill: "transparent",
                "& > svg": {
                  mb: "-10px",
                },
              }}
            >
              <Clock />
            </Flex>
          </Flex>
        </Heading>
        <Masonry
          breakpointCols={{
            10000: 3,
            1024: 2,
            640: 1,
            default: 1,
          }}
          className="masonry-posts"
          columnClassName="masonry-posts-column"
        >
          {docs.map((v) => (
            <Boop rotation="3">
              <Post
                title={v.data.title[0].text}
                src={v.data.cover_image.url}
                tags={v.tags}
                desc={v.data.description[0].text}
                date={v.data.date_created}
                votes={upvotes[v.id]}
                slug={v.slugs[0]}
              />
            </Boop>
          ))}
        </Masonry>
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
  return {
    props: {
      docs,
      featured,
      upvotes,
    },
    revalidate: 10,
  };
}
