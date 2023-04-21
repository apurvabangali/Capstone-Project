import React, { useState } from "react";
// import './login.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { abd } from "../url";

// function UpdatePhoto1() {
//   const navigate = useNavigate();
//   const [file, setFile] = useState("");
//   const id = localStorage.getItem("id");

//   const abc = async (e) => {
//     console.log(file);
//     const formData = new FormData();
//     formData.append("image", file);


//     const data = await axios
//       .post(`${abd}/user/updateImage/${id}`, formData)
//       .then((res) => {
//         console.log(res);
//         alert("upload image");
//       })
//       .catch((err) => {
//         console.log("abc", err);
//       });
//   };

 

  const UpdatePhoto1 = () => {
    const navigate = useNavigate();
    const [file,setFile] =useState("");
    const id = localStorage.getItem("id");
    
    const sub= async(e)=>{
        console.log(file)
        const formData=new FormData();
        formData.append('image',file);
    
      const data= await axios.post(`${abd}/user/updateImage/${id}`,formData).then((res)=>{
          console.log(res);
          navigate('/profile')
      }).catch((err)=>{
          console.log(err)
      })
    }
    const OnSignup = (e) => {
      e.preventDefault();
      sub();
    };

    function deleteUser(_id)
  
    {
        fetch(`${abd}/user/deleteImage/${_id}`,{
            method:'POST'
    }).then((result)=>{
        result.json().then((res)=>{
            sub()
            navigate('/profile')
        })
    })
    }  

  return (
    <div className="basecont">
      <form className="full">
        <div className="main1">
          <div className="gif">
            <img src="./image/animation.gif" alt="" class="animatimg" />
          </div>

          <div className="main">
            <div className="imgcontainer1">   
              <img src="./image/panimation.gif" alt="Avatar" class="avatar" />
            </div>

            <div className="container1">
              <label for="uname">
                <b>Upload Photo</b>
              </label>
              <input
                className="text"
                type="file"
                onChange={(e)=>setFile(e.target.files[0])}
                placeholder="Enter upload photo"
              />

              <button className="text" type="submit" onClick={OnSignup}>
                UpdatePhoto
              </button>
            </div>
            <div className="container1">
              <button
                type="button"
                class="cancelbtn"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Cancel
              </button>
              <button  type="button" class="cancelbtn2" onClick={()=>deleteUser(id)}>Remove Photo</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdatePhoto1;
