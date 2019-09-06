import Link from "next/link";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        color: "black",
        width: "25vw", 
        borderRadius: "20px",
        overflow:'hidden',
        textAlign: "center",
        margin:"10px"
    },
    image: { 
        width: "100%",
        height: "auto",
    },
}

const Card = (props) => {
        return (
        <div className="mobileCenter">
            <Link href={props.href}>
                <div style={styles.container} className="cardContainer">
                    <img src={props.src} style={styles.image} className="cardImage"/>
                    <div className="textCont">
                    <p style={{margin:"10px"}}>{props.desc}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Card;