import React, { useState } from "react";
import './login.css'
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { abd } from "../url";
import { Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";



function Login1(){
    
  const navigate= useNavigate();
  
const [user, setUser]=useState({
  username:'',
  password:''
})
const [open, setOpen] = React.useState(false);
  
  const handleToClose = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpen(false);
  };

const OnInput = (e)=>{
  const {name,value}= e.target;
 setUser({ ...user, [name]:value});  
}
const sub = async ()=>{
  const data=await axios.post(`${abd}/user/login`, user).then(
    (res)=>{
      console.log(res.data)
      if (res.data.status === 200 ) {
        localStorage.setItem("jwt",res.data.token);
        localStorage.setItem("id",res.data.id);
        navigate("/");
      }

    }
  ).catch((err)=>{
    setOpen(true);
  })
}

 

  const loginUser = async (e) => {
    e.preventDefault();
    sub();
  }


    
    return(
      <div className="basecont">
       <Snackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        open={open}
        autoHideDuration={5000}
        message="Invalid Username or Password"
        onClose={handleToClose}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleToClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
          <form onSubmit={loginUser} className="full">  
          
      

          
        <div className="main1">
          <div className="gif">
            <img src="./image/animation.gif" alt="" class="animatimg"/>
          </div>
        
          <div className="main">
            <div className="imgcontainer1">
                <img src="./image/panimation.gif" alt="Avatar" class="avatar"/>
            </div>
       
        <div className="container1">
        <label for="uname"><b>Username</b></label>
        <input className="text" type="text" placeholder="Enter Username" name="username" value={user.username} onChange={OnInput} required/>
    
        <label for="psw"><b>Password</b></label>
        <input className="text" type="password" placeholder="Enter Password" name="password" value={user.password} onChange={OnInput} required/>
    
        <button  className="text" type="submit" >Login</button>
        <label for="uname"><b>Other Login   </b></label>
        <div style={{textAlign:'center'}}>
        <img className="img10" src="./image/google.gif" alt="" />
        <img className="img10" src="./image/facebook.gif" alt="" />
        </div>
      </div>
      <div className="container1">
    <button  type="button" class="cancelbtn">Cancel</button>
    <button  type="button" class="cancelbtn2" onClick={()=>{
                       navigate('/register')}}>Register</button>

    <span className="psw" onClick={()=>{
                       navigate('/forget')}} >Forgot <a className="password" href="#">password?</a></span>
    
  </div>
  </div>
      
      </div>
      </form>
      </div>

   )


  
}

export default Login1;