import Header from "../components/Header";
import Head from "next/head";
import Footer from "../components/Footer";
const Layout = (props)=> {
    return(
        <div style={{position:"relative", minHeight:"100vh"}}>
            <Head>
                <title>Notebook</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <div style={{paddingBottom:"6rem"}}>
                <Header/>
                <div style={{padding:"5vw"}}>
                    {props.children}
                </div>
            </div>
            <Footer/>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css?family=Concert+One&display=swap');
                body,html {
                    margin:0px;
                    font-family: 'Concert One', cursive;
                    background-color:#17171d;
                    color:white;
                    font-size:1.15em;
                    width:100%;
                    height:100%;
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

export default Layout;