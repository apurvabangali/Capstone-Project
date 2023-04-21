import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { abd } from "../url";

function Contact3() {
  const navigate= useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // const [sub, setSub] = useState();

  const OnInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  console.log("=====>", data);

  const submite = async () => {
    const Sdata = await axios
      .post(`${abd}/contact/insert`, data)
      .then((res) => {
        console.log(res);
        //  setSub(res)
        //  setData({
        //   name:'',
        //   email:'',
        //   subject:'',
        //   message:''
        //  })
        navigate('/')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const OnReg = (event) => {
    event.preventDefault();
    submite();
  };

  return (
    // <div className="export">
    // <div className="mexport">
    //   <form onSubmit={OnReg}>
    //     <label htmlFor="">enter your name</label>
    //     <br/>
    //     <input
    //     className="in"
    //       type="text"
    //       name="name"
    //       value={data.name}
    //       onChange={OnInput}
    //     ></input><br></br>
    //     <label htmlFor="">enter your email</label>
    //     <br/>

    //     <input
    //     className="in"
    //       type="text"
    //       name="email"
    //       value={data.email}
    //       onChange={OnInput}
    //     ></input>
    //     <br></br>
    //     <label htmlFor="">enter your subject</label>
    //     <br/>

    //     <input
    //     className="in"
    //       type="text"
    //       name="subject"
    //       value={data.subject}
    //       onChange={OnInput}
    //     ></input>
    //     <br></br>
    //     <label htmlFor="">enter your message</label>
    //     <br/>

    //     <input
    //     className="in"
    //       type="text"
    //       name="message"
    //       value={data.message}
    //       onChange={OnInput}
    //     ></input>
    //     <br></br>
    //     <input type="submit"/>
    //   </form>
    // </div>
    // </div>

    <div className="basecont">
    <div className="full">

      <div className="main1" >
        <div className="rgif">
          <img src="./image/message.gif" alt="" class="animatimg" />
        </div>

        <form className="main" onSubmit={OnReg} style={{marginTop:'70px'}}>
     

          <div className="container1">
            <label for="uname">
              <b>Name</b>
            </label>
            <input
              className="text"
              type="text"
              name="name"
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
              name="email"
              value={data.email}
              onChange={OnInput}
              placeholder="Enter Email"
              
              required='true'

            />

            <label for="uname">
              <b>Subject</b>
            </label>
            <input
              className="text"
              type="text"
              name="subject"
              value={data.subject}
              onChange={OnInput}
              placeholder="Enter Subject"
              required='true'

            />
            <label for="uname">
              <b>Message</b>
            </label>
            <textarea
              className="text"
              type="text"
              name="message"
              value={data.message}
              onChange={OnInput}
              placeholder="Enter Message"
              
              required='true'

            />
            <button className="text" type="submit">
              Send Message
            </button>
          </div>
          <div className="container2">
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}

export default Contact3;
