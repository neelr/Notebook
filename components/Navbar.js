import { Flex, Text, Link as A } from "@theme-ui/components";
import Link from "next/link";
import useSound from "use-sound";
import { useColorMode } from "theme-ui";
import { Sun, Moon } from "react-feather";

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

export default ({ sx, ...props }) => {
  const [colorMode, setColorMode] = useColorMode();
  const [switchOn] = useSound("/sounds/switch-on.mp3");
  const [switchOff] = useSound("/sounds/switch-off.mp3");
  return (
    <Flex
      sx={{
        width: "100%",
        p: "10px",
        ...sx,
      }}
      {...props}
    >
      <NavLink m="auto" href="/">
        My Notebook
      </NavLink>
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
          ":hover": {
            cursor: "pointer",
            border: "2px solid",
            color: "accent",
          },
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
        {colorMode == "default" ? <Sun size={24} /> : <Moon size={24} />}
      </NavLink>
    </Flex>
  );
};
