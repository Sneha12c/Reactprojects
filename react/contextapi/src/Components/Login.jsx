import { useContext, useState } from "react";
import UserContext from "../Context/Usercontext.js";

function Login(){
  const [password , setPassword] = useState('');
  const [email , setEmail] = useState('');
  
  const {setUser} = useContext(UserContext);
  
  const handlesubmit = (e) =>{
    e.preventDefault();
    setUser({email , password});
  }

  return(
    <div>
    <h1>Login</h1>
    <input type="text" value={email} onChange={(e)=> { setEmail(e.target.value)}} placeholder="Email"/>
    <input type="text" value={password} onChange={(e)=> {setPassword(e.target.value)}} placeholder="Password" />
    <button onClick={handlesubmit}>Submit</button>
    </div>
)
}

export default Login;
