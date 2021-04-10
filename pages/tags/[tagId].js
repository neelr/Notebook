import React from "react";
import { Client } from "../../prismic-configuration";
import Prismic from "prismic-javascript";
import { Flex, Heading } from "theme-ui";
import { Section, Boop } from "@components/semantics";
import Head from "next/head";
import { local } from "../api/get";
import Masonry from "react-masonry-css";
import Post from "@components/post";

export default function Tags({ docs, id, upvotes, ...props }) {
  return (
    <Flex sx={{ flexDirection: "column" }}>
      <Head>
        <title>#{id}</title>
        <meta property="og:title" content={`Notebook v3.0 #${id}`} />
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
            borderBottom: "5px solid highlight",
            ml: "20px",
            mb: "10px",
          }}
        >
          <Flex>#{id}</Flex>
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
export let getServerSideProps = async (ctx) => {
  const response = await Client.query(
    Prismic.Predicates.at("document.tags", [ctx.query.tagId]),
    {
      orderings: "[my.stories.date_created desc]",
      pageSize: 10,
      page: ctx.query.page ? ctx.query.page : 1,
    }
  );
  let upvotes = {};
  for (let i = 0; i < response.results.length; i++) {
    let votes = await local(response.results[i].id);
    upvotes[response.results[i].id] = votes;
  }
  return {
    props: {
      docs: response.results,
      id: ctx.query.tagId,
      page: ctx.query.page ? ctx.query.page : 1,
      upvotes: upvotes,
    },
  };
};
