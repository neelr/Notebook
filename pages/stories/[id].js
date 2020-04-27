import Layout from "../../components/Layout";
import Airtable from "airtable";
import Head from "next/head";
var base = new Airtable({ apiKey: process.env.AIRTABLE }).base(process.env.BASE);
import marked from "marked"

var Routes = (props) => {
    if (props.record) {
        return (
            <Layout>
                <Head>
                    <title>{props.record.Title}</title>
                    <meta name="og:image" content={props.record.Cover[0].url} />
                    <meta name="og:title" content={props.record.Title} />
                    <meta name="og:description" content={`An article written by Neel Redkar on ${props.record.Time}`} />
                </Head>
                <div style={{ display: "flex" }}>
                    <div className="child">
                        <h1 className="title">{props.record.Title}</h1>
                        <img src={props.record.Cover[0].url} className="storyImage" />
                        <p style={{ color: "#2970f2" }}>{props.record.Time}</p>
                        <div dangerouslySetInnerHTML={{ __html: marked(props.record.Content) }}></div>
                    </div>
                </div>
            </Layout>)
    } else {
        return (
            <Layout>
                <div style={{ display: "flex" }}>
                    <div className="child">
                        <h1 className="title">Story Not Found</h1>
                    </div>
                </div>
            </Layout>
        )
    }
}
Routes.getInitialProps = async (context) => {
    return new Promise((res, rej) => {
        base('Main Content').select({
            view: "Content",
            filterByFormula: "{Query} = '" + context.query.id + "'"
        }).eachPage((records, next) => {
            records.forEach((record) => {
                if (record.get("Done")) {
                    res({
                        record: record.fields
                    })
                }
            });
            next();
        }, () => res({ found: false }));
    })
}

export default Routes;