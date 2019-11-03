import Layout from "../../components/Layout";

const Airtable = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">TheDebateTimer</h1>
                    <img src="../../static/debatetimer.png"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>11/3/19</p>
                    <p className="para">Yay! I just finished one of my "big" projects! For me when I go to a debate tournament, I usually bring a timer because I can't find any good ones online or to download. This is why I decided I needed to make my own debate timer!</p>
                    <p className="para">Basically its a debate timer which supports PF, LD, and Policy. With those 3 you can get the times for your debate rounds through downloading the actual native app! But since I wanted to add some other cool things, I added a flowing tab! You can flow your debate round and save it with  simple ctrl+s!</p>
                    <p className="para">Feel free to try it out at <a className="link" href="https://github.com/neelr/TheDebateTimer/releases">the github</a>!</p>
                </div>
            </div>
        </Layout>
    )
}

export default Airtable;