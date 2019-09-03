import Layout from "../../components/Layout";

const Flagship = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">Flagship Summit</h1>
                    <img src="../../static/flagship.jpg"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>9/2/19</p>
                    <p className="para">Flashship Summit was an amazing experience! It was a gathering of people from all around the US, to learn how to start/make/create a <a  style={{textDecoration:"none",color:"hsl(353.8, 77.2%, 53.5%)"}} href="https://hackclub.com">Hack Club</a>! So what is a Hack Club? It basically is a club, in school or out of school, of people who want to learn to program, teach programming, or collaborate with other people on cool projects. The second thing you might be thinking is <em>"HACK"</em> aghhh thats something scary! What we are trying to do is take away that stigma, and change it into something to create and learn!</p>
                    <p className="para">The main take-aways were that:</p>
                    <ul>
                        <li>How to create a hack-a-thon</li>
                        <li>How to teach people, and make them engaged and interested</li>
                        <li>That there are so many resources and people to help you on the way to helping your community!</li>
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default Flagship;