import React from 'react'
import Navbar from './Navbar';
import Habout from './Habout';
import Hblog from './Hblog';
import MainBanner from './MainBanner';
import Footer from './Footer';


function Home() {
  return (
      <>
    <Navbar/>
    <MainBanner/>
    <Hblog/>
    <Habout/>
    <Footer/>
    </>
  )
}

export default Home