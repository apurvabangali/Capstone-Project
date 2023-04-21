import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import { abd } from "../url";

function Register1() {
  const navigate = useNavigate();

  const [data,setData]=useState({
    name:"",
    email:"",
    gender:"",
    phone:"",
    username:"",
    password:""
})
const[sub,setSub]=useState("")


const OnInput=(e)=>{
const {name,value}= e.target;
setData({ ...data, [name]:value});
}

const Submite = async()=>{
const Sdata=await axios.post(`${abd}/user/register`,data).then((res)=>{
    console.log(res);
    setSub(res)
    setData({
      name:"",
      email:"",
      gender:"",
      phone:"",
      username:"",
      password:""
    })

    navigate('/login')
}).catch((err)=>{
  console.log(err)
  alert('Please Check You Username And Email')
   
})
}
const OnSingup=(e)=>{
e.preventDefault()
Submite()
}
  return (
    <div className="basecont">
      <div className="full">

        <div className="main1">
          <div className="rgif">
            <img src="./image/register1.gif" alt="" class="animatimg" />
          </div>

          <form className="main" onSubmit={OnSingup}>
       

            <div className="container1">
              <label for="uname">
                <b>Name</b>
              </label>
              <input
                className="text"
                pattern="[a-zA-Z'-'\s]*"
                type="text"
                name='name'
                value={data.name}
                onChange={OnInput}
                placeholder="Enter Name"
               
                required='true'
              />

              <label for="uname">
                <b>Email</b>
              </label>
              <input
                className="text"
                type="text"
                name='email'
                value={data.email}
                onChange={OnInput}
                placeholder="Enter Email"
                
                required='true'

              />

              <label for="uname">
                <b>Mobile Number</b>
              </label>
              <input
                className="text"
                pattern="[6789][0-9]{9}"
                type="text"
                name='phone'
                value={data.phone}
                onChange={OnInput}
                placeholder="Enter Number"
                minLength={10}
                maxLength={10}
                required='true'

              />

              <label for="uname">
                <b>Gender</b>
              </label>
              {/* <input
                className="text"
                type="text"
                name='gender'
                value={data.gender}
                onChange={OnInput}
                placeholder="Enter Gender"
               
                required='true'

              /> */}
              <div className="genderflex">
                <div className="maleflex">
                          <div className=""> Male: </div>
                          <input
                            className="rediodown"
                            type="radio"
                            name="gender"
                            value="male"
                            onChange={OnInput}
                            required="true"
                          />{" "}
                </div>
                <div className="maleflex">
                          <div className=""> Female: </div>
                          <input
                            className="rediodown"
                            type="radio"
                            name="gender"
                            value="female"
                            onChange={OnInput}
                            required="true"
                          />
                </div>
              </div>
              <label for="uname">
                <b>Username</b>
              </label>
              <input
                className="text"
                type="text"
                name='username'
                value={data.username}
                onChange={OnInput}
                placeholder="Enter Username"
                
                required='true'

              />

              <label for="psw">
                <b>Password</b>
              </label>
              <input
                className="text"
                type="password"
                name='password'
                minLength={5}
                value={data.password}
                onChange={OnInput}
                placeholder="Enter Password"
                
                required='true'

              />

              <button className="text" type="submit">
                Register
              </button>
              {/* <label>
                <input type="checkbox" checked="checked" name="remember" />{" "}
                Remember me
              </label> */}
            </div>
            <div className="container2">
              <button
                type="button"
                class="cancelbtn"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register1;
