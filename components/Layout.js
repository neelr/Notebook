import Header from "../components/Header";
import Head from "next/head";
import Footer from "../components/Footer";
import {MdPalette} from "react-icons/md";
class Layout extends React.Component {
    render() {
        return (
            <div style={{ position: "relative", minHeight: "100vh" }}>
                <Head>
                    <title>Notebook</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <div style={{ paddingBottom: "6rem" }}>
                    <Header />
                    <span style={{ position: "absolute", top: "18px", right: "20px" }} id="themeBut" className="item"><MdPalette size="1.2em"/></span>
                    <div style={{ padding: "5vw" }}>
                        {this.props.children}
                    </div>
                </div>
                <Footer />
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css?family=Nunito:400,700&display=swap');
                    body,html {
                        margin:0px;
                        font-weight:700;
                        background-color:white;
                        color:black;
                        font-size:1.15em;
                        width:100%;
                        height:100%;
                        font-family: 'Nunito', sans-serif;
                    }
                    .para {
                        text-indent:2rem;
                        font-weight:400;
                    }
                    ul {
                        font-weight:400;
                    }
                    .storyImage {
                        height:auto;
                        width:30vw;
                        border-radius:1vw;
                    }
                    @media screen and (max-width:881px) {
                        .storyImage {
                            width:256px;
                        }
                    }
                    .title {
                        color:#ec3750;
                    }
                    .item:hover {
                        color:#9cbfff;
                        cursor:pointer;
                    }
                    @media screen and (max-width:750px) {
                        .cardContainer {
                            width:75vw !important;
                        }
                        .container {
                            display: block !important;
                        }
                    }
                    .cardContainer {
                        -webkit-transition: -webkit-transform .3s ease-in-out;
                        -ms-transition: -ms-transform .3s ease-in-out;
                        transition: transform .3s ease-in-out;
                        box-shadow:5px 5px 5px 5px;
                    }
                    .cardContainer:hover {
                        transform: rotate(5deg) scale(1.1);
                        -ms-transform: rotate(5deg) scale(1.1);
                        -webkit-transform: rotate(5deg) scale(1.1);
                    }
                    .footer {
                        width:100vw;
                        display:flex;
                        bottom: 0;
                        position: absolute;
                        height: 6rem;
                        flex-direction:column;
                    }
                    .item {
                        color:#2970f2;
                    }
                    .child {
                        width:50vw;
                        margin:auto;
                    }
                    @media screen and (max-width:674px) {
                        .child {
                            width:100vw;
                            margin:auto;
                        }
                    }
                `}</style>
            </div>
        )
    }
    componentDidMount() {
        if (document.getElementById("dark")) {
            document.getElementById("dark").parentNode.removeChild(document.getElementById("dark"));
        }
        document.querySelector("#themeBut").onclick = () => {
            //console.log("clacked",localStorage.getItem("theme") == "light")
            var check = localStorage.getItem("theme");
            if (check == "light") {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
            if (localStorage.getItem("theme") == "dark") {
                var style = document.createElement('style');
                style.setAttribute("id", "dark")
                style.innerHTML = `
                html,body {
                    background-color:#17171d !important;
                    color:white !important;
                }`;
                document.head.appendChild(style);
            } else {
                document.getElementById("dark").parentNode.removeChild(document.getElementById("dark"));
            }
        }
        if (localStorage.getItem("theme") == "dark") {
            var style = document.createElement('style');
            style.setAttribute("id", "dark")
            style.innerHTML = `
            html,body {
                background-color:#17171d !important;
                color:white !important;
            }
            `;
            document.head.appendChild(style);
        }
    }
}

export default Layout;
