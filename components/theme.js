export default {
  useCustomProperties: true,
  initialColorMode: "default",
  colors: {
    text: "#333",
    background: "#fafafa",
    primary: "#0066cc",
    secondary: "#f5f5f5",
    highlight: "#EE6C4D",
    accent: "#0066cc",
    muted: "#888",
    gray: "#e0e0e0",
    notion_callout_default: "rgba(235, 236, 237, 0.3)",
    notion_callout_gray: "rgb(241, 241, 239)",
    notion_callout_brown: "rgb(244, 238, 238)",
    notion_callout_orange: "rgb(251, 236, 221)",
    notion_callout_yellow: "rgb(251, 243, 219)",
    notion_callout_green: "rgb(237, 243, 236)",
    notion_callout_blue: "rgb(231, 243, 248)",
    notion_callout_purple: "rgb(244, 240, 247)",
    notion_callout_pink: "rgb(249, 238, 243)",
    notion_callout_red: "rgb(253, 235, 236)",
  },
  fonts: {
    body: 'Georgia, "Times New Roman", Times, serif',
    heading: 'Georgia, "Times New Roman", Times, serif',
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 17, 20, 24, 32, 48, 64, 72],
  fontWeights: {
    body: 400,
    heading: 700,
    display: 900,
  },
  lineHeights: {
    body: 1.6,
    heading: 1.25,
  },
  textStyles: {
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    display: {
      variant: "textStyles.heading",
      fontSize: [5, 6],
      fontWeight: "display",
      letterSpacing: "-0.03em",
      mt: 3,
    },
  },
  styles: {
    Container: {
      p: 3,
      maxWidth: 750,
    },
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    h1: {
      variant: "textStyles.display",
    },
    h2: {
      variant: "textStyles.heading",
      fontSize: 5,
    },
    h3: {
      variant: "textStyles.heading",
      fontSize: 4,
    },
    h4: {
      variant: "textStyles.heading",
      fontSize: 3,
    },
    h5: {
      variant: "textStyles.heading",
      fontSize: 2,
    },
    h6: {
      variant: "textStyles.heading",
      fontSize: 1,
    },
    a: {
      color: "primary",
      textDecoration: "underline",
      cursor: "pointer",
      ":hover": {
        color: "accent",
        opacity: 0.8,
      },
    },
    pre: {
      fontFamily: "monospace",
      fontSize: 1,
      p: 3,
      color: "text",
      bg: "secondary",
      overflow: "auto",
      borderRadius: "4px",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: 1,
    },
    inlineCode: {
      fontFamily: "monospace",
      color: "text",
      bg: "secondary",
      px: 1,
      borderRadius: "3px",
    },
    table: {
      width: "100%",
      my: 4,
      borderCollapse: "separate",
      borderSpacing: 0,
      "th,td": {
        textAlign: "left",
        py: "4px",
        pr: "4px",
        pl: 0,
        borderColor: "gray",
        borderBottomStyle: "solid",
      },
    },
    th: {
      verticalAlign: "bottom",
      borderBottomWidth: "2px",
    },
    td: {
      verticalAlign: "top",
      borderBottomWidth: "1px",
    },
    hr: {
      border: 0,
      borderBottom: "1px solid",
      borderColor: "gray",
    },
  },
};
