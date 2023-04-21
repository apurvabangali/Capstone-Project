import React from 'react'
import Blog1 from '../blog/Blog1'
import Navbar from '../Navbar'
import Blog2 from '../blog/Blog2'
import Footer from '../Footer'


function Blog() {
  return (<>
  <Navbar/>
    <Blog1/>
    <Blog2/>
    <Footer/>
    </>
  )
}

export default Blog