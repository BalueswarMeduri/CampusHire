import React, { useState } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage'
import Explore from './pages/Explore/Explore'
import About from './pages/About/About'
import Post from './pages/Post/Post'
import Profile from './pages/Profile/Profile'
import Allpost from './pages/Allpost/Allpost'
import Navbar from './components/Navbar/Navbar'
import Detail from './pages/Detail/Detail'
import { ToastContainer } from 'react-toastify';
import EditPost from './pages/EditPost/EditPost'
import Footer from './components/Footer/Footer'

const App = () => {
  const [active, setActive] = useState("home")
  return (
    <div className='bg-[#fcfbf8]'>
      <BrowserRouter>
        <Navbar setActive={setActive} active={active}/>
          <Routes>
              <Route path= "/" element = { <Homepage/> }/>
              <Route path= "/explore" element = { <Explore/> }/>
              <Route path= "/about" element = { <About/> }/>
              <Route path= "/post" element = { <Post/> }/>
              <Route path= "/profile" element = { <Profile/> }/>
              <Route path= "/detail/:id" element = { <Detail/> }/>
              <Route path= "/all-post" element = { <Allpost/> }/>
              <Route path="/edit-post/:id" element={<EditPost />} />
          </Routes>
          <Footer/>
          <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </div>
  )
}

export default App