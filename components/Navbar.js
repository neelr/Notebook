import { Flex, Text, Link as A, Image } from "@theme-ui/components";
import Link from "next/link";
import useSound from "use-sound";
import { useColorMode } from "theme-ui";
import { Sun, Moon } from "react-feather";
import { Boop } from "./semantics";

const NavLink = ({ sx, ...props }) => (
  <A
    sx={{
      fontWeight: 700,
      color: "primary",
      textDecoration: "none",
      fontSize: 3,
      ":hover": {
        color: "accent",
        cursor: "pointer",
      },
      ...sx,
    }}
    {...props}
  />
);

export default function NavBar({ sx, ...props }) {
  const [colorMode, setColorMode] = useColorMode();
  const [switchOn] = useSound("/sounds/switch-on.mp3");
  const [switchOff] = useSound("/sounds/switch-off.mp3");
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
              ":hover": {
                cursor: "pointer",
              },
            }}
            src="https://neelr.dev/static/self.jpg"
          />
        </Boop>
      </Flex>
      <Link href="/" legacyBehavior>
        <NavLink m="auto">My Notebook</NavLink>
      </Link>
      <NavLink
        sx={{
          boxSizing: "border-box",
          p: "5px",
          m: "5px",
          display: "flex",
          transition: "all 0.4s",
          borderRadius: "200px",
          border: "2px solid transparent",
          position: "absolute",
          right: "10px",
          my: "auto",
        }}
        onClick={() => {
          if (colorMode == "default") {
            switchOn();
          } else {
            switchOff();
          }
          setColorMode(colorMode === "default" ? "dark" : "default");
        }}
      >
        <Boop rotation="10">
          {colorMode == "default" ? <Sun size={24} /> : <Moon size={24} />}
        </Boop>
      </NavLink>
    </Flex>
  );
}
