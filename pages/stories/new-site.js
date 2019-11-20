import Layout from "../../components/Layout";
import Link from "next/link";

const Flagship = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">New Website</h1>
                    <img src="../../static/new-site.png"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>11/19/19</p>
                    <p className="para">A new cool thing that I have been working on is my new minimalistic website! I used next.js (finally) and netlify to host it and made it look as good as I could, without any CSS frameworks or helpers!</p>
                    <p className="para">Some cool features I like about it is that it is now super mobile friendly, looks more professional, and has all my projects on it! This is what I have been wanting for a long time because it has been hard to keep track of them, and having them all in one spot is super helpful!</p>
                    <p>If you haven't seen it already, <a className="link" href="https://neelr.dev">the website is here!</a></p>
                </div>
            </div>
        </Layout>
    )
}

export default Flagship;