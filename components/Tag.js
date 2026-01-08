import { Text } from "theme-ui";
import Link from "next/link";
import useSound from "use-sound";

export default function Tag({ tag, size = "default", tilted = false, asTitle = false, sx: sxProp, ...props }) {
  const [playSwitch] = useSound("/sounds/switch.mp3", {
    volume: 0.5,
    sprite: { tick: [0, 250] },
  });

  const sizeStyles = {
    small: { fontSize: 0, px: "8px", py: "2px" },
    default: { fontSize: 1, px: "8px", py: "2px" },
    large: { fontSize: 2, px: "12px", py: "4px" },
    title: { fontSize: "inherit", px: "12px", py: "4px" },
  };

  const content = (
    <Text
      onMouseEnter={() => playSwitch({ id: "tick" })}
      sx={{
        color: "background",
        bg: "highlight",
        mx: asTitle ? 0 : "5px",
        my: asTitle ? 0 : "2px",
        fontWeight: "bold",
        borderRadius: "4px",
        display: "inline-block",
        transition: "all 0.2s ease",
        transform: tilted ? "rotate(-2deg)" : "none",
        ":hover": {
          bg: "muted",
          cursor: "pointer",
          transform: "rotate(-2deg)",
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
