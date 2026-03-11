import {
  Text,
  Flex,
  Heading,
  Image,
  Box,
  Link as RebassLink,
} from "theme-ui";
import Link from "next/link";
import Head from "next/head";
import { Heart } from "react-feather";
import fetch from "isomorphic-unfetch";
import { local } from "../api/get.js";
import { useState } from "react";
import useSound from "use-sound";
import { Boop } from "@components/semantics";
import Tag from "@components/Tag";
import theme from "@components/theme";
import { useScroll, motion } from "framer-motion";
import { notionClient } from "@lib/notion";
import handleCacheAndRSS from "@lib/handleCache";

const A = ({ sx, ...props }) => (
  <RebassLink
    sx={{
      color: "primary",
      textDecoration: "underline",
      ":hover": {
        color: "accent",
        cursor: "pointer",
        opacity: 0.8,
      },
      ...sx,
    }}
    {...props}
  />
);

export default function Story({ id, story, votes, ...props }) {
  const { scrollYProgress } = useScroll();
  let [count, setCount] = useState(false);
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
            background: ${theme.colors.background};
            animation: noise-anim 2s infinite linear alternate-reverse;
          }
          .glitch::after {
            right: 3px;
            text-shadow: 1px 0 blue;

            background: ${theme.colors.background};
            animation: noise-anim-2 2s infinite linear alternate-reverse;
          }
        `}</style>
      </Flex>
    );
  }

  const content = story.content.map((v) => v.content).join("  ");

  const getReadingTime = (htmlContent) => {
    const strippedContent = htmlContent.replace(/<[^>]*>/g, " ");
    const words = strippedContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return Math.ceil(words.length / 200);
  };

  const readingTime = getReadingTime(content);

  return (
    <Flex
      sx={{
        flexDirection: "column",
        maxWidth: "750px",
        mx: "auto",
        width: ["90vw", "90vw", "750px"],
        px: [3, 3, 0],
      }}
    >
      <Flex
        sx={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "3px",
          zIndex: 9999,
        }}
      >
        <motion.div
          style={{
            scaleX: scrollYProgress,
            transformOrigin: "left",
            width: "100vw",
            mr: "auto",
            background: theme.colors.primary,
          }}
        />
      </Flex>
      <Head>
        <title>{story.title}</title>
        <meta name="description" content={story.description} />
        <meta property="og:title" content={story.title} />
        <meta property="og:description" content={story.description} />
        <meta property="og:image" content={story.coverImage} />
        <meta property="og:url" content={`https://notebook.neelr.dev/stories/${story.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={story.title} />
        <meta name="twitter:description" content={story.description} />
        <meta name="twitter:image" content={story.coverImage} />
      </Head>
      <Flex
        sx={{
          flexWrap: "wrap",
          alignItems: "center",
          mt: 3,
        }}
      >
        {story.tags.map((v) => (
          <Tag key={v} tag={v} sx={{ my: 0 }} />
        ))}
        <Box sx={{ ml: "auto" }}>
          <Boop rotation="10">
            <Flex
              sx={{
                bg: count ? "highlight" : "secondary",
                color: count ? "background" : "muted",
                border: count ? "none" : "1px solid",
                borderColor: "gray",
                borderRadius: "4px",
                px: "10px",
                py: "4px",
                alignItems: "center",
                transition: "all 0.2s ease",
              ":hover": {
                opacity: 0.8,
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
            <Text sx={{ fontFamily: "body", fontWeight: "bold" }}>{votes ? votes + count : 0 + count}</Text>
            <Heart
              size={18}
              style={{
                marginLeft: 8,
                fill: "currentColor",
                display: "block",
              }}
            />
            </Flex>
          </Boop>
        </Box>
      </Flex>
      <Flex
        sx={{
          mt: 3,
          gap: "20px",
          alignItems: "flex-start",
          flexDirection: ["column", "row"],
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Heading sx={{ fontSize: [3, 4, 5], fontFamily: "heading" }}>{story.title}</Heading>
          <Text
            sx={{
              color: "muted",
              fontStyle: "italic",
              mt: 1,
            }}
          >
            {story.dateCreated} · {readingTime} min read
          </Text>
          <Text
            sx={{
              color: "muted",
              fontStyle: "italic",
              mt: 1,
              display: "block",
            }}
          >
            {story.description}
          </Text>
        </Box>
        {story.coverImage && (
          <Image
            sx={{
              width: ["100%", "180px"],
              minWidth: ["auto", "180px"],
              borderRadius: "4px",
              opacity: 0.9,
            }}
            src={story.coverImage}
          />
        )}
      </Flex>
      <Flex sx={{ width: "100%", height: "1px", bg: "gray", my: "24px" }} />
      <Flex
        sx={{
          flexDirection: "column",
          position: "relative",
          overflow: ["hidden", "hidden", "visible"],
          blockquote: {
            fontStyle: "italic",
            borderLeft: "3px solid",
            borderColor: "gray",
            pl: "15px",
          },

          code: {
            bg: "secondary",
            color: "text",
            p: "5px",
            borderRadius: "3px",
            my: "50px",
          },

          p: {
            my: "15px",
          },

          a: {
            color: "primary",
            textDecoration: "underline",
            ":hover": {
              color: "accent",
              cursor: "pointer",
              opacity: 0.8,
            },
          },

          "h1,h2,h3,h4,h5,h6": {
            mb: "5px",
            mt: "20px",
            pb: "4px",
            borderBottom: "1px solid",
            borderColor: "gray",
          },
        }}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      <Flex sx={{ width: "100%", height: "1px", bg: "gray", my: "20px" }} />
      <Flex sx={{ alignItems: "center", mb: 5 }}>
        <Text sx={{ color: "muted", fontStyle: "italic" }}>
          Thanks for reading! Liked the story? Click the heart
        </Text>
        <Boop rotation="10">
          <Flex
            sx={{
              bg: count ? "highlight" : "secondary",
              color: count ? "background" : "muted",
              border: count ? "none" : "1px solid",
              borderColor: "gray",
              borderRadius: "4px",
              p: "8px",
              alignItems: "center",
              justifyContent: "center",
              ml: "10px",
              transition: "all 0.2s ease",
              ":hover": {
                opacity: 0.8,
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
            <Heart
              size={18}
              style={{
                fill: "currentColor",
                display: "block",
              }}
            />
          </Flex>
        </Boop>
      </Flex>
    </Flex>
  );
}

// Replace the getStaticPaths and getStaticProps in paste.txt with:
export async function getStaticPaths() {
  try {
    // Fetch all stories from Notion
    const { results } = await notionClient.query({}, { page_size: 1500 });

    // Generate RSS feed if needed
    await handleCacheAndRSS(results, { writeFiles: true });

    // Return paths for Next.js
    return {
      paths: results.map((story) => ({
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
    // Fetch the page directly using the slug
    const pageData = await notionClient.getPageBySlug(params.slug);

    if (!pageData) {
      return {
        notFound: true,
        revalidate: 300,
      };
    }

    // Get stars/votes count
    const stars = await local(pageData.id);

    // Transform and parse the story data
    const transformedStory = await notionClient.transformPageData(
      pageData.page
    );
    const parsedStory = await notionClient.parse(transformedStory);

    return {
      props: {
        story: parsedStory,
        votes: stars,
        id: pageData.id,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}
