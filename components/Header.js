import {TiHome} from "react-icons/ti";
const Header = ()=> {
    return(
        <div style={{display:"flex", width:"100vw",color:"#2970f2",height:"50px"}}>
            <TiHome className="item" size="1.5em" style={{marginTop:"auto",marginBottom:"auto",marginLeft:"20px"}}/>
            <p className="item" style={{margin:"auto"}}>My Notebook</p>
            <style>{`
                @import url('https://fonts.googleapis.com/css?family=Concert+One&display=swap');
                body,html {
                    margin:0px;
                    font-family: 'Concert One', cursive;
                    background-color:#17171d;
                    color:white;
                    font-size:1.15em;
                }
                .item {
                    padding-right:10px;
                    padding-left:10px;
                }
                .title {
                    color:#ec3750;
                }
                .item:hover {
                    color:#9cbfff;
                    cursor:pointer;
                }
            `}</style>
        </div>
    )
}

export default Header;