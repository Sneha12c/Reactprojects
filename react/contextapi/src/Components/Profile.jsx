import { useContext } from "react";
import UserContext from "../Context/Usercontext.js";

function Profile(){
   
    const {user} = useContext(UserContext);

    if(!user) return <div>Please login</div>
    
    return <div>Welcome {user.email}</div>
}

export default Profile;
