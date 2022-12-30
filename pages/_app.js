import { Analytics } from "@vercel/analytics/dist/react";
import { ThemeProvider } from "theme-ui";
import theme from "../components/theme";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import { Flex } from "theme-ui";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Analytics />
      <Flex
        sx={{
          minHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <Head>
          <script src="https://analytics.stacc.cc/api/script/v925J2qMyDZV"></script>
        </Head>
        <Nav />
        <Component {...pageProps} />
        <Footer />
        <style jsx global>{`
          .masonry-posts {
            display: flex;
            width: 100%;
            max-width: 100%;
          }
        `}</style>
      </Flex>
    </ThemeProvider>
  );
}
