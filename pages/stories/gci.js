import Layout from "../../components/Layout";

const Airtable = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">Google Code In!</h1>
                    <img src="../../static/gci.png"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>12/2/19</p>
                    <p className="para">Yay GCI is starting today and I hope I do well! I'll link to some cool projects over here!</p>
                    <ul>
                        <li><a href="https://book-sensor.glitch.me">Book Detector using TS!</a></li>
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default Airtable;