import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { abd } from "../url";

function UpdateProfile1() {
  const uid = localStorage.getItem("id");

  const [data,setData]=useState({
    name:"",
    email:"",
    phone:"",
    username:""
})

const Submite = async()=>{

 await axios.get(`${abd}/user/profile/${uid}`).then((res)=>{
    console.log(res.data.data[0]._id);
    setData(res.data.data[0]._id)

}).catch((err)=>{
  console.log(err)
  alert('Detail Not Match') 
})
}
const OnInput=(e)=>{
  const {name,value}= e.target;
  setData({ ...data, [name]:value});
  
  }

useEffect(()=>{
  Submite();
},[])


const sub = async ()=>{

  const data1 = await axios.post(`${abd}/user/update/${uid}`,data).then((res)=>{

    navigate('/profile')
  }).catch((err)=>{
      console.log(err)

  })
}


  const navigate = useNavigate();
  return (
    <>
      <div className="basecont5">
        <div className="full" >
          <div className="main1">
            <div className="rgif">
              <img src="./image/updateP.gif" alt="" class="animatimg" />
            </div>

            <div className="main">
              <div className="container10">
                <label for="uname">
                  <b>Name</b>
                </label>
                <input
                  className="text"
                  pattern="[a-zA-Z'-'\s]*"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={OnInput}
                  placeholder="Enter Name"
                />


                <label for="uname">
                  <b>Email</b>
                </label>
                <input
                  className="text"
                  type="text"
                  name="email"
                  value={data.email}
                  onChange={OnInput}
                  placeholder="Enter Email"
                />

                <label for="uname">
                  <b>Mobile Number</b>
                </label>
                <input
                  className="text"
                  pattern="[6789][0-9]{9}"
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={OnInput}
                  placeholder="Enter Number"
                  minLength={10}
                  maxLength={10}
                />

                <label for="uname">
                  <b>Username</b>
                </label>
                <input
                  className="text"
                  type="text"
                  name="username"
                  value={data.username}
                  onChange={OnInput}
                  placeholder="Enter Username"
                />

                <button className="text" type="submit" onClick={sub}>
                  Update Profile
                </button>
              </div>
              <div className="container2">
                <button
                  type="button"
                  class="cancelbtn"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProfile1;
