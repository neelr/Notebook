import { GitHub, Mail, Link } from "react-feather"
const Footer = () => {
    return (
        <div className="footer">
            <a href="https://github.com/neelr/notebook" className="item" style={{ margin: "auto", textDecoration: "none" }}>@neelr/Notebook</a>
            <div style={{ margin: "auto", display: "flex", color: "#2970f2" }}>
                <a href="https://github.com/neelr"><GitHub className="item" size="1.5em" style={{ margin: "10px" }} /></a>
                <a href="mailto:neel.redkar@outlook.com"><Mail className="item" style={{ margin: "10px" }} size="1.5em" /></a>
                <a href="https://neelr.dev/"><Link className="item" style={{ margin: "10px" }} size="1.5em" /></a>
            </div>
        </div>
    )
}

export default Footer;
