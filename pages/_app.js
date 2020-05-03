import { ThemeProvider } from "theme-ui"
import theme from "../components/theme"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import { Flex } from "rebass"

export default ({ Component, pageProps }) => (
    <ThemeProvider theme={theme}>
        <Flex width="100vw" minHeight="100vh" flexDirection="column">
            <Flex width={["90vw", null, null, "60vw"]} mx="auto" flexDirection="column">
                <Nav />
                <Component {...pageProps} />
            </Flex>
            <Footer />
        </Flex>
    </ThemeProvider>
)