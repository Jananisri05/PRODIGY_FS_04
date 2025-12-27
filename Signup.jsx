import {useState} from "react";
import axios from "axios";
import {useNavigate,Link} from "react-router-dom";
function Signup()
{
    const[username,setuserName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setpwd]=useState("")
    const navigate=useNavigate();
    async function handleSignup()
    {
        try
        {
            await axios.post("http://localhost:3001/signup",{username,email,password});
            alert("Signup successful.Please login")
            navigate('/')
        }
        catch(err)
        {
            alert(err.response.data)
        }
    }
    return(
        <div className="container">
            <h1>Signup</h1>
            <input type="text" placeholder="enter username" value={username} onChange={(e)=>setuserName(e.target.value)}/>
            <input type="email" placeholder="enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="enter password" value={password} onChange={(e)=>setpwd(e.target.value)}/>
            <button onClick={handleSignup}>Signup</button>
            <p>Already have a account?<Link to="/">Login</Link></p>
        </div>
    );

}
export default Signup;