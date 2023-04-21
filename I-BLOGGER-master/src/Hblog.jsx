import React, { useEffect, useState } from 'react'
import './Style.css';
import './bootstrap.min.css'
import './font-awesome.css'
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { abd } from "./url";

// import '../src/js/jquery-2.1.0.min.js'


const useStyle=makeStyles({

    main:{
        textAlign: 'center',
  padding: '20px 30px',
  width: '100%',
  borderRadius: '5px',
  display: 'inline-block',
  boxShadow:' 0px 0px 15px rgba(0,0,0,0.1)',
  color: '#fff',
  fontSize: '19px',
  letterSpacing: '0.5px',
  fontWeight: 600,
  backgroundColor: '#ed563b',
  cursor:'pointer'
    }
})

function Hblog() {
    const navigate=useNavigate();
    const classes=useStyle();

    const [num,setNum]= useState([]);

    const getlist = async ()=>{
        const data = await axios.get(`${abd}/blog/top`).then((res)=>{
            console.log(res.data.data);
            setNum(res.data.data);
        }).catch((err)=>{
            console.log(err)
        })

    }

    useEffect(()=>{
        getlist();
    }, [])


    console.log("abc",num)
    const [click,setClick] =useState(true)


    // search  //
    

  return (

  <div id='category'>
      
      
    <section class="section" id="our-classes">
        <div class="container">
        <div class="row">
                <div class="col-lg-6 offset-lg-3" >
                    <div class="section-heading">
                        <h2>CATE<em>GORIES</em></h2>
                        <img src="./image/line-dec.png" alt=""/>
                    </div>
                </div>
            </div>
    <section class="section " id="trainers">
        <div class="container">
            <div class="row">
                
                <div class="scal  col-md-3 col-sm-6"  onClick={()=>{navigate('/sportblog')}}>
                    <a href="#spblog">
                    <div class="trainer-item">
                        <div class="image-thumb">
                            <img class="cimag" src="./image/sports.jpg" alt=""/>
                        </div>
                        <br />
                        <br />
                        <div class="down-content">
                        <h3 style={{textAlign:"center"}}>SPORTS</h3>
                        </div>
                    </div>
                    </a>
                </div>
                <div class="scal col-md-3 col-sm-6"  onClick={()=>{navigate('/newsblog')}}>
                    <a href="#neblog">
                    <div class="trainer-item">
                        <div class="image-thumb">
                        <   img class="cimag" src="./image/news.jpg" alt=""/>
                        </div>
                        <br />
                        <br />
                        <div class="down-content">
                        <h3 style={{textAlign:"center"}}>NEWS</h3>
                        </div>
                    </div>
                    </a>
                </div>
                <div class="scal col-md-3 col-sm-6"  onClick={()=>{navigate('/codingblog')}}>
                <a href="#coblog">

                    <div class="trainer-item">
                        <div class="image-thumb">
                            <img  class="cimag" src="./image/coding.jpg" alt=""/>
                        </div>
                        <br />
                        <br />
                        <div class="down-content">
                            <h3 style={{textAlign:"center"}}>CODING</h3>
                        </div>
                    </div>
                    </a>
                </div>

                <div class="scal col-md-3 col-sm-6"  onClick={()=>{navigate('/otherblog')}}>
                    <a href="#otcode">
                    <div class="trainer-item">
                        <div class="image-thumb">
                            <img class="cimag" src="./image/other.jpg" alt=""/>
                        </div>
                        <br />
                        <br />

                        <div class="down-content">
                            <h3 style={{textAlign:"center"}}>OTHER</h3>
                        </div>
                    </div>
                    </a>
                </div>
            </div>
        </div>
    </section>
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <div class="section-heading">
                        <h2>Blog<em> posts</em></h2>
                        <img src="./image/line-dec.png" alt=""/>
                        <p>A directory of wonderful things…</p>
                    </div>
                </div>
            </div>
         
 

          
            {
                num.map((val)=>{
                 console.log("=========>",val)
                return(<>
                
            
         
            <div class="row" id="tabs">
                <div class="col-lg-4">
                    <ul>
                        <li><a href='#'>{val.blog.title}</a></li>
                        {/* <li><a href='#tabs-2'>Aspernatur excepturi magni, placeat rerum nobis magnam libero! Soluta.</a></li>
                        <li><a href='#tabs-3'>Sunt hic recusandae vitae explicabo quidem laudantium corrupti non adipisci nihil.</a></li> */}
                        <div className={classes.main} onClick={()=>{
                       navigate('/blog')}}>Read More</div>
                    </ul>
                </div>
                <div class="col-lg-8">
                    <section class='tabs-content'>
                        <article id=''>
                            <img src={val.blog.image} alt=""/>
                            <h4>{val.blog.title}</h4>

                            <p>
                            <i class="fa fa-user" style={{color:"orange"}}></i> {val.user} &nbsp;|&nbsp;{" "} 
                            {
                             click ? <i class="fa fa-heart"style={{color:"gray"}} aria-hidden="true" onClick={()=>{setClick(!click)}}>
                               
                             </i>:  <i class="fa fa-heart" aria-hidden="true" style={{color:"red"}} onClick={()=>{setClick(!click)}} > You Liked</i> 
                           }
                         
                          &nbsp;|&nbsp; <i class="fa fa-comments"style={{color:"lightgreen"}}></i> {val.comment}  comments &nbsp;|&nbsp; <i class="fa fa-exclamation" style={{color:"yellow"}}>
                          </i> {val.blog.status} 
                          &nbsp;|&nbsp; <i class="fa fa-list"style={{color:"#00b2ce"}} ></i> {val.blog.category}
                          &nbsp;|&nbsp; <i class="fa fa-comment"style={{color:"green"}} onClick={()=>{navigate("/livechat")}} ></i> Live Chat

                            </p>


                            <p className='ellipsis'><td dangerouslySetInnerHTML={{__html: val.blog.discription}}/></p>
                            <div class="main-button" >
                                <a href="#bd" onClick={()=>{
                       navigate(`/blogdetails/${val.blog._id}`)}}>Continue Reading</a>
                            </div>
                        </article>
                        
                    </section>
                </div>
            </div>
            <br/>
            <br/>
            
    
   
           
            </>)
            
        })
    }
        
        </div>
    </section>
    </div>

//  <div>
//      {
//          num.map((val)=>{
//             //  console.log(val)
//             return(
//                 <p>{val.user}</p>
//             )
//          })

//      }
//  </div>
    
  )
}

export default Hblog