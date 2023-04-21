import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { abd } from "../url";
import { Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

function Forgetpassword1() {
  const navigate = useNavigate();

  const [email, setEmail] = useState({
    email: "",
  });

  const [abc, setAbc] = useState("");

  const OnInput = (e) => {
    const { name, value } = e.target;
    setEmail({ ...email, [name]: value });
  };
  const sub = async () => {
    const data = await axios
      .post(`${abd}/user/sendEmail`, email)
      .then((res) => {
        console.log(res);
        setAbc(res);
        setEmail({
          email: "",
        });

        navigate("/change");
      })
      .catch((err) => {
        // console.log("err", err);
        setOpen(true);

      });
  };
  const loginUser = async (e) => {
    e.preventDefault();
    sub();
  };

  const [open, setOpen] = React.useState(false);
  
  const handleToClose = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpen(false);
  };


  return (
    <div className="basecont">
         <Snackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        open={open}
        autoHideDuration={5000}
        message="Email Not Register"
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
      <form className="full" onSubmit={loginUser}>
        {/* <img className="img1" src='./image/bg2.jpg' alt="" /> */}

        <div className="main1">
          <div className="gif">
            <img src="./image/fpass.gif" alt="" class="animatimg" />
          </div>

          <div className="main">
            <div className="imgcontainer1">
              <img src="./image/pfpass.gif" alt="Avatar" class="avatar" />
            </div>

            <div className="container1">
              <label for="uname">
                <b>Email</b>
              </label>
              <input
                className="text"
                type="text"
                placeholder="Enter Email"
                name="email"
                value={email.email}
                onChange={OnInput}
              />
              {/*     
        <label  for="psw"><b>OTP</b></label>
        <div className='otp'>
        <button className='text2' > Send Otp</button>
        <input className="text1" type="text" placeholder="Enter OTP" name="otp" value={email.otp} onChange={OnInput} />
        </div>
        <br/> */}
              <button className="text" type="submit">
                Send Otp
              </button>
              {/* <label>
          <input type="checkbox" checked="checked" name="remember"/> Remember me
        </label> */}
            </div>
            <div className="container1">
              <button
                type="button"
                class="cancelbtn"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Cancel
              </button>

              {/* <span className="psw" onClick={()=>{
                       navigate('/change')}} >Change <a className="password" href="#">password?</a></span> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Forgetpassword1;
