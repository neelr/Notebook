import Layout from "../components/Layout";
import Card from "../components/Card";
const Index = () => {
    return(
        <Layout>
         <h1 className="title">My Notebook</h1>
         <p>A project where I can type out thoughts I have, articles, or anything!</p>
         <div className="container" style={{display:"flex",flexWrap:"wrap"}}>
            <Card src="../static/debatetimer.png" desc="TheDebateTimer 11/3/19" href="/stories/thedebatetimer"/>
            <Card src="../static/npm.png" desc="npm - My First 10/28/19" href="/stories/npm"/>
            <Card src="https://raw.githubusercontent.com/angelhacks/site/master/static/banner-logo.png" desc="Angelhacks 10/28/19" href="/stories/angelhacks"/>
            <Card src="https://static.airtable.com/images/oembed/airtable.png" desc="Airtable 9/24/19" href="/stories/airtable"/>
            <Card src="../static/link.png" desc="LinkShort 9/13/19" href="/stories/link"/>
            <Card src="../static/glitch.png" desc="Glitch vs Repl.it 9/5/19" href="/stories/glitchvrepl"/>
            <Card src="https://engineering.fb.com/wp-content/uploads/2015/06/1522635669452_11.jpg" desc="Running C++/Languages on Mac 9/4/19" href="/stories/cpponmac"/>
            <Card src="../static/flagship.jpg" desc="Flagship Summit 9/2/19" href="/stories/flagship"/>
            <Card src="https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" desc="Notebook 9/3/19" href="/stories/notebook"/>
         </div>
        </Layout>
    )
}
export default Index;