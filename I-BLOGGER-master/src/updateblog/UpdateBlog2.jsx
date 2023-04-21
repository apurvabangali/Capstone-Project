import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { abd } from "../url";
import  { useEffect } from "react";
import ReactQuill from "react-quill";
import "../../node_modules/react-quill/dist/quill.snow.css"


function UpdateBlog2() {
  const navigate= useNavigate();
  const {id}= useParams();
  const bid=id;
  // console.log(bid)


  const [user,setUser]=useState({
    title:"",
    discription:""
  });

  


  const getlist= async ()=>{
    const abc = await axios.get(`${abd}/blog/views/${bid}`).then((res)=>{
      console.log("1111111",res.data.data[0].blog);
      setUser(res.data.data[0].blog);

    }).catch((err)=>{
      console.log(err)
    })
  }

  const OnInput=(e)=>{
    const {name,value}= e.target;
    setUser({ ...user, [name]:value})
  }

  useEffect(()=>{
    getlist();
  },[])
  const sub= async()=>{
  const data1 = await axios.post(`${abd}/blog/update/${bid}`,user).then((res)=>{
    navigate('/userblog')
  }).catch((err)=>{
    console.log(err)
  })
}

    return (
    <div className="bcontainer">
      <div className="bmain">
        {/* <label htmlFor="">
          <b>Title:</b>
        </label>
        <input
          className="text1"
          type="text" 
          name="title"
         value={user.title}
         onChange={OnInput}
          placeholder="Enter Your Title" 
         /> */}
        <br />
        <br />
        <label htmlFor="">
          <b>Description:</b>
        </label>

        {/* <textarea
          className="text1"
          type="text"
          name="discription"
          value={user.discription}
          onChange={OnInput}
          placeholder="Enter Your Description"
        /> */}

          {/* <CKEditor
          editor={ClassicEditor}
          className="text1"
          type="text"
          name="discription"
          value={parse(user.discription)}
          onChange={(event, editor) => {
            const data = editor.getData()
            setUser(data)
          }
          }
        /> */}

        <ReactQuill 
        modules={UpdateBlog2.modules}
        formats={UpdateBlog2.formats}
        name="discription"
        value={user.discription}
        // onChange={OnInput}
        onChange={discription => OnInput({ target: { value: discription, name: 'discription' } })}


        />

        <br />
        <br />
        <button className="btt" type="submit" onClick={sub}>
          Publish
        </button>
        <button className="btt1">Cancel all</button>
      </div>
    </div>
  );
}

UpdateBlog2.modules = {
  toolbar:[
    [{header:"1"},{header:"2"},{header:[3,4,5,6]},{font:[]}],
    [{size:[]}],
    ["bold","italic","underline","strike","blockquote"],
    [{list:"ordered"},{list:"bullet"}],
    ["link","image"],
    ["clean"],
    ["code-block"]
  ]
};
UpdateBlog2.formats=[
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "code-block"
]

export default UpdateBlog2;
