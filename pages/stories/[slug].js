import {
  Text,
  Flex,
  Heading,
  Image,
  Box,
  Link as RebassLink,
} from "theme-ui";
import Link from "next/link";
import Head from "next/head";
import { Heart } from "react-feather";
import fetch from "isomorphic-unfetch";
import { local } from "../api/get.js";
import { useState, useRef, useCallback, useEffect } from "react";
import useSound from "use-sound";
import { Boop } from "@components/semantics";
import Tag from "@components/Tag";
import theme from "@components/theme";
import { useScroll, motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { notionClient } from "@lib/notion";
import handleCacheAndRSS from "@lib/handleCache";

const A = ({ sx, ...props }) => (
  <RebassLink
    sx={{
      color: "primary",
      textDecoration: "underline",
      ":hover": {
        color: "accent",
        cursor: "pointer",
        opacity: 0.8,
      },
      ...sx,
    }}
    {...props}
  />
);

const NUM_POINTS = 20;
const GRAVITY = 0.15;
const DAMPING = 0.97;
const ITERATIONS = 15;
const WEAR_RATE = 0.0024;
const WEAR_MAX = 1.0;

const TUG_THRESHOLD = 80;
const RANDOM_FONTS = [
  "'Comic Sans MS', cursive",
  "'Courier New', monospace",
  "'Papyrus', fantasy",
  "'Impact', sans-serif",
  "'Georgia', serif",
  "'Trebuchet MS', sans-serif",
  "'Lucida Console', monospace",
  "system-ui, sans-serif",
  "'Times New Roman', serif",
  "'Brush Script MT', cursive",
];
const RANDOM_COLORS = [
  "#fff8dc", "#f0fff0", "#ffe4e1", "#e6e6fa", "#fff0f5",
  "#f5f5dc", "#fdf5e6", "#f0f8ff", "#fffacd", "#e0ffff",
  "#ffefd5", "#d4f1c4", "#fce4ec", "#e8eaf6", "#fff3e0",
];

function ProgressRope({ scrollYProgress, color }) {
  const svgRef = useRef(null);
  const points = useRef([]);
  const prevPoints = useRef([]);
  const wear = useRef([]); // per-segment wear 0..1
  const dragIdx = useRef(-1);
  const mousePos = useRef({ x: 0, y: 0 });
  const animFrame = useRef(null);
  const [segments, setSegments] = useState([]);
  const [dragging, setDragging] = useState(false);
  const ropeEnd = useRef(0);
  const snapped = useRef(false);
  const snapIdx = useRef(-1);
  const tugMaxY = useRef(0);

  useEffect(() => {
    const w = window.innerWidth;
    const progress = scrollYProgress.get();
    const endX = progress * w;
    const pts = [];
    const prev = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const t = i / (NUM_POINTS - 1);
      pts.push({ x: t * endX, y: 3 });
      prev.push({ x: t * endX, y: 3 });
    }
    points.current = pts;
    prevPoints.current = prev;
    wear.current = new Array(NUM_POINTS - 1).fill(0);
    ropeEnd.current = endX;
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      ropeEnd.current = v * window.innerWidth;
    });
  }, [scrollYProgress]);

  useEffect(() => {
    function simulate() {
      const pts = points.current;
      const prev = prevPoints.current;
      const w = wear.current;
      if (!pts.length) { animFrame.current = requestAnimationFrame(simulate); return; }

      const endX = ropeEnd.current;
      const restLen = endX / (NUM_POINTS - 1);
      const lastIdx = pts.length - 1;

      // Verlet integration
      const snapGravity = 1.5;
      for (let i = 0; i < pts.length; i++) {
        if (i === 0 || i === lastIdx || dragIdx.current === i) continue;
        const isSnapped = snapped.current;
        const g = isSnapped ? snapGravity : GRAVITY;
        const d = isSnapped ? 0.9 : DAMPING;
        const vx = (pts[i].x - prev[i].x) * d;
        const vy = (pts[i].y - prev[i].y) * d;
        prev[i].x = pts[i].x;
        prev[i].y = pts[i].y;
        pts[i].x += vx;
        pts[i].y += vy + g;
      }

      const pinY = snapped.current ? 0 : 3;
      pts[0].x = 0; pts[0].y = pinY;
      pts[lastIdx].x = endX; pts[lastIdx].y = pinY;

      if (dragIdx.current >= 0) {
        const di = dragIdx.current;
        pts[di].x += (mousePos.current.x - pts[di].x) * 0.35;
        pts[di].y += (mousePos.current.y - pts[di].y) * 0.35;
        prev[di].x = pts[di].x;
        prev[di].y = pts[di].y;
      }

      // Accumulate wear around drag point based on proximity and stretch
      if (!snapped.current && dragIdx.current >= 0) {
        const di = dragIdx.current;
        for (let i = 0; i < pts.length - 1; i++) {
          // Segment i connects points i and i+1; drag point is di
          // Segments di-1 and di are directly adjacent to the grabbed point
          const segCenter = i + 0.5;
          const dist2drag = Math.abs(segCenter - di);
          const proximity = Math.exp(-dist2drag * 0.5);
          const dx = pts[i + 1].x - pts[i].x;
          const dy = pts[i + 1].y - pts[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const stretch = restLen > 0 ? Math.max(0, dist / restLen - 1) : 0;
          w[i] = Math.min(WEAR_MAX, w[i] + stretch * proximity * WEAR_RATE);
        }

        // Snap at the most worn segment
        let maxWearIdx = -1;
        for (let i = 0; i < w.length; i++) {
          if (w[i] >= WEAR_MAX) {
            maxWearIdx = i;
            break;
          }
        }
        if (maxWearIdx >= 0) {
          snapped.current = true;
          snapIdx.current = maxWearIdx + 1;
          dragIdx.current = -1;
          setDragging(false);
        }
      }

      // Constraint relaxation
      const dangleLen = 15;
      const iters = snapped.current ? 6 : ITERATIONS;

      function constrainPair(i, seg) {
        const dx = pts[i + 1].x - pts[i].x;
        const dy = pts[i + 1].y - pts[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (dist < seg) return;
        const diff = (dist - seg) / dist * 0.5;
        const ox = dx * diff;
        const oy = dy * diff;
        const pinI = i === 0;
        const pinJ = i + 1 === lastIdx;
        const dragI = dragIdx.current === i;
        const dragJ = dragIdx.current === i + 1;
        if (pinI || dragI) {
          pts[i + 1].x -= ox * 2; pts[i + 1].y -= oy * 2;
        } else if (pinJ || dragJ) {
          pts[i].x += ox * 2; pts[i].y += oy * 2;
        } else {
          pts[i].x += ox; pts[i].y += oy;
          pts[i + 1].x -= ox; pts[i + 1].y -= oy;
        }
      }

      for (let iter = 0; iter < iters; iter++) {
        if (snapped.current) {
          const si = snapIdx.current;
          // Left half dangles from start
          for (let i = 0; i < si - 1; i++) {
            constrainPair(i, dangleLen);
            pts[0].x = 0; pts[0].y = pinY;
          }
          // Right half dangles from end
          for (let i = lastIdx - 1; i >= si; i--) {
            constrainPair(i, dangleLen);
            pts[lastIdx].x = endX; pts[lastIdx].y = pinY;
          }
        } else {
          for (let i = 0; i < pts.length - 1; i++) constrainPair(i, restLen);
        }
        pts[0].x = 0; pts[0].y = pinY;
        pts[lastIdx].x = endX; pts[lastIdx].y = pinY;
      }

      // When not snapped and not dragging, pull points toward the straight line
      if (!snapped.current && dragIdx.current < 0) {
        for (let i = 1; i < lastIdx; i++) {
          const t = i / lastIdx;
          const targetX = t * endX;
          const distFromLine = Math.abs(pts[i].y - 3);
          // Strong correction when close to line (prevents droop), gentle when far (slow snap-back)
          const strength = distFromLine > 5 ? 0.003 : 0.065;
          pts[i].x += (targetX - pts[i].x) * strength;
          pts[i].y += (3 - pts[i].y) * strength;
        }
      }

      // Re-apply drag position after constraints so the grabbed point
      // tracks the cursor closely and neighbors don't overshoot past it
      if (dragIdx.current >= 0) {
        const di = dragIdx.current;
        pts[di].x += (mousePos.current.x - pts[di].x) * 0.5;
        pts[di].y += (mousePos.current.y - pts[di].y) * 0.5;
        prev[di].x = pts[di].x;
        prev[di].y = pts[di].y;
      }

      // Build per-segment SVG lines with wear color
      const segs = [];
      function addSegments(start, end) {
        for (let i = start; i < end; i++) {
          const p0 = pts[Math.max(i - 1, start)];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = pts[Math.min(i + 2, end)];
          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;
          const d = `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
          segs.push({ d, wear: w[i] || 0 });
        }
      }

      if (snapped.current) {
        addSegments(0, snapIdx.current - 1);
        addSegments(snapIdx.current, lastIdx);
      } else {
        addSegments(0, lastIdx);
      }
      setSegments(segs);

      animFrame.current = requestAnimationFrame(simulate);
    }

    animFrame.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  const handlePointerDown = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    if (e.preventDefault) e.preventDefault();
    let closest = -1;
    let closestDist = Infinity;
    const lastIdx = points.current.length - 1;
    for (let i = 1; i < lastIdx; i++) {
      const dx = points.current[i].x - mx;
      const dy = points.current[i].y - my;
      const d = dx * dx + dy * dy;
      if (d < closestDist) { closestDist = d; closest = i; }
    }
    dragIdx.current = closest;
    mousePos.current = { x: mx, y: my };
    tugMaxY.current = my;
    setDragging(true);
    e.target.setPointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    function getPos(e) {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      // Support both pointer and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: Math.max(1, clientY - rect.top) };
    }
    function onMove(e) {
      if (dragIdx.current < 0) return;
      const pos = getPos(e);
      if (!pos) return;
      mousePos.current = pos;
      if (snapped.current && pos.y > tugMaxY.current) tugMaxY.current = pos.y;
      e.preventDefault();
    }
    function onUp() {
      if (dragIdx.current < 0) return;
      handlePointerUp();
    }
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    window.addEventListener("touchcancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchcancel", onUp);
    };
  }, []);

  const handlePointerUp = useCallback(() => {
    if (snapped.current && tugMaxY.current > TUG_THRESHOLD) {
      new Audio("/sounds/switch-on.mp3").play().catch(() => {});
      const font = RANDOM_FONTS[Math.floor(Math.random() * RANDOM_FONTS.length)];
      const bg = RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
      let chaosStyle = document.getElementById("rope-chaos");
      if (!chaosStyle) {
        chaosStyle = document.createElement("style");
        chaosStyle.id = "rope-chaos";
        document.head.appendChild(chaosStyle);
      }
      chaosStyle.textContent = `* { font-family: ${font} !important; } body { background-color: ${bg} !important; }`;
    }
    tugMaxY.current = 0;
    dragIdx.current = -1;
    setDragging(false);
  }, []);

  // Interpolate color: base -> white as wear increases (like a rubberband stretching pale)
  function wearColor(w) {
    if (w <= 0) return color;
    const t = Math.min(1, w);
    const r = Math.round(parseInt(color.slice(1, 3), 16) * (1 - t) + 255 * t);
    const g = Math.round(parseInt(color.slice(3, 5), 16) * (1 - t) + 255 * t);
    const b = Math.round(parseInt(color.slice(5, 7), 16) * (1 - t) + 255 * t);
    return `rgb(${r},${g},${b})`;
  }

  // Build one combined path for hit area
  const hitPath = segments.map(s => s.d).join(" ");

  return (
    <svg
      ref={svgRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
        touchAction: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <rect
        x="0" y="0" width="100%" height="30"
        fill="transparent"
        style={{ pointerEvents: "auto", cursor: "grab", touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
        onPointerDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      />
      <path
        d={hitPath}
        stroke="transparent"
        strokeWidth="30"
        fill="none"
        style={{ pointerEvents: "auto", cursor: "grab", touchAction: "none", WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
        onPointerDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      />
      {segments.map((seg, i) => (
        <path
          key={i}
          d={seg.d}
          stroke={wearColor(seg.wear)}
          strokeWidth={5}
          fill="none"
          strokeLinecap="butt"
          style={{ pointerEvents: "none" }}
        />
      ))}
    </svg>
  );
}

export default function Story({ id, story, votes, ...props }) {
  const { scrollYProgress } = useScroll();
  let [count, setCount] = useState(false);
  const [playBell] = useSound("/sounds/bell.mp3", {
    volume: 0.3,
    sprite: {
      main: [50, 1600],
    },
  });
  const [playHover, { stop }] = useSound("/sounds/hover.mp3", {
    volume: 0.2,
  });
  let upvote = () => {
    if (!count) {
      setCount(true);
      fetch("/api/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
    }
  };
  if (!story) {
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
            background: ${theme.colors.background};
            animation: noise-anim 2s infinite linear alternate-reverse;
          }
          .glitch::after {
            right: 3px;
            text-shadow: 1px 0 blue;

            background: ${theme.colors.background};
            animation: noise-anim-2 2s infinite linear alternate-reverse;
          }
        `}</style>
      </Flex>
    );
  }

  const content = story.content.map((v) => v.content).join("  ");

  const getReadingTime = (htmlContent) => {
    const strippedContent = htmlContent.replace(/<[^>]*>/g, " ");
    const words = strippedContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return Math.ceil(words.length / 200);
  };

  const readingTime = getReadingTime(content);

  return (
    <Flex
      sx={{
        flexDirection: "column",
        maxWidth: "750px",
        mx: "auto",
        width: ["90vw", "90vw", "750px"],
        px: [3, 3, 0],
      }}
    >
      <ProgressRope scrollYProgress={scrollYProgress} color={theme.colors.primary} />
      <Head>
        <title>{story.title}</title>
        <meta name="description" content={story.description} />
        <meta property="og:title" content={story.title} />
        <meta property="og:description" content={story.description} />
        <meta property="og:image" content={story.coverImage} />
        <meta property="og:url" content={`https://notebook.neelr.dev/stories/${story.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={story.title} />
        <meta name="twitter:description" content={story.description} />
        <meta name="twitter:image" content={story.coverImage} />
      </Head>
      <Flex
        sx={{
          flexWrap: "wrap",
          alignItems: "center",
          mt: 3,
        }}
      >
        {story.tags.map((v) => (
          <Tag key={v} tag={v} sx={{ my: 0 }} />
        ))}
        <Box sx={{ ml: "auto" }}>
          <Boop rotation="10">
            <Flex
              sx={{
                bg: count ? "highlight" : "secondary",
                color: count ? "background" : "muted",
                border: count ? "none" : "1px solid",
                borderColor: "gray",
                borderRadius: "4px",
                px: "10px",
                py: "4px",
                alignItems: "center",
                transition: "all 0.2s ease",
              ":hover": {
                opacity: 0.8,
                cursor: "pointer",
              },
            }}
            onMouseEnter={() => (count ? null : playHover())}
            onMouseLeave={stop}
            onClick={() => {
              if (!count) {
                playBell({ id: "main" });
              }
              upvote();
              setCount(true);
            }}
          >
            <Text sx={{ fontFamily: "body", fontWeight: "bold" }}>{votes ? votes + count : 0 + count}</Text>
            <Heart
              size={18}
              style={{
                marginLeft: 8,
                fill: "currentColor",
                display: "block",
              }}
            />
            </Flex>
          </Boop>
        </Box>
      </Flex>
      <Flex
        sx={{
          mt: 3,
          gap: "20px",
          alignItems: "flex-start",
          flexDirection: ["column", "row"],
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Heading sx={{ fontSize: [3, 4, 5], fontFamily: "heading" }}>{story.title}</Heading>
          <Text
            sx={{
              color: "muted",
              fontStyle: "italic",
              mt: 1,
            }}
          >
            {story.dateCreated} · {readingTime} min read
          </Text>
          <Text
            sx={{
              color: "muted",
              fontStyle: "italic",
              mt: 1,
              display: "block",
            }}
          >
            {story.description}
          </Text>
        </Box>
        {story.coverImage && (
          <Image
            sx={{
              width: ["100%", "180px"],
              minWidth: ["auto", "180px"],
              borderRadius: "4px",
              opacity: 0.9,
            }}
            src={story.coverImage}
          />
        )}
      </Flex>
      <Flex sx={{ width: "100%", height: "1px", bg: "gray", my: "24px" }} />
      <Flex
        sx={{
          flexDirection: "column",
          position: "relative",
          overflow: ["hidden", "hidden", "visible"],
          blockquote: {
            fontStyle: "italic",
            borderLeft: "3px solid",
            borderColor: "gray",
            pl: "15px",
          },

          code: {
            bg: "secondary",
            color: "text",
            p: "5px",
            borderRadius: "3px",
            my: "50px",
          },

          p: {
            my: "15px",
          },

          a: {
            color: "primary",
            textDecoration: "underline",
            ":hover": {
              color: "accent",
              cursor: "pointer",
              opacity: 0.8,
            },
          },

          "ul, ol": {
            paddingLeft: [0, "1.2em"],
            marginLeft: 0,
          },

          "h1,h2,h3,h4,h5,h6": {
            mb: "5px",
            mt: "20px",
            pb: "4px",
            borderBottom: "1px solid",
            borderColor: "gray",
          },
        }}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      <Flex sx={{ width: "100%", height: "1px", bg: "gray", my: "20px" }} />
      <Flex sx={{ alignItems: "center", mb: 5 }}>
        <Text sx={{ color: "muted", fontStyle: "italic" }}>
          Thanks for reading! Liked the story? Click the heart
        </Text>
        <Boop rotation="10">
          <Flex
            sx={{
              bg: count ? "highlight" : "secondary",
              color: count ? "background" : "muted",
              border: count ? "none" : "1px solid",
              borderColor: "gray",
              borderRadius: "4px",
              p: "8px",
              alignItems: "center",
              justifyContent: "center",
              ml: "10px",
              transition: "all 0.2s ease",
              ":hover": {
                opacity: 0.8,
                cursor: "pointer",
              },
            }}
            onMouseEnter={() => (count ? null : playHover())}
            onMouseLeave={stop}
            onClick={() => {
              if (!count) {
                playBell({ id: "main" });
              }
              upvote();
              setCount(true);
            }}
          >
            <Heart
              size={18}
              style={{
                fill: "currentColor",
                display: "block",
              }}
            />
          </Flex>
        </Boop>
      </Flex>
    </Flex>
  );
}

// Replace the getStaticPaths and getStaticProps in paste.txt with:
export async function getStaticPaths() {
  try {
    // Fetch all stories from Notion
    const { results } = await notionClient.query({}, { page_size: 1500 });

    // Generate RSS feed if needed
    await handleCacheAndRSS(results, { writeFiles: true });

    // Return paths for Next.js
    return {
      paths: results.map((story) => ({
        params: { slug: story.slug },
      })),
      fallback: true,
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    // Fetch the page directly using the slug
    const pageData = await notionClient.getPageBySlug(params.slug);

    if (!pageData) {
      return {
        notFound: true,
        revalidate: 300,
      };
    }

    // Get stars/votes count
    const stars = await local(pageData.id);

    // Transform and parse the story data
    const transformedStory = await notionClient.transformPageData(
      pageData.page
    );
    const parsedStory = await notionClient.parse(transformedStory);

    return {
      props: {
        story: parsedStory,
        votes: stars,
        id: pageData.id,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}
