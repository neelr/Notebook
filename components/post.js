import { Column } from "./semantics";
import { Text, Flex, Heading, Image, Link as A, Box } from "theme-ui";
import useSound from "use-sound";
import Link from "next/link";
import { Heart, Tag } from "react-feather";

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
              <Link href={`/tags/${v}`} legacyBehavior>
                <Text
                  sx={{
                    color: "highlight",
                    mx: "5px",
                    my: "2px",
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
          </Flex>
          <Flex
            sx={{
              mt: "5px",
              ml: "auto",
              color: "pink",
            }}
          >
            {votes ? votes : 0}
            <Heart
              size={24}
              style={{
                marginLeft: 10,
                fill: "pink",
              }}
            />
          </Flex>
        </Column>
      </Column>
    </A>
  );
}

export function MiniPost({ title, tags, desc, date, votes, slug, ...props }) {
  const [playHover, { stop }] = useSound("/sounds/hover.mp3", {
    volume: 0.2,
  });

  return (
    <Link href={`/stories/${slug}`} passHref legacyBehavior>
      <Box
        as="a"
        sx={{
          textDecoration: "none",
          color: "text",
          display: "block",
          ":hover": {
            color: "text",
            textDecoration: "none",
            ".pin-icon": {
              opacity: 1,
              color: "yellow",
            },
          },
        }}
      >
        <Column
          onMouseEnter={() => playHover()}
          onMouseLeave={() => stop()}
          sx={{
            position: "relative",
            bg: "secondary",
            mx: "8px",
            my: "8px",
            boxShadow: "3px 3px #272838",
            transition: "all 0.2s",
            borderRadius: "8px",
            width: "280px",
            height: "180px",
            overflow: "hidden",
            padding: "12px",
            ":hover": {
              cursor: "pointer",
              transform: "translateY(-2px)",
            },
          }}
        >
          {/* Pin icon with hover effect */}
          <Box
            className="pin-icon"
            sx={{
              position: "absolute",
              top: "8px",
              right: "12px",
              opacity: 0.5,
              transition: "all 0.2s ease",
              color: "text",
            }}
          >
            <Tag size={20} />
          </Box>

          {/* Main content area */}
          <Box sx={{ mb: "40px" }}>
            <Heading sx={{ fontSize: 2, mb: 2, pr: 4 }}>{title}</Heading>
            <Text
              sx={{
                fontSize: 0,
                color: "muted",
                fontStyle: "italic",
                mb: 1,
              }}
            >
              {date}
            </Text>
            {desc && (
              <Text
                sx={{
                  fontSize: 0,
                  color: "muted",
                  mb: 2,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {desc}
              </Text>
            )}

            {/* Tags */}
            <Flex
              sx={{
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              {tags.map((v) => (
                <Text
                  key={v}
                  sx={{
                    color: "highlight",
                    mx: "5px",
                    my: "2px",
                    fontSize: 0,
                    fontWeight: "bold",
                  }}
                >
                  #{v}
                </Text>
              ))}
            </Flex>
          </Box>

          {/* Likes - absolutely positioned */}
          <Flex
            sx={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              color: "pink",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Text sx={{ fontSize: 1, textDecoration: "none" }}>
              {votes ? votes : 0}
            </Text>
            <Heart
              size={18}
              style={{
                marginLeft: 8,
                fill: "pink",
              }}
            />
          </Flex>
        </Column>
      </Box>
    </Link>
  );
}
