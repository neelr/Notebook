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
        </div>
    )
}

export default Layout;