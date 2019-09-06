import Layout from "../../components/Layout";
const Notebook = () => {
    return(
        <Layout>
                <div style={{display:"flex"}}>
                    <div className="child">
                        <h1 className="title">Glitch vs Repl.it, A Students View</h1>
                        <img src="../../static/glitch.png"  className="storyImage"/>
                        <p style={{color:"#2970f2"}}>9/5/19</p>
                        <p className="para">Quick background info. Repl.it and glitch are both cloud coding platforms geared toward giving coding platforms for people on the go.</p>
                        <p className="para">In the start of 2019, when competing in my science fair, a kid saw me running repl.it for my project. He started talking to me about this new platform called glitch! I decided to give it a try, and set up my project. And I waited for it to load and initialize. I waited, and waited, and waited. The glitch servers were frustratingly slow with basically nothing running on them, so I reverted back to repl.it.</p>
                        <p className="para">Usually, I would give this nothing more than that and never think about it again. Then, in the past few months, a few of my friends started to use glitch and started to tell me about how great, and amazing it was. I just said that the servers were slow and UI bad. Then in the past few weeks, I've been trying out glitch, and to my knowledge, the UI has improved, the server speed, the integrations, and almost everything about it! So many things, that I think I might start to use it over repl.it.</p>
                        <p>A quick show of repl.it features:</p>
                        <ul>
                            <li>Online Multiplayer (recently updated)</li>
                            <li>Variety of coding languages and frameworks</li>
                            <li>Highly flexible Polygott</li>
                            <li>Great Community</li>
                            <li>......</li>
                            <li>Very glitchy when working serverside</li>
                            <li>Unable to use console/bash when running</li>
                            <li>Unable to update filetree to current one</li>
                            <li>No github push integration</li>
                        </ul>
                        <p>And then of glitch</p>
                        <ul>
                            <li>Multiplayer (better in my opinion)</li>
                            <li>Mostly for Node.js but supports other languages</li>
                            <li>Havent seen community so can't talk about that</li>
                            <li>Many github integrations</li>
                            <li>Git repository to edit when offline or not on website</li>
                            <li>✨VSCode integration✨</li>
                            <li>Fast as lightning</li>
                            <li>.....</li>
                            <li>Not many other languages, but covered up by the better UI and everything else</li>
                        </ul>
                        <p className="para">All in all I  think <span style={{fontWeight:"700",color:"#ec3750"}}>glitch</span> would have to be the winner so far because of all the integrations (VSCode integration is 100% amazing), speed, and not being glitchy (ha...). So far on most repl.it projects, you have to fork it to actually make it work.</p>
                        <p className="para"> I hope in the future repl.it becomes better and fixes the glitches and adds github or VScode integrations! I will update this if any important changes come! I hope both get better to help foster competition to help us all!</p>
                    </div>
            </div>
        </Layout>
    )
}

export default Notebook;