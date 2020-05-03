import { Flex, Text, Link as A } from "rebass"
import Link from "next/link"
import { useColorMode } from "theme-ui"
import { Sun, Moon } from "react-feather"

const NavLink = ({ sx, ...props }) => (
    <A sx={{
        fontWeight: 700,
        color: "primary",
        textDecoration: "none",
        fontSize: 3,
        ":hover": {
            color: "secondary",
            cursor: "pointer"
        },
        ...sx
    }} {...props} />
)

export default ({ sx, ...props }) => {
    const [colorMode, setColorMode] = useColorMode()
    return (
        <Flex sx={{
            width: "100%",
            p: "10px",
            ...sx
        }} {...props}>
            <NavLink my="auto" fontWeight="400" href="https://neelr.dev">
                @neelr
            </NavLink>
            <Link href="/">
                <NavLink m="auto">My Notebook</NavLink>
            </Link>
            <NavLink
                sx={{
                    boxSizing: "border-box",
                    p: "5px",
                    m: "5px",
                    display: "flex",
                    transition: "all 0.4s",
                    borderRadius: "200px",
                    border: "2px solid transparent",
                    ":hover": {
                        cursor: "pointer",
                        border: "2px solid",
                    }
                }}
                onClick={() => {
                    setColorMode(colorMode === 'default' ? 'deep' : 'default')
                }}>
                {colorMode == "default" ? <Sun size={24} /> : <Moon size={24} />}
            </NavLink>
        </Flex>
    )
}