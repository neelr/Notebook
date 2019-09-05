import Layout from "../../components/Layout";

const CPP = ()=> {
    return(
        <Layout>
                <div style={{display:"flex"}}>
                    <div className="child">
                        <h1 className="title">C++/Languages on Mac</h1>
                        <img src="https://i.redd.it/31b2ii8hchi31.jpg" style={{height:"250px",width:"250px",borderRadius:"30px"}} className="storyImage"/>
                        <p style={{color:"#2970f2"}}>9/4/19</p>
                        <p className="para">This is mainly to teach people who want to learn C++ and have a Mac, or if your CS teacher told you to download Visual Studio, to compile C++. Today I'm going to show you my enviorment, because it's very flexible for a ton of languages!</p>
                        <ol>
                            <li>First things, your going to have to download <a style={{textDecoration: "none",color:"#2970f2"}} href="https://code.visualstudio.com/Download">Visual Studio Code</a> or a text editor of your choice (<a style={{textDecoration: "none",color:"green"}} href="https://www.vim.org/download.php">VIM</a>, <a style={{textDecoration: "none",color:"orange"}}href="https://www.sublimetext.com/3">Sublime</a>, etc)</li>
                            <li>The next thing is to download a compiler for your language to the bash, in this case it is g++, which I will show you how to do (if you don't use C++, go to step #5)</li>
                            <li>Install brew by typing <code className="code">/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"</code> inside your terminal, and follow on screen instructions.</li>
                            <li>Then finally type in <code className="code">brew install g++</code></li>
                            <li>Now you have your compiler, you can code in Visual Studio Code, then use your compiler in bash to just compile using <code className="code">g++ File.cpp && ./a.out</code> and you can replace that with anything. (ex. python: <code className="code">python file.py</code> )</li>
                        </ol>
                        <p className="para">Now that you know how to run a file without a big junky IDE like Visual Studio, go out there and code wonders!</p>
                    </div>
            </div>
        </Layout>
    )
}

export default CPP;