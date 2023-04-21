import React from 'react'
import bgImage from "../src/video/video.mp4";
import { makeStyles } from '@material-ui/styles';
import { useNavigate } from 'react-router-dom';


const useStyles = makeStyles({
    src:{
        marginTop:'20px',
        background:'transperent',
        display:'flex',
        marginLeft:350
    },
    input:{
        height:40,
        borderRadius:5,
        width:'400px'
        
    },
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
        marginTop:'-15px'
    }
})


function MainBanner() {
    const classes = useStyles();
    const navigate=useNavigate();
  return (
    <div class="main-banner" id="home">
        <video autoPlay muted loop id="bg-video">
            <source src={bgImage} type="video/mp4" />
        </video>

        <div class="video-overlay header-text">
            <div class="caption">
                <h6><em style={{color:"#ed563b"}}>Welcome</em> , I Blogger </h6>
                <h2>Blog By <em> I Blogger </em></h2>
                <div class="main-button" onClick={()=>{
                       navigate('/contact')}}>
                    <a href="">Meet Our Experts</a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MainBanner