import Header from "../components/Header";
import Head from "next/head";
import {Helmet} from "react-helmet";
const Layout = (props)=> {
    return(
        <div>
            <Head>
                <title>Notebook</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <div>
                <Header/>
                <div style={{padding:"5vw"}}>
                    {props.children}
                </div>
            </div>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css?family=Concert+One&display=swap');
                body,html {
                    margin:0px;
                    font-family: 'Concert One', cursive;
                    background-color:#17171d;
                    color:white;
                    font-size:1.15em;
                }
                .title {
                    color:#ec3750;
                }
                .item:hover {
                    color:#9cbfff;
                    cursor:pointer;
                }
                .break {
                    flex-basis: 100%;
                    height: 0;
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
                }
                .cardContainer:hover {
                    transform: rotate(5deg) scale(1.1);
                    -ms-transform: rotate(5deg) scale(1.1);
                    -webkit-transform: rotate(5deg) scale(1.1);
                }
            `}</style>
        </div>
    )
}

export default Layout;