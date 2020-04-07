import Layout from "../components/Layout";
import Card from "../components/Card";
import Airtable from "airtable";
var base = new Airtable({ apiKey: process.env.AIRTABLE }).base(process.env.BASE);
class Index extends React.Component {
    state = {
        cards: []
    }
    render() {
        return (
            <Layout>
                <h1 className="title">My Notebook</h1>
                <p>A project where I can type out thoughts I have, articles, or anything!</p>
                <div className="container" style={{ display: "flex", flexWrap: "wrap" }}>
                    {this.state.cards.slice().reverse()}
                </div>
            </Layout>
        )
    }
    componentWillMount() {
        var content = [];
        base('Main Content').select({
            view: "Content"
        }).eachPage((records, next) => {
            records.forEach((record) => {
                if (record.get("Done")) {
                    content.push((
                        <Card desc={record.get("Title") + " " + record.get('Time')} src={record.get("Cover")[0].url} href={"/stories/" + record.get("Query")} />
                    ))
                }
            });
            next();
        }, (err) => {
            this.setState({ cards: content });
        });

    }
}
export default Index;