import React from 'react'
import '../Style.css';
import '../bootstrap.min.css'
import '../font-awesome.css'
import { makeStyles } from '@material-ui/core';

const useStyles=makeStyles({
    main:{
        marginTop:70
    }
})


function Admin1() {
    const classes=useStyles();
  return (
      <>
   
   <div className={classes.main} id="founder">
    <section className="section section-bg" id="call-to-action" style={{backgroundImage : "url('./image/banner-image-1-1920x500.jpg')"}}>

        <div className="container">
            <div className="row">
                <div className="col-lg-10 offset-lg-1">
                    <div className="cta-content">
                        <br/>
                        <br/>
                        <h2>Meet our <em>FOUNDER</em></h2>
                        <p>A directory of wonderful things…
</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
    </>
  )
}

export default Admin1