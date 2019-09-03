import Layout from "../components/Layout";
import Card from "../components/Card";
const Index = () => {
    return(
        <Layout>
         <h1 className="title">My Notebook</h1>
         <p>A project where I can type out thoughts I have, articles, or anything!</p>
         <div className="container" style={{display:"flex",flexWrap:"wrap"}}>
            <Card src="../static/flagship.jpg" desc="Flagship Summit 9/2/19" href="/stories/flagship"/>
         </div>
        </Layout>
    )
}
export default Index;