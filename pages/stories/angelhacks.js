import Layout from "../../components/Layout";

const Flagship = () => {
    return(
        <Layout>
            <div style={{display:"flex"}}>
                <div className="child">
                    <h1 className="title">AngelHacks</h1>
                    <img src="https://lh3.googleusercontent.com/B3OnqjXeLTqXkN7mVzqxEML6t5H1my_u7-qxDaBcFwpCJ4ods7-bKOUxx6DiwpdcJiRlQb3WTNDA12LJqD1_vJxLeHDoH66TzSnPujpKUYsxMMExDkGomCqm7q9qk5vHAFEp3tdJKgmF0dCcS-vygW3Wq60wa2HMblH61JNU8NvlgS1YfLRowxUBJGsZL_Nbct0-V9m3-ytQPOu4uxE7XN60UP3oMo3RczMNLnyWef376hOOJ0x65YtixHWH3gNbzyKrn7fxN6PZsYxs6_gwbhb9AnuCih7rxi1odMuLkZKWiWQPqsp1WazMk19rOGT_U22_XLIgfBDohuOM4_HzdzuPdmWca63DRxAj1h2cv2u8R9SbO6aIyh_d7W1JgFDfy-dsheye4wXmVjkmgsWiikjYS48KX3h3eMexc80ocUCUGH4AN0_crIDPzqhE9dZFbPHRiKZVa0r7wYCP5RXrAOhtlJwmgLpCxia98NFK1RzIkE4uUqdyfjtmt1xVru2zQnFZofYweOLYxQRs9kNsE1Z8AvzjCd-lQk2W6WiaMoJi_sJtmI3LcM3xE-uH9AGYj5J6AoGgZWQn6PQLibgsFzjxVbKM-jTyuLbTGj9C1nYIBMsTOrtYmJWfEgGhbA77v9ER2TVGI-P3sLkueF8BcIfsAbhZL1aaradiSD4YNDbDmYOqdhWGDwF4DvhmoXfAiKVori8uSQ4OEerflFIYvrfUqyI9KrstWwDDAHlGfk4R8g5M2w=w1910-h1432-no"  className="storyImage"/>
                    <p style={{color:"#2970f2"}}>10/28/19</p>
                    <p className="para">My first hackathon I have ever organized was <a href="https://angelhacks.org" className="link">AngelHacks</a>! Angelhacks is a 12 hour hackathon that happened at Snap HQ! It was a large hackathon (120 people) for mostly beginners! It provided a fun mentoring enviorment, while still keeping it competitive with prizes like Airpods, and a tour of SpaceX on the line.</p>
                    <p className="para">At the hackathon, I did a lot of things from securing sponsors to helping with logistics, but officialy, I was the Director Of Tech. I taught a workshop, <a href="https://s.neelr.dev/intro_slides" className="link">Intro to Programming</a>, which taught the basics and data types. I also made a CTF at the event to teach the new programmers pentesting, and to look at things at a different angle.</p>
                <p className="para">Overall I loved organizing AngelHacks not only for the people that that I met and the joy of getting companies interesting in sponsoring us, but I made many friends made connections with the otehr organizers, became closer, and made new friends!</p>
                </div>
            </div>
        </Layout>
    )
}

export default Flagship;