import React, { useEffect, useState } from "react";
import { Column } from "./semantics";
import { Text, Flex, Heading, Image, Link as A, Box } from "theme-ui";
import useSound from "use-sound";
import Link from "next/link";
import { Heart } from "react-feather";
import Tag from "./Tag";

export default function Post({
  title,
  src,
  tags,
  desc,
  date,
  votes,
  slug,
  ...props
}) {
  const [playHover, { stop }] = useSound("/sounds/hover.mp3", {
    volume: 0.2,
  });
    return (
    <A
      sx={{
        textDecoration: "none",
        color: "text",
        ":hover": {
          color: "text",
        },
      }}
      href={`/stories/${slug}`}
    >
      <Column
        onMouseEnter={() => playHover()}
        onMouseLeave={() => stop()}
        sx={{
          bg: "secondary",
          mx: "10px",
          my: "10px",
          boxShadow: "5px 5px #272838",
          transition: "all 0.2s",
          borderRadius: "2px",
          width: "300px",
          overflow: "hidden",
          ":hover": {
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
              <Tag key={v} tag={v} />
            ))}
          </Flex>
          <Flex
            sx={{
              mt: "5px",
              ml: "auto",
              bg: "pink",
              color: "background",
              borderRadius: "4px",
              px: "10px",
              py: "4px",
              alignItems: "center",
            }}
          >
            <Text sx={{ fontFamily: "heading", fontWeight: "bold" }}>{votes ? votes : 0}</Text>
            <Heart
              size={18}
              style={{
                marginLeft: 8,
                fill: "currentColor",
              }}
            />
          </Flex>
        </Column>
      </Column>
    </A>
  );
}

const hoverColors = [
  "rgb(255, 45, 83)", // Hot magenta - vintage neon
  "rgb(0, 255, 163)", // Cyber green - CRT phosphor
  "rgb(255, 179, 0)", // Nuclear yellow - warning screens
  "rgb(66, 230, 255)", // Plasma blue - old sci-fi
  "rgb(255, 81, 49)", // Radioactive orange - arcade glow
  "rgb(191, 85, 255)", // Deep purple - synthwave
  "rgb(255, 0, 128)", // Electric pink - retro gaming
  "rgb(0, 174, 255)", // Cerulean blue - old terminals
  "rgb(255, 145, 0)", // Burning orange - 8-bit era
  "rgb(124, 255, 0)", // Toxic green - matrix aesthetic
];

export function MiniPost({ title, tags, desc, date, votes, slug, ...props }) {
  const [playHover, { stop }] = useSound("/sounds/retro.mp3", { volume: 0.2 });
  const [hoverColor, setHoverColor] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const randomColor =
      hoverColors[Math.floor(Math.random() * hoverColors.length)];
    setHoverColor(randomColor);
  }, []);

  return (
    <Link href={`/stories/${slug}`} passHref legacyBehavior>
      <Box
        as="a"
        sx={{
          textDecoration: "none",
          color: "text",
          display: "block",
        }}
      >
        <Box
          onMouseEnter={() => {
            playHover();
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            stop();
            setIsHovered(false);
          }}
          sx={{
            position: "relative",
            bg: "transparent",
            mx: "8px",
            my: "8px",
            borderColor: "secondary",
            borderRadius: "4px",
            width: "280px",
            height: "180px",
            overflow: "hidden",
            padding: "12px",
            // Enhanced transition to include transform for smooth movement
            transition:
              "all 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            mask: isHovered
              ? "linear-gradient(-60deg, #E0FBFC 30%, #E0FBFC55, #E0FBFC 70%) right/350% 100%"
              : "none",
            animation: isHovered ? "shimmer 2.5s infinite" : "none",
            transform: isHovered ? "translateY(-8px)" : "translateY(0)", // Adds upward movement on hover
            "@keyframes shimmer": {
              "100%": {
                maskPosition: "left",
              },
            },
            ":hover": {
              "& .post-text": {
                color: hoverColor,
              },
              "& .post-tags": {
                color: hoverColor,
              },
            },
          }}
        >
          <Box sx={{ mb: "40px" }}>
            <Flex
              sx={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Heading
                className="post-text"
                sx={{
                  fontSize: 2,
                  pr: 2,
                  transition: "color 0.2s ease",
                }}
              >
                {title}
              </Heading>
              <Flex
                sx={{
                  bg: "pink",
                  color: "background",
                  borderRadius: "4px",
                  px: "8px",
                  py: "2px",
                  alignItems: "center",
                  minWidth: "fit-content",
                }}
              >
                <Text sx={{ fontSize: 1, fontFamily: "heading", fontWeight: "bold" }}>{votes ? votes : 0}</Text>
                <Heart
                  size={14}
                  style={{
                    marginLeft: 6,
                    fill: "currentColor",
                  }}
                />
              </Flex>
            </Flex>

            <Text
              className="post-text"
              sx={{
                fontSize: 0,
                color: "muted",
                fontStyle: "italic",
                mb: 1,
                transition: "color 0.2s ease",
              }}
            >
              {date}
            </Text>
            {desc && (
              <Text
                className="post-text"
                sx={{
                  fontSize: 0,
                  color: "muted",
                  mb: 2,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  transition: "color 0.2s ease",
                }}
              >
                {desc}
              </Text>
            )}

            <Flex
              sx={{
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              {tags.map((v) => (
                <Tag key={v} tag={v} size="small" />
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
