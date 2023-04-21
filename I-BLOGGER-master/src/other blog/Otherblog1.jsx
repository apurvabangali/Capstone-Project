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

function Otherblog1() {
    const classes=useStyles();
  return (
      <div className={classes.main} id="otcode">
    <section class="section section-bg" id="call-to-action" style={{backgroundImage : "url('./image/banner-image-1-1920x500.jpg')"}}>

    <div class="container">
        <div class="row">
            <div class="col-lg-10 offset-lg-1">
                <div class="cta-content">
                    <br/>
                    <br/>
                    <h2>Read our <em>Other Blog</em></h2>
                    <p>A directory of wonderful things…
</p>
                </div>
            </div>
        </div>
    </div>
</section>
</div>
  )
}

export default Otherblog1