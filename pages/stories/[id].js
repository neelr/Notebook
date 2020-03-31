import Layout from "../../components/Layout";
import Airtable from "airtable";
var base = new Airtable({ apiKey: process.env.AIRTABLE }).base(process.env.BASE);

var Routes = (props) => {
    return (
        <Layout>
            <div style={{ display: "flex" }}>
                <div className="child">
                    <h1 className="title">{props.record.Title}</h1>
                    <img src={props.record.Cover[0].url} className="storyImage" />
                    <p style={{ color: "#2970f2" }}>{props.record.Time}</p>
                    {props.content}
                </div>
            </div>
        </Layout>)
}
Routes.getInitialProps = async (context) => {
    return new Promise((res, rej) => {
        base('Main Content').select({
            view: "Content",
            filterByFormula: "{Query} = '" + context.query.id + "'"
        }).eachPage((records, next) => {
            records.forEach((record) => {
                res({
                    content: (
                        <div dangerouslySetInnerHTML={{ __html: record.get("Content") }}>
                        </div>
                    ), record: record.fields
                })
            });
            next();
        });
    })
}

export default Routes;