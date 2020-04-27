import Layout from "../components/Layout";
import Card from "../components/Card";
import Head from "next/head";
import Airtable from "airtable";
var base = new Airtable({ apiKey: process.env.AIRTABLE }).base(process.env.BASE);
class Index extends React.Component {
    state = {
        cards: []
    }
    render() {
        return (
            <Layout>
                <Head>
                    <title>Notebook</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="title" content="Neel's Notebook" />
                    <meta
                        name="description"
                        content="A quick way to jot down my thought's and showcase my projects!"
                    />
                </Head>
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
                } 2
            });
            next();
        }, (err) => {
            this.setState({ cards: content });
        });

    }
}
export default Index;