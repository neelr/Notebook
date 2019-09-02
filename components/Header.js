import {TiHome} from "react-icons/ti";
const Header = ()=> {
    return(
        <div style={{display:"flex", width:"100vw",color:"#2970f2",height:"50px"}}>
            <TiHome className="item" size="1.5em" style={{marginTop:"auto",marginBottom:"auto",marginLeft:"20px"}}/>
            <p className="item" style={{margin:"auto"}}>My Notebook</p>
        </div>
    )
}

export default Header;