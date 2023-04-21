import React, { useState } from "react";
import "../Style.css";
import "../bootstrap.min.css";
import "../font-awesome.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { abd } from "../url";
import parse from "html-react-parser"
// import { useContext } from "react";
// import {UserContext} from '../App'

function Userblog2() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const uid = localStorage.getItem("id");
  // const [state,dispatch] = useContext(UserContext)



  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const data = await axios
      .get(`${abd}/blog/viewAll/${uid}`)
      .then((res) => {
        console.log(res.data.data);
        setUser(res.data.data);

        // navigate('/')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // delete blog

  function deleteUser(_id)
  
  {
      fetch(`${abd}/blog/delete/${_id}`,{
          method:'POST'
  }).then((result)=>{
      result.json().then((res)=>{
          getList()
      })
  })
  }  

  //recent blog
  const[recent, setRecent]= useState([]);

  const recentlist = async ()=>{
    const recent1= await axios.get(`${abd}/blog/profileBlog/${uid}`).then((res)=>{
      // console.log(res.data.data)
      setRecent(res.data.data)
    }).catch((err)=>{
      console.log(err)
    })
  }

  useEffect(() => {
    recentlist();
  }, []);

  //search
  const [search,setSearch]= useState([]);


  const searchlist = async (e)=>{
    const body = {
      keyword:e
    }
    console.log("body,",body);
    const search1 = await axios.post(`${abd}/user/search/${uid}`,body).then((res)=>{
      // console.log(res.data.data)
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
  //like

  // const like = async(id)=>{
  //       const body2={
  //         action:1
  //       }
    
  //       setClick(!click)
  //       const data = await axios.post(`${abd}/blog/likeBlog/${id}`,body2).then((res)=>{
  //      console.log(res)
  //      setClick(res)
  //       }).catch((err)=>{
    
  //       })
  //     }

  //     const disLike =async(id)=>{
  //           const body2={
  //             action:0
  //           }
        
  //           setClick(!click)
  //           const data = await axios.post(`${abd}/blog/likeBlog/${id}`,body2).then((res)=>{
  //          console.log(res)
  //           }).catch((err)=>{
        
  //           })
  //         }

          const [click,setClick] =useState(true)
 
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
                  // console.log("dfghjkl", val1);
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
                  // console.log(val.blog._id)
                  return (
                    <>
                      <article>
                        <img src={val.blog.image} alt="" />
                        <h4>{val.blog.title}</h4>

                        <p >
                           <i class="fa fa-user" style={{color:"orange"}}></i> {val.user} &nbsp;|&nbsp;{" "} 
                           {
                             click ? <i class="fa fa-heart"style={{color:"gray"}} aria-hidden="true" onClick={()=>{setClick(!click)}}>
                               
                             </i>:  <i class="fa fa-heart" aria-hidden="true" style={{color:"red"}} onClick={()=>{setClick(!click)}}
                             >  You Liked</i> 
                           }
                         
                          &nbsp;|&nbsp; <i class="fa fa-comments" style={{color:"lightgreen"}}></i> {val.comment}  comments &nbsp;|&nbsp; <i class="fa fa-exclamation" style={{color:"yellow"}}>
                          </i> {val.blog.status} 
                          &nbsp;|&nbsp; <i class="fa fa-list"style={{color:"#00b2ce"}} ></i> {val.blog.category}
                          &nbsp;|&nbsp; <i class="fa fa-comment"style={{color:"green"}} onClick={()=>{navigate("/livechat")}} ></i> Live Chat

                          
                        </p>

                        <p className="ellipsis"><td dangerouslySetInnerHTML={{__html: val.blog.discription}}/></p>
                       
                        <div className="edit">
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
                        <div>
                          
                        <img onClick={()=>{navigate(`/updateblog/${val.blog._id}`)}} className="pencil2" src="./image/update1.gif" alt=""/>
                        <img onClick={()=>deleteUser(val.blog._id)} className="pencil3" src="./image/delete1.gif" alt="" />
                        </div>
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
                <form id="search_form" name="gs" method="GET" action="#">
                  <input
                    type="text"
                    name="q"
                    className="searchText"
                    placeholder="Type to search..."
                    autocomplete="on"
                    onChange={onChange}
                  />
                </form>
              </div>
                <hr />
              <h5 class="h5">Recent posts</h5>

              {recent.map((val2) => {
                  // console.log("++++", val2);
                  return (
              <ul>
                <li>
                  <p>
                    <a  href="" onClick={()=>{navigate(`/blogdetails/${val2.blog._id}`)}} >
                    {val2.blog.title}
                    </a>
                  </p>
                  <small>
                    <i class="fa fa-user" style={{color:"orange"}}></i> {val2.user} &nbsp;|&nbsp;{" "}
                    <i class="fa fa-calendar" style={{color:"orange"}}></i>  {val2.blog.createDate}
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

export default Userblog2;


//  ---------------------------------------------------------- video -------------------------------------------------------- //

// const likePost = (id)=>{
  //   fetch(`${abd}/blog/likeBlog/${id}`,{
  //     method:"POST",
  //     headers:{
  //       "Content-Type":"application/json",
  //       "Authorization":localStorage.getItem("id")
  //     },
      
  //     body:JSON.stringify({
  //        postId:id,
  //     })
  //   }).then(res=>res.json())
  //   .then(result=>{
  //     console.log(result)
  //   })
  // } 



// const [like,setLike]=useState([]);
//   const likepost = async (id)=>{
//     const data = await axios.post(`${abd}/blog/likeBlog/${id}/${uid}`,like).then((res)=>{
//         console.log(res.data.data)
//         const newData = user.map(val=>{
//           if(val.blog._id===res.data.data._id){
//             return res
//           }else{
//             return val
//           }
//         }) 
//         setLike(newData)
//     }).catch((err)=>{

//       console.log(err)
//     })
//   }


//   const [unlike,setUnlike]= useState([]);
//    const unlikePost = async (id)=>{
//      const data1 = await axios.post (`${abd}/blog/unlike/${id}/${uid}`,unlike).then((res)=>{
//       console.log(res.data.data)

//       const newData = user.map(val=>{
//         if(val.blog._id===res.data.data._id){
//           return res
//         }else{
//           return val
//         }
//       }) 
//       setUnlike(newData)
//   }).catch((err)=>{

//     console.log(err)
//   })
// }
   

  

  // const unlikePost = (id)=>{
  //   fetch(`${abd}/blog/likeBlog/${id}`,{
  //     method:"POST",
  //     headers:{
  //       "Content-Type":"application/json",
  //       "Authorization":localStorage.getItem("jwt")
  //     },
  //     body:JSON.stringify({
  //        postId:id
  //     })
  //   }).then(res=>res.json())
  //   .then(result=>{
  //     console.log(result)
  //   })
  // }




  //-------------------------------- Like --------------------------------- //

  //   const [like,setLike]=useState({
//     // action:0
//   });

//   const likepost= async (id)=>{
//     const body1 = {
//       action:1
//     }
//     // like===0 ? setLike(1) :setLike(0)
    
//     const like1= await axios.post(`${abd}/blog/likeBlog/${id}`,body1).then((res)=>{
//       console.log("= like===>",res)
//       // navigate('/profile')
//     }).catch((err)=>{
//       console.log(err)
//     })
//   }

//   const [dlike,setDlike]=useState({
   
//   });

//   const unlikePost= async (id)=>{
//     const body2={
//       action:0
//     }
  
//     // dlike===0 ? setDlike(1) :setDlike(0)
    
//     const like1= await axios.post(`${abd}/blog/likeBlog/${id}`,body2).then((res)=>{
//       console.log("= unlike===>",res)
//       // navigate('/profile')

//     }).catch((err)=>{
//       console.log(err)
//     })
//   }

  
//   const likeeee = async(id)=>{
//     const body2={
//       action:0
//     }

//     setClick(!click)
//     const data = await axios.post(`${abd}/blog/likeBlog/${id}`,body2).then((res)=>{
//    console.log(res)
//     }).catch((err)=>{

//     })
//   }

//   const dissLike =async(id)=>{
//     const body2={
//       action:1
//     }

//     setClick(!click)
//     const data = await axios.post(`${abd}/blog/likeBlog/${id}`,body2).then((res)=>{
//    console.log(res)
//     }).catch((err)=>{

//     })
//   }

//   const liked = 1
//   const [click,setClick] =useState()
// console.log("++++++++++++",liked)