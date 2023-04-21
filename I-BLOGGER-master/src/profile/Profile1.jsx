import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../font-awesome.css";
import { abd } from "../url";
import axios from "axios";
import { useEffect } from "react";

function Profile1() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("id");
  const image="./image/nprofile.png";

  const [user, setUser] = useState([]);

  const getList = async () => {
    const data = await axios
      .get(`${abd}/user/profile/${uid}`)
      .then((res) => {
        // console.log(res.data.data[0]._id);
        setUser(res.data.data);
        // console.log("abc",setUser)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // console.log('abcd',user)

  return (
    <div className="full">
      <div class="padding">
        <div class="col-md-8">
          <div class="card">
            {
              user.map((val)=>{
                console.log("wertyui",val)
                return(<>
                     <div>
                  <img
                    class="card-img-top"
                    src= "./image/bprofile.jpg"
                    alt="Card image cap"
                  />
                  <div class="card-body little-profile text-center">
                    <div class="pro-img">
                      <img onClick={()=>{navigate('/updatephoto')}} className="img100" src= {val._id.image ? val._id.image:image} alt="user" />
                    </div>
                    <h3 class="m-b-0">{val._id.name}</h3>
                    <p>{val._id.email}</p>
                    <div class="row text-center m-t-20">
                      <div
                        class="col-lg-3 col-md-4 m-t-20"
                        onClick={() => {
                          navigate("/userblog");
                        }}
                      >
                        <h3 class="m-b-0 font-light">{val._id.blog}</h3>
                        <small>Blog</small>
                      </div>
                      <div
                        class="col-lg-3 col-md-4 m-t-20"
                        onClick={() => {
                          navigate("/createblog");
                        }}
                      >
                        <h3 class="m-b-0 font-light">+</h3>
                        <small>Create Blog</small>
                      </div>
                      <div class="col-lg-3 col-md-4 m-t-20">
                        <h3 class="m-b-0 font-light">{val.total}</h3>
                        <small>Comments</small>
                      </div>
                      <div
                        class="col-lg-3 col-md-4 m-t-20"
                        onClick={() => {
                          navigate(`/updateprofile`);
                        }}
                      >
                        <h3 class="m-b-0 font-light">
                          <img className="pencil" src="./image/pencil2.png" />
                        </h3>
                        <small>Update Profile</small>
                      </div>
                    </div>
                  </div>
                </div>
                </>)
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile1;
