import { Flex, Text, Link as A, Image } from "@theme-ui/components";
import Link from "next/link";
import useSound from "use-sound";
import { Boop } from "./semantics";

const NavLink = ({ sx, ...props }) => (
  <A
    sx={{
      fontWeight: 400,
      color: "text",
      textDecoration: "none",
      fontSize: 2,
      fontFamily: "heading",
      cursor: "pointer",
      ":hover": {
        color: "muted",
      },
      ...sx,
    }}
    {...props}
  />
);

export default function NavBar({ sx, ...props }) {
  const [playPop, { stop }] = useSound("/sounds/boing.mp3", {
    volume: 0.5,
    sprite: {
      main: [20, 1570],
    },
  });
  return (
    <Flex
      sx={{
        width: "100%",
        p: "10px",
        ...sx,
      }}
      {...props}
    >
      <Flex
        sx={{
          position: "absolute",
          left: 20,
          width: "40px",
          my: "auto",
          overflow: "hidden",
          cursor: "pointer",
        }}
        href="https://neelr.dev"
        onMouseEnter={() => playPop({ id: "main" })}
        onMouseLeave={stop}
        as="a"
      >
        <Boop rotation="30" tension={1500}>
          <Image
            sx={{
              borderRadius: "40px",
            }}
            src="https://neelr.dev/static/self.jpg"
          />
        </Boop>
      </Flex>
      <Link href="/" legacyBehavior>
        <NavLink m="auto">My Notebook</NavLink>
      </Link>
    </Flex>
  );
}
