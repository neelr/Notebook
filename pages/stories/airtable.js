import Layout from "../../components/Layout";

const Airtable = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">Airtable</h1>
                    <img src="https://miro.medium.com/max/2400/1*m1B-qY_K-1fmRn12PFOK8g.png"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>9/24/19</p>
                    <p className="para">What is <a href="https://airtable.com">Airtable</a>? Airtable is a "spreadsheet" that people use online that has a much better UI than Google Spreadsheets, or even Excel, but has the same tools! The reason I dont call it a spreadsheet is because of the API. Think of a perfect database, where you can look at it on your phone, computer, from wherever you want, and still have the ease of use of a database like MongoDB.</p>
                    <p className="para">The answer is Airtable! The API is easy to use, has a node wrapper, and can be seen everywhere! You can store your data in one table, and in another you can have form data, and another database in teh other! Even though Airtable is my go to database, I still have a few cons for it:</p>
                    <p>Pros:</p>
                    <ul>
                        <li>Easy to use API</li>
                        <li>Can view anywhere</li>
                        <li>Convienient with otehr data</li>
                        <li>Mostly free, and unlimited storage</li>
                        <li>Supports numbers, dates, ratings, and other non-programming data</li>
                    </ul>
                    <p>Cons:</p>
                    <ul>
                        <li>No JSON support 😭😭</li>
                        <li>Not "professional" yet</li>
                    </ul>
                    <p className="para">All in all I feel like Airtable is a serious database competitor to MongoDB or other databases. If you want, you can see a few of my newer projects using it! <a className="redlink" href="https://github.com/hacker719/gamblot">Gamblot</a>, and <a href="https://github.com/hacker719/linkshort">LinkShort</a></p>
                </div>
            </div>
        </Layout>
    )
}

export default Airtable;