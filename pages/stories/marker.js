import Layout from "../../components/Layout";

const Airtable = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">Marker</h1>
                    <img src="../../static/marker.png"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>11/19/19</p>
                    <p className="para">Yay! Cool new thing to update on is the LinkShort project! I decided to rename it and add a password for reusibility, so you can keep the id and chaneg the URL! The otehr SUPER cool thing you can do now is actually make your own website in markdown for that short! This can be used for a class homepage, or a short can be automatically redirected to the current science homepage etc! <a className="link" href="https://marker.now.sh">Check the website out over here!</a></p>
                </div>
            </div>
        </Layout>
    )
}

export default Airtable;