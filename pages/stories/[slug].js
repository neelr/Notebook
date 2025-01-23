import {
  Text,
  Flex,
  Heading,
  Image,
  Link as RebassLink,
  useColorMode,
} from "theme-ui";
import Link from "next/link";
import Head from "next/head";
import { Heart } from "react-feather";
import fetch from "isomorphic-unfetch";
import { local } from "../api/get";
import { promises as fs } from "fs";
import { useState } from "react";
import useSound from "use-sound";
import { Boop, slugify } from "@components/semantics";
import theme from "@components/theme";
import { useScroll, motion } from "framer-motion";
import { notionClient } from "@lib/notion";
import RSS from "rss";

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
  const { scrollYProgress } = useScroll();
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

  const content = story.content.map((v) => v.content).join("  ");

  return (
    <Flex
      sx={{
        flexDirection: "column",
        width: ["90vw", "80vw", "60vw"],
        mx: "auto",
      }}
    >
      <Flex
        sx={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "10px",
        }}
      >
        <motion.div
          style={{
            scaleX: scrollYProgress,
            transformOrigin: "left",
            width: "100vw",
            mr: "auto",
            background:
              colorMode == "default"
                ? theme.colors.primary
                : theme.colors.modes.dark.primary,
          }}
        />
      </Flex>
      <Head>
        <title>{story.title}</title>
        <meta property="og:title" content={story.title} />

        <meta property="og:image" content={story.coverImage} />

        <meta property="og:description" content={story.description} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={story.title} />

        <meta property="twitter:image" content={story.coverImage} />

        <meta property="twitter:description" content={story.description} />
      </Head>
      <Flex
        sx={{
          flexWrap: "wrap",
        }}
      >
        {story.tags.map((v) => (
          <Link href={`/tags/${v}`} legacyBehavior>
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
      <Heading sx={{ fontSize: [4, 5, 6] }}>{story.title}</Heading>
      <Text
        sx={{
          color: "muted",
          fontStyle: "italic",
        }}
      >
        {story.dateCreated} · {Math.ceil(content.split(" ").length / 200)} min
        read
      </Text>
      <Text
        sx={{
          color: "muted",
          width: "90%",
          fontStyle: "italic",
        }}
      >
        {story.description}
      </Text>
      <Image sx={{ my: "20px" }} src={story.coverImage} />
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
          __html: content,
        }}
      />

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

export async function getStaticPaths() {
  try {
    // Fetch all stories from Notion
    const { results } = await notionClient.query({}, { page_size: 1500 });

    const processedResults = results;
    // Create id cache mapping
    const slugs = {};
    processedResults.forEach((story) => {
      slugs[story.slug] = story.id;
    });

    // Get upvotes for each story
    const upvotes = {};
    for (const story of processedResults) {
      const votes = await local(story.id);
      upvotes[story.id] = votes;
    }

    // Save id cache
    await fs.writeFile("./id_cache.json", JSON.stringify(slugs));

    // Create RSS feed
    const rssFeed = new RSS({
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

    // Add items to RSS feed
    processedResults.forEach((story) => {
      rssFeed.item({
        title: story.title,
        description: story.description,
        url: `https://notebook.neelr.dev/stories/${story.slug}`,
        guid: story.id,
        date: story.dateCreated,
        categories: story.tags,
        custom_elements: [
          {
            "media:content": {
              _attr: {
                url: story.coverImage,
                medium: "image",
              },
            },
          },
          {
            "stars:count": upvotes[story.id],
          },
        ],
      });
    });

    // Save RSS feed
    await fs.writeFile("./public/feed.rss", rssFeed.xml());

    // Save first 5 stories to JSON
    await fs.writeFile(
      "./public/feed_first5.json",
      JSON.stringify(
        processedResults.slice(0, 5).map((story) => ({
          title: story.title,
          description: story.description,
          url: `https://notebook.neelr.dev/stories/${story.slug}`,
          guid: story.id,
          date: story.dateCreated,
          categories: story.tags,
          image: story.coverImage,
          upvotes: upvotes[story.id],
        }))
      )
    );

    return {
      paths: processedResults.map((story) => ({
        params: { slug: story.slug },
      })),
      fallback: true,
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    let id;

    // Try to get ID from cache first
    try {
      const ids = JSON.parse(await fs.readFile("./id_cache.json"));
      if (Object.keys(ids).includes(params.slug)) {
        id = ids[params.slug];
      } else {
        // If not in cache, rebuild the cache
        const { results } = await notionClient.query({}, { page_size: 1500 });
        const slugs = {};
        results.forEach((story) => {
          slugs[slugify(story.title.toLowerCase())] = story.id;
        });
        id = slugs[params.slug];
      }
    } catch {
      // If cache read fails, fetch all and rebuild cache
      const { results } = await notionClient.query({}, { page_size: 1500 });
      const slugs = {};
      results.forEach((story) => {
        slugs[slugify(story.title.toLowerCase())] = story.id;
      });
      id = slugs[params.slug];
    }

    if (!id) {
      return { notFound: true };
    }

    // Fetch the specific story by ID
    const story = await notionClient.client.pages.retrieve({ page_id: id });
    const stars = await local(id);

    // Transform and parse the story data
    const transformedStory = await notionClient.transformPageData(story);
    const parsedStory = await notionClient.parse(transformedStory);

    return {
      props: {
        story: parsedStory,
        votes: stars,
        id,
      },
      revalidate: 30,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true,
    };
  }
}
