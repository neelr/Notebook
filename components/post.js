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
        cursor: "pointer",
        ":hover": {
          color: "text",
        },
      }}
      href={`/stories/${slug}`}
    >
      <Flex
        onMouseEnter={() => playHover()}
        onMouseLeave={() => stop()}
        sx={{
          py: "16px",
          borderBottom: "1px solid",
          borderColor: "gray",
          transition: "all 0.2s",
          alignItems: "flex-start",
          gap: "16px",
          ":hover": {
            cursor: "pointer",
            bg: "secondary",
          },
          px: "8px",
        }}
      >
        {src && (
          <Image
            src={src}
            sx={{
              width: "80px",
              minWidth: "80px",
              borderRadius: "4px",
            }}
          />
        )}
        <Column sx={{ flex: 1, gap: "4px" }}>
          <Flex sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Heading sx={{ fontSize: 2, fontFamily: "heading" }}>{title}</Heading>
            <Flex
              sx={{
                color: "muted",
                alignItems: "center",
                minWidth: "fit-content",
                ml: "8px",
                fontSize: 0,
              }}
            >
              <Text sx={{ fontFamily: "body" }}>{votes ? votes : 0}</Text>
              <Heart
                size={14}
                style={{
                  marginLeft: 4,
                  fill: "currentColor",
                }}
              />
            </Flex>
          </Flex>
          <Text
            sx={{
              fontSize: 0,
              color: "muted",
              fontStyle: "italic",
            }}
          >
            {date}
          </Text>
          {desc && (
            <Text
              sx={{
                fontSize: 1,
                color: "muted",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }}
            >
              {desc}
            </Text>
          )}
          <Flex sx={{ flexWrap: "wrap", mt: "4px" }}>
            {tags.map((v) => (
              <Tag key={v} tag={v} size="small" />
            ))}
          </Flex>
        </Column>
      </Flex>
    </A>
  );
}

export function MiniPost({ title, src, tags, desc, date, votes, slug, ...props }) {
  const [playHover, { stop }] = useSound("/sounds/retro.mp3", { volume: 0.2 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/stories/${slug}`} passHref legacyBehavior>
      <Box
        as="a"
        sx={{
          textDecoration: "none",
          color: "text",
          display: "block",
          cursor: "pointer",
        }}
      >
        <Flex
          onMouseEnter={() => {
            playHover();
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            stop();
            setIsHovered(false);
          }}
          sx={{
            py: "16px",
            px: "12px",
            borderLeft: "3px solid",
            borderLeftColor: "highlight",
            borderBottom: "1px solid",
            borderBottomColor: "gray",
            transition: "all 0.2s ease",
            alignItems: "flex-start",
            gap: "12px",
            position: "relative",
            overflow: "hidden",
            mask: isHovered
              ? "linear-gradient(-60deg, #fafafa 30%, #fafafa55, #fafafa 70%) right/350% 100%"
              : "none",
            animation: isHovered ? "shimmer 2.5s infinite" : "none",
            "@keyframes shimmer": {
              "100%": {
                maskPosition: "left",
              },
            },
            ":hover": {
              bg: "secondary",
              cursor: "pointer",
            },
          }}
        >
          {src && (
            <Image
              src={src}
              sx={{
                width: "80px",
                minWidth: "80px",
                borderRadius: "4px",
              }}
            />
          )}
          <Column sx={{ flex: 1, gap: "4px" }}>
            <Flex
              sx={{
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Heading
                sx={{
                  fontSize: 2,
                  pr: 2,
                  fontFamily: "heading",
                  transition: "color 0.2s ease",
                }}
              >
                {title}
              </Heading>
              <Flex
                sx={{
                  color: "muted",
                  alignItems: "center",
                  minWidth: "fit-content",
                  fontSize: 0,
                }}
              >
                <Text sx={{ fontFamily: "body" }}>{votes ? votes : 0}</Text>
                <Heart
                  size={14}
                  style={{
                    marginLeft: 4,
                    fill: "currentColor",
                  }}
                />
              </Flex>
            </Flex>

            <Text
              sx={{
                fontSize: 0,
                color: "muted",
                fontStyle: "italic",
              }}
            >
              {date}
            </Text>
            {desc && (
              <Text
                sx={{
                  fontSize: 0,
                  color: "muted",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {desc}
              </Text>
            )}

            <Flex sx={{ flexWrap: "wrap", mt: "4px" }}>
              {tags.map((v) => (
                <Tag key={v} tag={v} size="small" />
              ))}
            </Flex>
          </Column>
        </Flex>
      </Box>
    </Link>
  );
}
