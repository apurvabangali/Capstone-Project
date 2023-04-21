import React, { useEffect, useState } from "react";
import { AppBar, makeStyles } from "@material-ui/core";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { abd } from "./url";



const useStyles = makeStyles({
  main: {
    background: "#343a40",
    color: "#fff",
    display: "flex",
    flexDirection: "row",
    boxSizing: "border-box",
    height:'75px'
  },
  img: {
    width: 100,
    height: 100,
    marginTop: "-0.5em",
    cursor:'pointer',
    "&:hover":{
      transform:"scale(1.2)"
    }
  },
  search: {
  marginTop:10,
  width:300,
  height:50,
    backgroundColor:'transparent'
  
  },
  com: {
    display: "flex",
    marginLeft: 500,
    cursor:'pointer'
  },
  p: {
    padding: 15,
    marginLeft:'5px',
    color:'white',
    "&:hover , &:active":{
      color:'#ed563b',
      fontSize:"17px",
      boxShadow:"2px 2px 2px 2px gray",
      borderRadius:"10px"
    },
  },
  p91:{
    padding: 15,
    marginLeft:'5px',
    color:'white',
    "&:hover , &:focus":{
      color:'#ed563b',
      fontSize:"17px",
      boxShadow:"2px 2px 2px 2px gray",
      borderRadius:"10px"
    },
  },
 blog:{
  padding: 15,
  marginLeft:'5px',
  color:'white',
  "&:hover , &:focus":{
    color:'#ed563b',
    fontSize:"22px",
    boxShadow:"2px 2px 2px 2px gray",
    borderRadius:"10px"
  },
  fontSize:'20px',
  marginTop:'10px',
  cursor:'pointer'
 },
 img5:{
   width:'55px',
   height:'55px',
   borderRadius:'50%',
   marginLeft:'20px',
   "&:hover":{
     transform:"scale(1.2)"
   }
 }
 
});

function Navbar() {
  const ABC=()=>{
    localStorage.removeItem("jwt")
    localStorage.removeItem("id")
    navigate('/login')
  }
  const classes = useStyles();
  const navigate= useNavigate()
  const token = localStorage.getItem("jwt");


  const uid=localStorage.getItem("id");
  const image="../image/nprofile.png";

  const [user,setUser]=useState([]);

  const getlist= async ()=>{
    const data = await axios.get(`${abd}/user/profile/${uid}`).then((res)=>{
      // console.log("+++++++++++++++++",res.data.data)
      setUser(res.data.data)
    }).catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    getlist();
  },[])
  // pfile image //
  return (
    <AppBar className={classes.main} classes='col-lg-4'>
      <a href="#home">
      <img className={classes.img} src="../image/logo6.png" alt="" onClick={()=>{navigate('/')}} />
      </a>
      {token ? <p className={classes.blog} onClick={()=>{ navigate('/createblog')}}  >CREATE BLOG</p>:<p className={classes.blog} 
                       onClick={ABC}>CREATE BLOG</p>}
      <div className={classes.search}>
        <div className={classes.com}>
          <div className="per">
          <a href="#home">
          <p className={classes.p}  onClick={()=>{
                       navigate('/')}}>
                         HOME</p>
                       </a>
                       <a href="#blog">
          <p className={classes.p} onClick={()=>{
                       navigate('/blog')}}>BLOG</p>
                       </a>
                       <a href="#category">
          <p className={classes.p} onClick={()=>{
                       navigate('/')}} >CATEGORY</p>
                       </a>
                       <a href="#about">
          <p className={classes.p} onClick={()=>{
                       navigate('/about')}}>ABOUT</p>
                       </a>
                       <a href="#expert">
          <p className={classes.p} onClick={()=>{
                       navigate('/contact')}}>EXPERTS</p>
                       </a>
                       <a href="#founder">
          <p className={classes.p} onClick={()=>{
                       navigate('/admin')}}>FOUNDER</p>
                       </a>
         {
         token ? <p className={classes.p91} onClick={ABC}  >LOGOUT</p>:<p className={classes.p91} onClick={()=>{
                       navigate('/login')}}>LOGIN</p> 
        }
        {
          user.map((val)=>{
            // console.log("......................",val)
            return(
              <>
               {token ? <img src={val._id.image ? val._id.image:image} className={classes.img5} onClick={()=>{
              navigate('/profile')}}/>:<p  className={classes.img5} onClick={ABC} />}
              </>
            )
            
            
          })
        }
        </div>
         
        </div>
      </div>
    </AppBar>
    
  );
}

export default Navbar;
