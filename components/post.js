import { Column } from "./semantics";
import { Text, Flex, Heading, Image, Link as A } from "theme-ui";
import useSound from "use-sound";
import Link from "next/link";
import { Heart } from "react-feather";

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
              <Link href={`/tags/${v}`}>
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
