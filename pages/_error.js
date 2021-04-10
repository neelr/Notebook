import React from "react";
import { Flex, Heading } from "theme-ui";
import Head from "next/head";
import { useColorMode } from "theme-ui";
import theme from "@components/theme";

export default function Error() {
  const [colorMode, setColorMode] = useColorMode();
  return (
    <Flex flexDirection="column">
      <Head>
        <title>Error 404</title>
      </Head>
      <Heading
        sx={{
          fontSize: [4, 5, 6],
        }}
        m="auto"
        data-text="Error 404"
        className="glitch"
      >
        Error 404
      </Heading>
      <style jsx global>{`
        @keyframes noise-anim {
          0% {
            clip-path: inset(40% 0 61% 0);
          }
          20% {
            clip-path: inset(92% 0 1% 0);
          }
          40% {
            clip-path: inset(43% 0 1% 0);
          }
          60% {
            clip-path: inset(25% 0 58% 0);
          }
          80% {
            clip-path: inset(54% 0 7% 0);
          }
          100% {
            clip-path: inset(58% 0 43% 0);
          }
        }
        @keyframes noise-anim-2 {
          0% {
            clip-path: inset(50% 0 31% 0);
          }
          20% {
            clip-path: inset(1% 0 92% 0);
          }
          40% {
            clip-path: inset(36% 0 83% 0);
          }
          60% {
            clip-path: inset(82% 0 43% 0);
          }
          80% {
            clip-path: inset(91% 0 7% 0);
          }
          100% {
            clip-path: inset(38% 0 19% 0);
          }
        }
        .glitch {
          position: relative;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch::before {
          left: 3px;
          text-shadow: -1px 0 red;
          background: ${colorMode == "default"
            ? theme.colors.background
            : theme.colors.modes.dark.background};
          animation: noise-anim 2s infinite linear alternate-reverse;
        }
        .glitch::after {
          right: 3px;
          text-shadow: 1px 0 blue;

          background: ${colorMode == "default"
            ? theme.colors.background
            : theme.colors.modes.dark.background};
          animation: noise-anim-2 2s infinite linear alternate-reverse;
        }
      `}</style>
    </Flex>
  );
}
