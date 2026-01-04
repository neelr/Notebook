import { useState, useEffect } from "react";
import { Flex, Box, useThemeUI } from "theme-ui";
import Head from "next/head";
import useSound from "use-sound";
import { Section, Column, Inp, Clicker, Boop } from "../components/semantics";
import DownArrows from "@components/icons/DownArrows";
import LeftArrows from "@components/icons/LeftArrows";
import RightArrows from "@components/icons/RightArrows";

const fallbackFonts = ["Arial", "Georgia", "Courier New", "Impact", "Comic Sans MS"];

const colors = ["#EE6C4D", "#98C1D9", "#3D5A80", "#EF476F", "#06FFA5", "#FFD166", "#F78C6B"];

export default function Subscribe() {
  const { theme } = useThemeUI();
  const primaryColor = theme.colors.primary;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [currentFont, setCurrentFont] = useState("Arial");
  const [currentBgColor, setCurrentBgColor] = useState("#808080");
  const [currentSize, setCurrentSize] = useState(16);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [availableFonts, setAvailableFonts] = useState(fallbackFonts);
  const [playPop] = useSound("/sounds/pop.mp3", {
    volume: 0.7,
  });
  const [playSwitch] = useSound("/sounds/switch.mp3", {
    volume: 0.5,
  });
  const [playBell] = useSound("/sounds/bell.mp3", {
    volume: 0.7,
  });

  // Load system fonts on mount
  useEffect(() => {
    async function loadSystemFonts() {
      try {
        if ("queryLocalFonts" in window) {
          const fontData = await window.queryLocalFonts();
          const fontFamilies = [...new Set(fontData.map(f => f.family))];
          setAvailableFonts(fontFamilies.length > 0 ? fontFamilies : fallbackFonts);
        }
      } catch (err) {
        console.log("Could not access local fonts, using fallback");
      }
    }
    loadSystemFonts();
  }, []);

  useEffect(() => {
    if (!isHovering) return;

    const interval = setInterval(() => {
      setCurrentFont(availableFonts[Math.floor(Math.random() * availableFonts.length)]);
      setCurrentBgColor(colors[Math.floor(Math.random() * colors.length)]);
      setCurrentSize(14 + Math.random() * 6); // Size between 14px and 20px
      setCurrentRotation((Math.random() - 0.5) * 10); // Rotation between -5deg and 5deg
      playSwitch();
    }, 150);

    return () => clearInterval(interval);
  }, [isHovering, availableFonts, playSwitch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
        playBell();
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again later.");
      console.error("[Subscribe] Error:", error);
    }
  };

  return (
    <Flex sx={{ flexDirection: "column" }}>
      <Head>
        <title>subscribe</title>
        <meta name="description" content="subscribe to my newsletter!" />
      </Head>

      <Section sx={{
        width: ["90vw", "85vw", "75vw", "600px"],
        mx: "auto",
      }}>
        <h1
          sx={{
            fontSize: [4, 5, 6],
            fontWeight: "heading",
            color: "text",
            textDecoration: "underline",
            textDecorationStyle: "wavy",
            textDecorationColor: "primary",
            mb: 3,
          }}
        >
          get a livestream of my thoughts!
        </h1>
        <p sx={{ fontSize: [2, 3], color: "text", lineHeight: "body", mb: 4 }}>
          a newsletter where i share my thoughts and ideas + updates on when I post new blog posts! no spam, unsubscribe anytime.
        </p>

        <Column
          as="form"
          onSubmit={handleSubmit}
          sx={{
            alignItems: "center",
            width: "100%",
            mt: 4,
            position: "relative"
          }}
        >
          <Box sx={{
            position: "absolute",
            left: ["0px", "0px", "calc(50% - 415px)"],
            top: "-115px",
            width: ["0px", "0px", "200px"],
            display: ["none", "none", "block"],
            pointerEvents: "none"
          }}>
            <LeftArrows color={primaryColor} />
          </Box>

          <Box sx={{
            position: "absolute",
            right: ["0px", "0px", "calc(50% - 415px)"],
            top: "-115px",
            width: ["0px", "0px", "200px"],
            display: ["none", "none", "block"],
            pointerEvents: "none"
          }}>
            <RightArrows color={primaryColor} />
          </Box>

          <Inp
            type="email"
            placeholder="sevenofhearts@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            sx={{
              width: ["100%", "100%", "400px"],
              maxWidth: "100%",
              bg: "background",
              fontSize: 2,
              p: 2,
              mb: 3
            }}
          />

          <Boop rotation="3" timing={200}>
            <Clicker
              type="submit"
              disabled={status === "loading"}
              onMouseEnter={() => {
                playPop();
                setIsHovering(true);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
                setCurrentBgColor("#808080");
                setCurrentSize(16);
                setCurrentRotation(0);
                setCurrentFont("Arial");
              }}
              sx={{
                fontSize: `${currentSize}px`,
                px: 4,
                py: 2,
                bg: currentBgColor,
                border: "none",
                opacity: status === "loading" ? 0.6 : 1,
                cursor: status === "loading" ? "wait" : "pointer",
                mx: "auto",
                fontWeight: "bold",
                fontFamily: currentFont,
                transform: `rotate(${currentRotation}deg)`,
                transformOrigin: "center center",
                display: "inline-block",
                transition: "none",
                mb: 2
              }}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </Clicker>
          </Boop>

          <Box sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "120px",
            width: ["200px", "200px", "200px"],
            pointerEvents: "none"
          }}>
            <DownArrows color={primaryColor} />
          </Box>

          <Box sx={{ height: "160px", mt: 2 }} />

          {message && (
            <p
              sx={{
                fontSize: 2,
                color: status === "success" ? "primary" : "red",
                textAlign: "center",
                mt: 2,
              }}
            >
              {message}
            </p>
          )}
        </Column>
      </Section>
    </Flex>
  );
}
