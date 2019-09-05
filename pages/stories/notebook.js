import Layout from "../../components/Layout";
const Notebook = () => {
    return(
        <Layout>
                <div style={{display:"flex"}}>
                    <div className="child">
                        <h1 className="title">Notebook</h1>
                        <img src="https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"  className="storyImage"/>
                        <p style={{color:"#2970f2"}}>9/3/19</p>
                        <p className="para">This is a quick qrticle on this project! What I want this to be is a place to write down my thoughts fast and quick and to have a place to put them. Mostly its to encourage me to write more and improve writing skills, but also help with my art/web design skills which... need work. A checklist of things that I need to do for this website</p>
                        <ul>
                            <li>Make a decent UI ✅</li>
                            <li>Add image cards to front ✅</li>
                            <li>Add some content ✅</li>
                            <li>Make the cards move ✅</li>
                            <li>Make a light/dark mode ✅</li>
                            <li>Anything more? Email me at <a style={{textDecoration: "none",color:"#2970f2"}} href="mailto:neel.redkar@outlook.com">neel.redkar@outlook.com</a></li>
                        </ul>
                    </div>
            </div>
        </Layout>
    )
}

export default Notebook;