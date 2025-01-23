import React, { useState } from "react";
import { Text, Flex, Heading, Image } from "theme-ui";
import Book from "@components/icons/book";
import Star from "@components/icons/star";
import useSound from "use-sound";
import { Column, Section, Boop, slugify } from "@components/semantics";
import Head from "next/head";
import { local } from "./api/get";
import Clock from "@components/icons/clock";
import Masonry from "react-masonry-css";
import Post, { MiniPost } from "@components/post";
import { notionClient } from "../lib/notion";
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
        <script src="https://analytics.stacc.cc/api/script/v925J2qMyDZV"></script>
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
            10000: 4, // Show 4 columns on very large screens
            1400: 3, // 3 columns on regular desktop
            1024: 2, // 2 columns on smaller desktop/tablet
            640: 1, // 1 column on mobile
            default: 1,
          }}
          className="masonry-posts"
          columnClassName="masonry-posts-column"
        >
          {featured.map((v) => {
            return (
              <MiniPost
                title={v.title}
                src={v.coverImage}
                tags={v.tags}
                desc={v.description}
                date={v.dateCreated}
                votes={upvotes[v.id]}
                slug={slugify(v.slug)}
              />
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
                title={v.title}
                src={v.coverImage}
                tags={v.tags}
                desc={v.description}
                date={v.dateCreated}
                votes={upvotes[v.id]}
                slug={v.slug}
              />
            </Boop>
          ))}
        </Masonry>
      </Section>
    </Flex>
  );
}
export async function getStaticProps(ctx) {
  const { featured, docs } = await notionClient.getHomepageData();

  const all = [...featured, ...docs];
  // Add your upvotes logic here if needed
  let upvotes = {};
  for (let i = 0; i < all.length; i++) {
    let votes = await local(all[i].id);
    upvotes[all[i].id] = votes;
  }

  return {
    props: {
      docs,
      featured,
      upvotes,
    },
    revalidate: 10,
  };
}
