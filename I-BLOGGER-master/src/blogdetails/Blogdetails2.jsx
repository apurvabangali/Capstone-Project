import React from "react";
import "../Style.css";
import "../bootstrap.min.css";
import "../font-awesome.css";
import { useNavigate, useParams } from "react-router-dom";
import { Component, useState } from "react";
import { useEffect } from "react";
import parse from "html-react-parser"
import axios from "axios";
import { abd } from "../url";



// blog show
function Blogdetails2() {
    const navigate=useNavigate()
  const { id } = useParams();
  const bid = id;

  const uid= localStorage.getItem("id")

//   console.log(bid);
const [show,setShow]=useState([]);

  const [val, setVal] = useState([]);
  const getlist = async () => {
    const data = await axios
      .get(`${abd}/blog/views/${bid}`)
      .then((res) => {
        // console.log("===========>",res.data.data);
        setVal(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect((e) => {
    getlist();
  }, []);

//   console.log("abc", val);

// comment
  const[cmt,setCmt]=useState({
      name:"",
      comment:""
  })

  const[msg,setMsg]= useState()

  const OnInput=(e)=>{
    const {name,value}= e.target;
    setCmt({ ...cmt, [name]:value});
    }

    const submite= async()=>{
        const sData= await axios.post(`${abd}/comment/add/${bid}/${uid}`,cmt).then((res)=>{
            console.log(res)
            setMsg(res)
            setCmt({
                name:"",
                comment:""
            })
            navigate('/blog')
        }).catch((err)=>{
            console.log(err)
            alert('Please Login ')
        })
    }
    const OnSingup=(e)=>{
        e.preventDefault()
        submite()
        }

//comment show

 const showlist= async ()=>{
     const show1= await axios.get(`${abd}/comment/view/${bid}`).then((res)=>{
         console.log(res.data.data)
         setShow(res.data.data)
     }).catch((err)=>{
         console.log(err)
     })
 }

 useEffect(()=>{
     showlist();
 }, []);
 

//   console.log("sdfghjkl;sdfghjk",val.blog.title)
  return (


        <section class="section" id="our-classes">
        <div class="container">
            <br/>
            <br/>
            <section class='tabs-content'>
            {
                val.map((item)=>{
                    // console.log("===========**========>",item)
                    return(
                        <>
                        <article>
                    <h4>{item.blog.title}</h4>

                    <p>
                        <i class="fa fa-user" style={{color:"orange"}}></i> {item.user} &nbsp;|&nbsp; <i class="fa fa-calendar" style={{color:""}}></i> {item.blog.createDate} &nbsp;|&nbsp; <i class="fa fa-comments" style={{color:"lightgreen"}}></i> {item.comment} comments
                        </p>

                    <div><img src={item.blog.image} alt=""/></div>

                    <br/>

                    <pre className="shortline"><td dangerouslySetInnerHTML={{__html: item.blog.discription}}/></pre>
                </article>
                        </>
                    )
                })
            }
            </section>
            <br/>
            <br/>
            <br/>

            <section class='tabs-content'>
          <div class="row">
          <div class="col-md-8">
                        <h4>Comments</h4>
                        <ul class="features-items">
                            <li>

 {
         show.map((val)=>{
              console.log("vivek",val)
                    return(<>
                                <div class="feature-item" style={{marginBottom:15}}>
                                    <div class="left-icon">
                                        {/* <img src="../image/features-first-icon.png" alt="First One"/> */}
                                    </div>
                                    <div class="right-content">
                                        <h4> <i class="fa fa-user" style={{color:"orange"}}></i> {val.name} &nbsp;|&nbsp; <small> <i class="fa fa-calendar" style={{color:""}}></i>  {val.date}</small></h4>
                                        <p><em>{val.comment} </em></p>
                                    </div>
                                   
                                </div>
                                <br/>
                                    <br/>

                                </>
                                        )
                                    })
                                }
                            </li>
                        </ul>
                    </div>

                    <div class="col-md-4">
                        <h4>Leave a comment</h4>

                        <div class="contact-form">
                            <form action="" onSubmit={OnSingup} >
                                <div class="row">
                                    <div class="col-lg-12">
                                        <fieldset>
                                            <input name="name" type="text" id="name" placeholder="Your Name*"  value={cmt.name}
                                                onChange={OnInput} required=""/>
                                        </fieldset>
                                    </div>
                                    <div class="col-lg-12">
                                        <fieldset>
                                            <textarea name="comment" rows="6" id="message" placeholder="Message" value={cmt.comment} onChange={OnInput} required=""></textarea>
                                        </fieldset>
                                    </div>
                                    <div class="col-lg-12">
                                        <fieldset>
                                            <button type="submit" id="form-submit" class="main-button">Submit</button>
                                        </fieldset>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                 </div>
            </section>
        </div>
    </section>
  );
}

export default Blogdetails2;
