import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './App.css'
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      

      const res = await axios.post("http://localhost:3001/login", {
        email,
        password
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Login successful");
      navigate("/home")

    } catch (err) 
    {
      if(err.response)
      {
        alert(err.response.data);
      }
      else{
        alert("Server not reachable.Please try again later")
      }
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>

      <input
        type="email"
        placeholder="enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="enter password"
        value={password}
        onChange={(e) => setPwd(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        Do not have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default Login;
