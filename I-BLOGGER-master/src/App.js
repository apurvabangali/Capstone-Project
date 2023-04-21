import './App.css';
import { Routes,Route } from 'react-router-dom';

import Home from './Home';
import Blog from '../src/blog/Blog';
import Blogdetails from '../src/blogdetails/Blogdetails';
import About from '../src/about/About';
import Contact from '../src/contact/Contact';
import Admin from '../src/admin/Admin';
import Createblog from '../src/createblog/Createblog';
import Login from '../src/login/Login';
import Register from './Register/Register';
import Forgetpassword from './forgetpassword/Forgetpassword';
import Changepassword from './changepassword/Changepassword';
import Profile from './profile/Profile';
import Userblog from './userblog/Userblog';
import UpdateProfile from './updateProfile/UpdateProfile';
import UpdateBlog from './updateblog/UpdateBlog';
import UpdatePhoto from './updatephoto/UpdatePhoto';
import Sportblog from './sportblog/Sportblog';
import Newsblog from './newsblog/Newsblog';
import Codingblog from './codingblog/Codingblog';
import Otherblog from './other blog/Otherblog';
import Livechat from './livechat/Livechat';

function App() {
  return (
    <>
   <Routes>
   <Route exact path='/' element= {<Home/>}/>
   <Route exact path='/blog' element= {<Blog/>}/>
   <Route exact path='/blogdetails/:id' element= {<Blogdetails/>}/>
   <Route exact path='/about' element= {<About/>}/>
   <Route exact path='/contact' element= {<Contact/>}/>
   <Route exact path='/admin' element= {<Admin/>}/>
   <Route exact path='/createblog' element= {<Createblog/>}/>
   <Route exact path='/login' element= {<Login/>}/>
   <Route exact path='/register' element= {<Register/>}/>
   <Route exact path='/forget' element= {<Forgetpassword/>}/>
   <Route exact path='/change' element= {<Changepassword/>}/>
   <Route exact path='/profile' element= {<Profile/>}/>
   <Route exact path='/userblog' element= {<Userblog/>}/>
   <Route exact path='/updateprofile' element= {<UpdateProfile/>}/>
   <Route exact path='/updateblog/:id' element= {<UpdateBlog/>}/>
   <Route exact path='/updatephoto' element= {<UpdatePhoto/>}/>
   <Route exact path='/sportblog' element= {<Sportblog/>}/>
   <Route exact path='/newsblog' element= {<Newsblog/>}/>
   <Route exact path='/codingblog' element= {<Codingblog/>}/>
   <Route exact path='/otherblog' element= {<Otherblog/>}/>
   <Route exact path='/livechat' element= {<Livechat/>}/>





  </Routes>

  
  </>
   
  );
}

export default App;
