import Layout from "../components/Layout";
import Card from "../components/Card";
const Index = () => {
    return(
        <Layout>
         <h1 className="title">My Notebook</h1>
         <p>A project where I can type out thoughts I have, articles, or anything!</p>
         <div className="container" style={{display:"flex",flexWrap:"wrap"}}>
            <Card src="../static/flagship.jpg" desc="Flagship Summit 9/2/19" href="/stories/flagship"/>
            <Card src="https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" desc="Notebook 9/3/19" href="/stories/notebook"/>
         </div>
        </Layout>
    )
}
export default Index;