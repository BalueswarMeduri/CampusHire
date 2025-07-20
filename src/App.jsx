import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Explore from "./pages/Explore/Explore";
import About from "./pages/About/About";
import Post from "./pages/Post/Post";
import Profile from "./pages/Profile/Profile";
import Allpost from "./pages/Allpost/Allpost";
import Navbar from "./components/Navbar/Navbar";
import Detail from "./pages/Detail/Detail";
import EditPost from "./pages/EditPost/EditPost";
import Footer from "./components/Footer/Footer";
import Resourse from "./pages/Resourse/Resourse";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Practice from "./pages/Practice/Practice";

const App = () => {
  const [active, setActive] = useState("home");

  return (
    <div className="bg-[#fcfbf8]">
      <BrowserRouter>
        <Navbar setActive={setActive} active={active} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/detail/:id"
            element={
              <ProtectedRoute>
                <Detail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resourse />
              </ProtectedRoute>
            }
          />

          <Route path="/all-post" element={<Allpost />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </div>
  );
};

export default App;
