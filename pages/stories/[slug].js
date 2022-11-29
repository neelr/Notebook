import { Client } from "../../prismic-configuration";
import Prismic from "prismic-javascript";
import marked from "marked";
import {
  Text,
  Flex,
  Heading,
  Image,
  Link as RebassLink,
  useColorMode,
} from "theme-ui";
import Link from "next/link";
import { RichText, Elements } from "prismic-reactjs";
import Head from "next/head";
import { Heart } from "react-feather";
import fetch from "isomorphic-unfetch";
import { local } from "../api/get";
import fs from "fs/promises";
import { useState } from "react";
import useSound from "use-sound";
import { Boop } from "@components/semantics";
import theme from "@components/theme";
import rss from "rss-generator";

var htmlSerializer = function (type, element, content, children) {
  switch (type) {
    case Elements.paragraph:
      return <Text sx={{ my: "5px" }}>{children}</Text>;
    case Elements.hyperlink:
      return (
        <A href={element.data.url} target="_blank">
          {children}
        </A>
      );
    case Elements.heading1:
      return (
        <Text
          sx={{
            mb: "5px",
            mt: "20px",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
          }}
          as="h1"
        >
          {children}
        </Text>
      );
    case Elements.heading2:
      return (
        <Text
          sx={{
            mb: "5px",
            mt: "20px",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
          }}
          as="h2"
        >
          {children}
        </Text>
      );
    case Elements.heading3:
      return (
        <Text
          sx={{
            mb: "5px",
            mt: "20px",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
          }}
          as="h3"
        >
          {children}
        </Text>
      );
    case Elements.heading4:
      return (
        <Text
          sx={{
            mb: "5px",
            mt: "20px",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
          }}
          as="h4"
        >
          {children}
        </Text>
      );
    case Elements.heading5:
      return (
        <Text
          sx={{
            mb: "5px",
            mt: "20px",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
          }}
          as="h5"
        >
          {children}
        </Text>
      );
    case Elements.heading6:
      return (
        <Text
          sx={{
            mb: "5px",
            mt: "20px",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
          }}
          as="h6"
        >
          {children}
        </Text>
      );
    default:
      return null;
  }
};
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

      ...sx,
    }}
    {...props}
  />
);

export default function Story({ id, story, votes, ...props }) {
  let [count, setCount] = useState(false);
  const [colorMode, setColorMode] = useColorMode();
  const [playBell] = useSound("/sounds/bell.mp3", {
    volume: 0.3,
    sprite: {
      main: [50, 1600],
    },
  });
  const [playHover, { stop }] = useSound("/sounds/hover.mp3", {
    volume: 0.2,
  });
  let upvote = () => {
    if (!count) {
      setCount(true);
      fetch("/api/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
    }
  };
  if (!story) {
    return (
      <Flex flexDirection="column">
        <Head>
          <title>Error 404</title>
        </Head>
        <Heading
          sx={{
            fontSize: [4, 5, 6],
          }}
          m="auto"
          data-text="Error 404"
          className="glitch"
        >
          Error 404
        </Heading>
        <style jsx global>{`
          @keyframes noise-anim {
            0% {
              clip-path: inset(40% 0 61% 0);
            }
            20% {
              clip-path: inset(92% 0 1% 0);
            }
            40% {
              clip-path: inset(43% 0 1% 0);
            }
            60% {
              clip-path: inset(25% 0 58% 0);
            }
            80% {
              clip-path: inset(54% 0 7% 0);
            }
            100% {
              clip-path: inset(58% 0 43% 0);
            }
          }
          @keyframes noise-anim-2 {
            0% {
              clip-path: inset(50% 0 31% 0);
            }
            20% {
              clip-path: inset(1% 0 92% 0);
            }
            40% {
              clip-path: inset(36% 0 83% 0);
            }
            60% {
              clip-path: inset(82% 0 43% 0);
            }
            80% {
              clip-path: inset(91% 0 7% 0);
            }
            100% {
              clip-path: inset(38% 0 19% 0);
            }
          }
          .glitch {
            position: relative;
          }
          .glitch::before,
          .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .glitch::before {
            left: 3px;
            text-shadow: -1px 0 red;
            background: ${colorMode == "default"
              ? theme.colors.background
              : theme.colors.modes.dark.background};
            animation: noise-anim 2s infinite linear alternate-reverse;
          }
          .glitch::after {
            right: 3px;
            text-shadow: 1px 0 blue;

            background: ${colorMode == "default"
              ? theme.colors.background
              : theme.colors.modes.dark.background};
            animation: noise-anim-2 2s infinite linear alternate-reverse;
          }
        `}</style>
      </Flex>
    );
  }
  return (
    <Flex
      sx={{
        flexDirection: "column",
        width: ["90vw", "80vw", "60vw"],
        mx: "auto",
      }}
    >
      <Head>
        <title>{RichText.asText(story.data.title)}</title>
        <meta property="og:title" content={RichText.asText(story.data.title)} />

        <meta property="og:image" content={story.data.cover_image.url} />

        <meta
          property="og:description"
          content={RichText.asText(story.data.description)}
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content={RichText.asText(story.data.title)}
        />

        <meta property="twitter:image" content={story.data.cover_image.url} />

        <meta
          property="twitter:description"
          content={RichText.asText(story.data.description)}
        />
      </Head>
      <Flex
        sx={{
          flexWrap: "wrap",
        }}
      >
        {story.tags.map((v) => (
          <Link href={`/tags/${v}`}>
            <Text
              sx={{
                color: "highlight",
                mx: "5px",
                my: "2px",
                fontStyle: "italic",
                fontWeight: "bold",
                ":hover": {
                  color: "muted",
                  cursor: "pointer",
                },
              }}
            >
              #{v}
            </Text>
          </Link>
        ))}
        <Flex
          sx={{
            mt: "5px",
            ml: "auto",
            color: "pink",
            ":hover": {
              cursor: "pointer",
            },
          }}
          onMouseEnter={() => (count ? null : playHover())}
          onMouseLeave={stop}
          onClick={() => {
            if (!count) {
              playBell({ id: "main" });
            }
            upvote();
            setCount(true);
          }}
        >
          {votes ? votes + count : 0 + count}
          <Flex ml="10px" />
          <Boop rotation="10">
            <Heart
              size={24}
              style={{
                fill: count ? "pink" : "transparent",
              }}
            />
          </Boop>
        </Flex>
      </Flex>
      <Heading sx={{ fontSize: [4, 5, 6] }}>
        {RichText.asText(story.data.title)}
      </Heading>
      <Text
        sx={{
          color: "muted",
          fontStyle: "italic",
        }}
      >
        {story.data.date_created} ·{" "}
        {Math.round(
          story.data.body1
            .map((v) => RichText.asText(v.primary[v.slice_type]))
            .join(" ")
            .split(" ").length / 200
        )}{" "}
        min read
      </Text>
      <Text
        sx={{
          color: "muted",
          width: "90%",
          fontStyle: "italic",
        }}
      >
        {RichText.asText(story.data.description)}
      </Text>
      <Image sx={{ my: "20px" }} src={story.data.cover_image.url} />
      {story.data.body1.map((slice) =>
        slice.slice_type == "html" ? (
          <Flex
            sx={{
              flexDirection: "column",
              blockquote: {
                fontStyle: "italic",
                borderLeft: "5px solid red",
                pl: "15px",
              },

              code: {
                bg: "muted",
                color: "background",
                p: "5px",
                borderRadius: "3px",
                my: "50px",
              },

              p: {
                my: "5px",
              },

              a: {
                color: "primary",

                textDecoration: "underline",

                textDecorationStyle: "wavy",

                ":hover": {
                  color: "secondary",

                  cursor: "pointer",
                },
              },

              "h1,h2,h3,h4,h5,h6": {
                mb: "5px",
                mt: "20px",
                textDecoration: "underline",
                textDecorationStyle: "wavy",
              },
            }}
            dangerouslySetInnerHTML={{
              __html: marked(RichText.asText(slice.primary.html)),
            }}
          />
        ) : (
          <RichText
            render={slice.primary.text}
            htmlSerializer={htmlSerializer}
          />
        )
      )}
      <Flex sx={{ width: "100%", height: "3px", bg: "muted", my: "10px" }} />
      <Flex>
        <Text sx={{ color: "muted", fontStyle: "italic" }}>
          Thanks for reading! Liked the story? Click the heart
        </Text>
        <Flex
          sx={{
            color: "pink",
            ":hover": {
              cursor: "pointer",
            },
          }}
          onMouseEnter={() => (count ? null : playHover())}
          onMouseLeave={stop}
          onClick={() => {
            if (!count) {
              playBell({ id: "main" });
            }
            upvote();
            setCount(true);
          }}
        >
          <Flex ml="10px" />
          <Boop rotation="10">
            <Heart
              size={24}
              style={{
                fill: count ? "pink" : "transparent",
              }}
            />
          </Boop>
        </Flex>
      </Flex>
    </Flex>
  );
}

export let getStaticPaths = async (ctx) => {
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
  let slugs = {};
  response.results.forEach((v) => {
    slugs[v.slugs[0]] = v.id;
  });
  await fs.writeFile("./id_cache.json", JSON.stringify(slugs));
  let rssFeed = new rss({
    title: "My Notebook",
    description:
      "A fun place to jot down my thoughts and ideas! You'll find everything from my favorite music to political thoughts! Have a stroll, and stay a while!",
    feed_url: "https://notebook.neelr.dev/feed.rss",
    site_url: "https://notebook.neelr.dev",
    managingEditor: "Neel Redkar",
    language: "en",
    categories: ["Tech", "Notebook", "Politics", "Philosophy"],
    pubDate: new Date().toUTCString(),
    ttl: "60",
  });
  response.results.forEach((v) => {
    rssFeed.item({
      title: RichText.asText(v.data.title),
      description: RichText.asText(v.data.description),
      url: `https://notebook.neelr.dev/stories/${v.slugs[0]}`,
      guid: v.id,
      date: v.data.date_created,
      categories: v.tags,
    });
  });
  await fs.writeFile("./public/feed.rss", rssFeed.xml());

  return {
    paths: response.results.map((v) => {
      return { params: { slug: v.slugs[0] } };
    }),
    fallback: true,
  };
};
export let getStaticProps = async ({ params }) => {
  let id;
  try {
    let ids = JSON.parse(await fs.readFile("./id_cache.json"));
    if (Object.keys(ids).includes(params.slug)) {
      id = ids[params.slug];
    } else {
      let response = await Client.query(
        Prismic.Predicates.at("document.type", "stories"),
        {
          orderings: "[my.stories.date_created desc]",
          pageSize: 1500,
          page: 1,
        }
      );
      let slugs = {};
      response.results.forEach((v) => {
        slugs[v.slugs[0]] = v.id;
      });
      id = slugs[params.slug];
    }
  } catch {
    let response = await Client.query(
      Prismic.Predicates.at("document.type", "stories"),
      {
        orderings: "[my.stories.date_created desc]",
        pageSize: 1500,
        page: 1,
      }
    );
    let slugs = {};
    response.results.forEach((v) => {
      slugs[v.slugs[0]] = v.id;
    });
    id = slugs[params.slug];
  }

  const response = await Client.getByID(id);
  let stars = await local(id);

  return { props: { story: response, votes: stars, id }, revalidate: 30 };
};
