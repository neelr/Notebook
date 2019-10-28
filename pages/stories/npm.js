import Layout from "../../components/Layout";

const Flagship = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">My First Package</h1>
                    <img src="../../static/npm.png"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>10/28/19</p>
                    <p className="para">Today, while on the usual grind of looking for people/company emails, I realized I should make a simple webscraper. I realized that I was too lazy to make a UI and a server, but wanted to make a barebones way.</p>
                    <p className="para">I got on the grind, and made my first npm package, <a className='link' href="https://www.npmjs.com/package/scrapemail">ScrapeMail</a>! This is pretty simple, as it takes in a url, and goes to every page on it, and collects all emails, and outputs them to console!</p>
                    <p className="para">Turns out, its <strong>REALLY</strong> easy to make one! I just made an export and created a file in /bin and linked it all up in the package.json, and BAM I had a global npm package! I really reccomend that you make one, as it helps everyone (even if people dont use it) and its really satisfying!</p>
                    </div>
            </div>
        </Layout>
    )
}

export default Flagship;