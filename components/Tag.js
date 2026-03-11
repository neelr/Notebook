import { Text } from "theme-ui";
import Link from "next/link";
import useSound from "use-sound";

export default function Tag({ tag, size = "default", tilted = false, asTitle = false, sx: sxProp, ...props }) {
  const [playSwitch] = useSound("/sounds/switch.mp3", {
    volume: 0.5,
    sprite: { tick: [0, 250] },
  });

  const sizeStyles = {
    small: { fontSize: 0, px: "6px", py: "1px" },
    default: { fontSize: 0, px: "8px", py: "2px" },
    large: { fontSize: 1, px: "10px", py: "3px" },
    title: { fontSize: "inherit", px: "12px", py: "4px" },
  };

  const content = (
    <Text
      onMouseEnter={() => playSwitch({ id: "tick" })}
      sx={{
        color: "background",
        bg: "highlight",
        mx: asTitle ? 0 : "4px",
        my: asTitle ? 0 : "2px",
        fontWeight: "bold",
        borderRadius: "12px",
        display: "inline-block",
        transition: "opacity 0.2s ease",
        fontFamily: "body",
        cursor: "pointer",
        ":hover": {
          opacity: 0.8,
        },
        ...sizeStyles[asTitle ? "title" : size],
        ...sxProp,
      }}
      {...props}
    >
      #{tag}
    </Text>
  );

  if (asTitle) {
    return content;
  }

  return (
    <Link href={`/tags/${tag}`} legacyBehavior>
      {content}
    </Link>
  );
}
