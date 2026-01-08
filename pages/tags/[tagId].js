import React from "react";
import { Flex, Heading } from "theme-ui";
import { Section, Boop } from "@components/semantics";
import Head from "next/head";
import { local } from "../api/get";
import Masonry from "react-masonry-css";
import Post from "@components/post";
import Tag from "@components/Tag";
import { notionClient } from "@lib/notion";

export default function Tags({ docs, id, upvotes, ...props }) {
  return (
    <Flex sx={{ flexDirection: "column" }}>
      <Head>
        <title>#{id}</title>
        <meta property="og:title" content={`Notebook v3.5 #${id}`} />
        <meta
          property="og:image"
          content="http://notebook.neelr.dev/openg.png"
        />
        <meta
          property="description"
          content={`A nice way to jot down thoughts, ideas, or articles I have! Currently viewing the ${id} tag`}
        />
      </Head>
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
            ml: "20px",
            mb: "10px",
          }}
        >
          <Tag tag={id} asTitle tilted />
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

export async function getServerSideProps(ctx) {
  const { docs, total_pages } = await notionClient.getPagesByTag(
    ctx.params.tagId,
    ctx.query.page ? parseInt(ctx.query.page) : 1
  );

  // Add your upvotes logic here if needed
  let upvotes = {};
  for (let i = 0; i < docs.length; i++) {
    let votes = await local(docs[i].id);
    upvotes[docs[i].id] = votes;
  }

  return {
    props: {
      docs,
      upvotes,
      total_pages,
      page: ctx.query.page ? parseInt(ctx.query.page) : 1,
      id: ctx.params.tagId,
    },
  };
}
