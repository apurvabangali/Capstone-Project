import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { abd } from "../url";
import { Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import parse from "html-react-parser"
import ReactQuill from "react-quill";
import "../../node_modules/react-quill/dist/quill.snow.css"


function Createblog2() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [disc, setDisc] = useState("");
  const [cat, setCat] = useState("");
  // const [text, setText] = useState("")

  const [open, setOpen] = React.useState(false);

  const handleToClose = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpen(false);
  };

  const handleBody=(e)=>{
    setDisc(e)
  }

  const id = localStorage.getItem("id");
  // console.log(id)

  const abc = async (e) => {
    console.log(title, file, disc);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file);
    formData.append("discription", disc);
    formData.append("category", cat);

    const data = await axios
      .post(`${abd}/blog/insert/${id}`, formData)
      .then((res) => {
        console.log(res);
        // alert("Your Blog is Inserted Successfully");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });

  };


  return (
    <div className="bcontainer">
      <Snackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        open={open}
        autoHideDuration={5000}
        message="Please Fill All Field Properly"
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
      <div className="bmain">
        <label htmlFor="" className="space">
          <b>Title:</b>
        </label>
        <input
          className="text1"
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Your Title"
          required="true"
        />
        <br />

        <label htmlFor="" className="space">
          <b>Cover Image:</b>
        </label>
        <input
          className="text1"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          placeholder="Enter your Image"
          required="true"
        />
        <br />

        <label htmlFor="" className="space">
          <b>
            Category:
            <br />
            <select
              className="text1"
              type="option"
              onChange={(e) => setCat(e.target.value)}
              required="true"
            >
              <option value="other">Select Category</option>
              <option value="sport">Sport</option>
              <option value="news">News</option>
              <option value="coding">Coding</option>
              <option value="other">Other</option>
            </select>
          </b>
        </label>
        <br />
        <label htmlFor="" className="space">
          <b>Description:</b>
        </label>

        {/* 
        <textarea
          className="text1"
          type="text"
          rows={6}
          onChange={(e) => setDisc(e.target.value)}
          placeholder="Enter Your Description"
          required="true"
        /> */}

        {/* <CKEditor
          editor={ClassicEditor}
          data={disc}
          onChange={(event, editor) => {
            const data = editor.getData()
            setDisc(data)
          }
          }
        /> */}

        <ReactQuill 
        placeholder="Write Something"
        modules={Createblog2.modules}
        formats={Createblog2.formats}
        onChange={handleBody}
        value={disc}
        />


        <br />
        <br />
        <button className="btt" type="submit" onClick={abc}>
          Publish
        </button>
        <button
          className="btt1"
          onClick={() => {
            navigate("/");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}


Createblog2.modules = {
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
Createblog2.formats=[
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

export default Createblog2;
