import Layout from "../../components/Layout";
import Link from "next/link";

const Flagship = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">LinkShort</h1>
                    <img src="../../static/link.png"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>9/13/19</p>
                    <p className="para">Quick update! I made a cool link shortener with airtable as a database! My first real "project" with it and I love how simple it is! Check it out at <a style={{textDecoration: "none",color:"#2970f2"}} href="https://s.neelr.dev">https://s.neelr.dev</a></p>
                    <p><strong style={{color:"red"}}>UPDATE: <Link href="/stories/marker"><a className="link">NEW NOTEBOOK UPDATE HERE!</a></Link></strong></p>
                </div>
            </div>
        </Layout>
    )
}

export default Flagship;