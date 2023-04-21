import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { abd } from '../url';
import { Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

function Changepassword1() {
    const navigate= useNavigate();
    const [data,setData]=useState({
      otp:"",
      email:"",
      password:"",
      confirmPassword:""
  })
  const[sub,setSub]=useState("")
  
  
  const OnInput=(e)=>{
  const {name,value}= e.target;
  setData({ ...data, [name]:value});
  // console.log("efgh",setData)
  
  }
  
  const Submite = async()=>{
    const h1= {...data, otp : Number(data.otp)}
  
    console.log("sdfghjk",h1)
   await axios.post(`${abd}/user/forgotPass`,h1).then((res)=>{
      console.log(res);
      setSub(res)
      setData({
        otp:"",
        email:'',
        password:"",
        confirmPassword:""
      })
  
      navigate('/login')
  }).catch((err)=>{
    console.log(err)
    setOpen(true);
     
  })
  }
  const OnSingup=(e)=>{
  e.preventDefault()
  Submite()
  }
  const [open, setOpen] = React.useState(false);
  
  const handleToClose = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpen(false);
  };

  return (
      <div className='background'>
              <Snackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        open={open}
        autoHideDuration={5000}
        message="Detail Not Match"
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
    <form className="basecont" onSubmit={OnSingup}>
          <div className="full">  
          
        <div className="main1">
          <div className="gif">
            <img src="./image/cpass.gif" alt="" class="animatimg"/>
          </div>
        
          <div className="main">
            <div className="imgcontainer1">
                <img className='pcpass1' src="./image/pcpass1.gif" alt="Avatar" class="avatar"/>
            </div>
       
        <div className="container1">
        <label for="uname"><b>Email</b></label>
        <input className="text" type="text" placeholder="Enter email" name="email"  value={data.email} onChange={OnInput} required/>
        <label for="uname"><b>OTP</b></label>
        <input className="text" type="text" placeholder="Enter OTP" name="otp"  value={data.otp} onChange={OnInput} required/>
        
        <label for="uname"><b>New Password</b></label>
        <input className="text" type="password" minLength={5} placeholder="Enter New Password" name="password"  value={data.password} onChange={OnInput} required/>
    
        <label for="psw"><b>Confirm Password</b></label>
        <input className="text" type="password" placeholder="Enter Confirm Password " name="confirmPassword" value={data.confirmPassword} onChange={OnInput} required/>
        <br/>
        <button className="text" type="submit">Submit</button>
       
      </div>
      <div className="container1">
    <button  type="button" class="cancelbtn" onClick={()=>{
                       navigate('/login')}}>Cancel</button>
   
    
  </div>
  </div>
      
      </div>
      </div>
      </form>



      </div>
  )
}

export default Changepassword1