import { Flex, Input, Textarea, Button, Select } from "theme-ui";
import { animated, useSpring } from "react-spring";
import React from "react";

export const Section = ({ sx, ...props }) => (
  <Flex
    sx={{
      flexDirection: "column",
      p: "20px",
      ...sx,
    }}
    {...props}
  />
);
export const Selector = ({ sx, ...props }) => (
  <Select
    sx={{
      transition: "all 0.3s",
      boxShadow: "2px 2px",
      fontSize: 0,
      bg: "muted",
      ":focus": {
        bg: "background",
        boxShadow: "4px 4px",
        outline: "none",
      },
      my: "5px",
      width: "200px",
      ...sx,
    }}
    {...props}
  />
);
export const Column = ({ sx, ...props }) => (
  <Flex
    sx={{
      flexDirection: "column",
      ...sx,
    }}
    {...props}
  />
);
export const Boop = ({
  rotation = 0,
  timing = 150,
  clicky = false,
  tension = 300,
  onClick = () => {},
  children,
}) => {
  const [isBooped, setIsBooped] = React.useState(false);
  const style = useSpring({
    display: "inline-block",
    backfaceVisibility: "hidden",
    transform: isBooped ? `rotate(${rotation}deg)` : `rotate(0deg)`,
    config: {
      tension,
      friction: 10,
    },
  });
  React.useEffect(() => {
    if (!isBooped) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setIsBooped(false);
    }, timing);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isBooped, timing]);
  const trigger = () => {
    setIsBooped(true);
  };
  return (
    <animated.span
      onMouseEnter={() => {
        if (!clicky) trigger();
      }}
      onClick={() => {
        if (clicky) trigger();
        onClick();
      }}
      style={style}
    >
      {children}
    </animated.span>
  );
};

export const TextArea = ({ sx, ...props }) => (
  <Textarea
    sx={{
      transition: "all 0.3s",
      boxShadow: "2px 2px",
      fontSize: 0,
      bg: "muted",
      display: "block",
      overflow: "hidden",
      width: "100%",
      resize: "both",
      ":focus": {
        bg: "background",
        boxShadow: "4px 4px",
        outline: "none",
      },
      ...sx,
    }}
    {...props}
    as="div"
    role="textbox"
    contentEditable={!props?.editable}
    {...props}
  />
);

export const Clicker = ({ sx, ...props }) => (
  <Button
    sx={{
      boxShadow: "2px 2px #272838",
      outline: "none",
      transition: "all 0.3s",
      ":hover": {
        boxShadow: "4px 4px #272838",
        cursor: "pointer",
      },
      ...sx,
    }}
    {...props}
  />
);

export const Inp = ({ sx, ...props }) => (
  <Input
    sx={{
      transition: "all 0.3s",
      boxShadow: "2px 2px",
      fontSize: 0,
      bg: "muted",
      ":focus": {
        bg: "background",
        boxShadow: "4px 4px",
        outline: "none",
      },
      my: "5px",
      width: "200px",
      ...sx,
    }}
    {...props}
  />
);
