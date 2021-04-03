import { ThemeProvider } from "theme-ui";
import theme from "../components/theme";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import { Flex } from "theme-ui";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Flex minHeight="100vh" flexDirection="column">
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </Flex>
    </ThemeProvider>
  );
}
