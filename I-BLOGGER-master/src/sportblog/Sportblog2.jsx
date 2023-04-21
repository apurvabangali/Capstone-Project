import React, { useState } from "react";
import "../Style.css";
import "../bootstrap.min.css";
import "../font-awesome.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { abd } from "../url";
import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles({

      
 
  btn:{
      width:70,
      marginTop:'-1px',
      height:40,
      marginLeft:10,
      borderRadius:5,
      background:'gray',
      textAlign:'center',
      backgroundColor:'#f2f2f2'        
  },
  search:{
      width:'30px',
      marginTop:'-7px'
  }
 
})

function Sportblog2() {
  const classes = useStyles();

  const navigate = useNavigate();
  const [user, setUser] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const data = await axios
      .get(`${abd}/blog/sport`)
      .then((res) => {
        console.log(res.data.data);
        setUser(res.data.data);

        // navigate('/')
      })
      .catch((err) => {
        console.log(err);
      });
  };

// search Bar
  const [search,setSearch]= useState([]);


  const searchlist = async (e)=>{
    const body = {
      keyword:e
    }
    console.log("body,",body);
    const search1 = await axios.post(`${abd}/blog/sSearch`,body).then((res)=>{
      console.log(res.data.data)
      setSearch(res.data.data)

    }).catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    searchlist();
  },[])

  const onChange=(e)=>{
    searchlist(e.target.value)
  }

  //recent


  const [recent,setRecent]=useState([]);
  const recentlist= async () =>{
      const recent1= await axios.get(`${abd}/blog/sSort`).then((res)=>{
        console.log(res.data.data)
        setRecent(res.data.data)
      }).catch((err)=>{
        console.log(err)
      })
  }

  useEffect(() => {
    recentlist();
  }, []);

  const [click,setClick] =useState(true)
  
  

  console.log("==============>",search)
  return (
    <>
      <section class="section" id="our-classes">
        <div class="container">
          <br />
          <br />
          <div class="row">
            <div class="col-lg-8">
              <section class="tabs-content">

              {search.map((val1) => {
                  console.log("dfghjkl", val1);
                  return (
                    <>
                      <article>
                        <img src={val1.blog.image} alt="" />
                        <h4>{val1.blog.title}</h4>

                        <p>
                          <i class="fa fa-user" style={{color:"orange"}}></i> {val1.user} &nbsp;|&nbsp;{" "}
                          {
                             click ? <i class="fa fa-heart"style={{color:"gray"}} aria-hidden="true" onClick={()=>{setClick(!click)}}>
                               
                             </i>:  <i class="fa fa-heart" aria-hidden="true" style={{color:"red"}} onClick={()=>{setClick(!click)}} > You Liked</i> 
                           }
                          &nbsp;|&nbsp; <i class="fa fa-comments" style={{color:"lightgreen"}}></i> {val1.comment}  comments &nbsp;|&nbsp;
                          <i class="fa fa-exclamation" style={{color:"yellow"}}>
                          </i> {val1.blog.status} 
                          &nbsp;|&nbsp; <i class="fa fa-list"style={{color:"#00b2ce"}} ></i> {val1.blog.category}
                          &nbsp;|&nbsp; <i class="fa fa-comment"style={{color:"green"}} onClick={()=>{navigate("/livechat")}} ></i> Live Chat

                         
                        </p>

                        <p className="ellipsis"><td dangerouslySetInnerHTML={{__html: val1.blog.discription}}/></p>
                        <div class="main-button">
                          <a
                            href=""
                            onClick={() => {
                              navigate(`/blogdetails/${val1.blog._id}`);
                            }}
                          >
                            Continue Reading
                          </a>
                        </div>
                        
                        <br />
                        <div style={{borderBottom:'1px solid black'}}></div>
                        <br/>
                      </article>
                    </>
                  );
                })}

                {user.map((val) => {
                  console.log("dfghjkl", val);
                  return (
                    <>
                      <article>
                        <img src={val.blog.image} alt="" />
                        <h4>{val.blog.title}</h4>

                        <p>
                          <i class="fa fa-user" style={{color:"orange"}}></i> {val.user} &nbsp;|&nbsp;{" "}
                          {
                             click ? <i class="fa fa-heart"style={{color:"gray"}} aria-hidden="true" onClick={()=>{setClick(!click)}}>
                               
                             </i>:  <i class="fa fa-heart" aria-hidden="true" style={{color:"red"}} onClick={()=>{setClick(!click)}} > You Liked</i> 
                           }
                          &nbsp;|&nbsp; <i class="fa fa-comments" style={{color:"lightgreen"}}></i> {val.comment}  comments &nbsp;|&nbsp;
                          <i class="fa fa-exclamation" style={{color:"yellow"}}>
                          </i> {val.blog.status} 
                          &nbsp;|&nbsp; <i class="fa fa-list"style={{color:"#00b2ce"}} ></i> {val.blog.category}
                          &nbsp;|&nbsp; <i class="fa fa-comment"style={{color:"green"}} onClick={()=>{navigate("/livechat")}} ></i> Live Chat

                         
                        </p>

                        <p className="ellipsis"><td dangerouslySetInnerHTML={{__html: val.blog.discription}}/></p>
                        <div class="main-button">
                          <a
                            href="#bd"
                            onClick={() => {
                              navigate(`/blogdetails/${val.blog._id}`);
                            }}
                          >
                            Continue Reading
                          </a>
                        </div>
                        
                        <br />
                        <div style={{borderBottom:'1px solid black'}}></div>
                        <br/>
                      </article>
                    </>
                  );
                })}
              </section>
            </div>
              
            <div class="col-lg-4">
              <h5 class="h5">Search</h5>

              <div class="contact-form">
                <form id="search_form" name="gs">
                  <div className="search">
                    <div>
                  <input
                    type="text"
                    name="q"
                    className="searchText"
                    placeholder="Type to search..."
                    autocomplete="on"
                    onChange={onChange}
                  />
                  </div>
                  
                   </div>
                </form>
              </div>
                <hr />
              <h5 class="h5">Recent posts</h5>
              {recent.map((val2) => {
                  console.log("++++", val2);
                  return (
              <ul>
                <li>
                  <p>
                    <a href="" onClick={()=>{navigate(`/blogdetails/${val2.blog._id}`)}}>
                      {val2.blog.title}
                    </a>
                  </p>
                  <small>
                    <i class="fa fa-user" style={{color:"orange"}}></i> {val2.user} &nbsp;|&nbsp;{" "}
                    <i class="fa fa-calendar" style={{color:"orange"}}></i> {val2.blog.createDate}
                  </small>
                </li>
              </ul>
                 );
                })}
                   <hr />
                <h5 class="h5">CATEGORIES</h5>
                <a href="#spblog">
                    <p className="isize" style={{cursor:"pointer"}} onClick={()=>{navigate('/sportblog')}}>SPORTS</p>
                </a>
                
                <a href="#neblog">
                    <p className="isize" style={{cursor:"pointer"}} onClick={()=>{navigate('/newsblog')}}>NEWS</p>
                </a>

                <a href="#coblog">
                <p className="isize" style={{cursor:"pointer"}} onClick={()=>{navigate('/codingblog')}}>CODING</p>
                </a>

                <a href="#otcode">
                <p className="isize" style={{cursor:"pointer"}} onClick={()=>{navigate('/otherblog')}}>OTHER</p>
                </a>
                <hr />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Sportblog2;
