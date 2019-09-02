import Header from "../components/Header";
import Head from "next/head";
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
            `}</style>
        </div>
    )
}

export default Layout;