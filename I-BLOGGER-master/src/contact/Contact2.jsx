import React from 'react'
import { useNavigate } from "react-router-dom";



function Contact2() {
  
    const navigate = useNavigate();

  return (
    <section className="section" id="features">
        <div className="container">
            <div className="row text-center">
                <div className="col-lg-6 offset-lg-3">
                    <div className="section-heading">
                        <h2>Experts <em> info</em></h2>
                        <img src="./image/line-dec.png" alt="waves"/>

                    </div>
                </div>

                <div className="col-md-4">
                    <div className="icon">
                        <i className="fa fa-phone"></i>
                    </div>

                    <h5>+91 9510578562</h5>

                    <br/>
                </div>

                <div className="col-md-4">
                    <div className="icon">
                        <i className="fa fa-envelope"></i>
                    </div>

                    <h5>experts1@gmail.com</h5>

                    <br/>
                </div>

                <div className="col-md-4" style={{cursor:"pointer"}} onClick={()=>{navigate("/livechat")}}>
                    <div className="icon">
                        <i className="fa fa-comments"></i>
                    </div>

                    <h5>Chat With Expert</h5>

                    <br/>
                </div>
                
            </div>
        </div>
        
    </section>
  )
}

export default Contact2