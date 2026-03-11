import React from "react";
import { Flex, Heading } from "theme-ui";
import { Section, Column } from "@components/semantics";
import Head from "next/head";
import { local } from "../api/get";
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
          maxWidth: "750px",
          mx: "auto",
          width: "100%",
        }}
      >
        <Heading
          sx={{
            fontSize: [3, 4],
            mr: "auto",
            mb: "16px",
          }}
        >
          <Tag tag={id} asTitle tilted />
        </Heading>
        <Column>
          {docs.map((v) => (
            <Post
              key={v.slug}
              title={v.title}
              src={v.coverImage}
              tags={v.tags}
              desc={v.description}
              date={v.dateCreated}
              votes={upvotes[v.id]}
              slug={v.slug}
            />
          ))}
        </Column>
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
