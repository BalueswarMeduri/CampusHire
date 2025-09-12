import { signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = ({ active, setActive }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authInfo, setAuthInfo] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // Fetch authInfo from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuthInfo(JSON.parse(storedAuth));
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/explore")) {
      setActive("explore");
    } else if (location.pathname.startsWith("/about")) {
      setActive("about");
    } else if(location.pathname.startsWith("/resources")){
      setActive("resources");
    } else if (location.pathname.startsWith("/practice")){
    }else {
      setActive("home");
    }
  }, [location.pathname]);

  const getLinkClass = (name) =>
    `text-sm font-medium leading-normal ${
      active === name ? "text-[#fac638]" : "text-[#1c180d]"
    }`;

  const signWithgoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        userID: result.user.uid,
        name: result.user.displayName,
        profilePhoto: result.user.photoURL,
        emailId: result.user.email,
        isAuth: true,
      };
      localStorage.setItem("auth", JSON.stringify(userData));
      setAuthInfo(userData);
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput(""); // Optional: Clear search box
    }
  };

  const showToast = (message) => {
    toast.error(message);
  };

  const handleProtectedNavigation = (path, linkName) => {
    if (!authInfo?.isAuth) {
      showToast("Please login to access this page");
      return;
    }
    navigate(path);
    setActive(linkName);
    setMenuOpen(false);
  };

  

  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      <header className="border-b border-solid border-b-[#f4f0e6] px-4 md:px-10 py-3 bg-[#fafafafc]">
        <div className="flex items-center justify-between">
          {/* Logo & Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#1c180d]">
              <div className="size-4">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <NavLink to="/">
                <h2 className="text-[#1c180d] text-lg font-bold leading-tight tracking-[-0.015em]">
                  CampusHire
                </h2>
              </NavLink>
            </div>
            <div className="hidden md:flex items-center gap-9">
              <NavLink to="/" className={getLinkClass("home")}>
                Home
              </NavLink>
              <button
                onClick={() => handleProtectedNavigation("/explore", "explore")}
                className={getLinkClass("explore") + " cursor-pointer"}
              >
                Explore
              </button>
              {/*<button
                onClick={() => handleProtectedNavigation("/practice", "practice")}
                className={getLinkClass("practice") + " cursor-pointer"}
              >
                Practice
              </button>*/}
              <button
                onClick={() => handleProtectedNavigation("/resources", "resources")}
                className={getLinkClass("resources") + " cursor-pointer"}
              >
                Resources
              </button>
              <NavLink to="/about" className={getLinkClass("about")}>
                About
              </NavLink>
            </div>
          </div>

          {/* Desktop Search & Button */}
          <div className="hidden md:flex items-center gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full items-stretch rounded-lg h-full">
                <div className="text-[#9e8747] flex border-none bg-[#f4f0e6a5] items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                  </svg>
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1c180d] focus:outline-0 focus:ring-0 border-none bg-[#f4f0e6] focus:border-none h-full placeholder:text-[#9e8747] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKey}
                />
              </div>
            </label>

            {!authInfo?.isAuth ? (
              <button
                onClick={signWithgoogle}
                className="min-w-[84px] h-10 px-4 bg-[#fac638] text-[#1c180d] text-sm font-bold rounded-lg cursor-pointer"
              >
                <span className="truncate">Sign Up</span>
              </button>
            ) : (
              <NavLink to="/profile">
                <img
                  src={authInfo.profilePhoto}
                  alt={authInfo.name}
                  className="w-11 h-11 rounded-full object-cover cursor-pointer border-2 border-amber-400"
                />
              </NavLink>
            )}
          </div>

          {/* Hamburger Icon - Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#1c180d] focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4">
            <NavLink
              to="/"
              onClick={() => {
                setActive("home");
                setMenuOpen(false);
              }}
              className={getLinkClass("home")}
            >
              Home
            </NavLink>
            <button
              onClick={() => handleProtectedNavigation("/explore", "explore")}
              className={getLinkClass("explore") + " text-left cursor-pointer"}
            >
              Explore
            </button>
            <button
              onClick={() => handleProtectedNavigation("/resources", "resources")}
              className={getLinkClass("resources") + " text-left cursor-pointer"}
            >
              Resources
            </button>
            <NavLink
              to="/about"
              onClick={() => {
                setActive("about");
                setMenuOpen(false);
              }}
              className={getLinkClass("about")}
            >
              About
            </NavLink>

            <label className="flex flex-col !h-10 max-w-full">
              <div className="flex w-full items-stretch rounded-lg h-full">
                <div className="text-[#9e8747] flex border-none bg-[#f4f0e6] items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                  </svg>
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1c180d] focus:outline-0 focus:ring-0 border-none bg-[#f4f0e6] focus:border-none h-full placeholder:text-[#9e8747] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  defaultValue=""
                />
              </div>
            </label>

            {!authInfo?.isAuth ? (
              <button
                onClick={() => {
                  signWithgoogle();
                  setMenuOpen(false);
                }}
                className="min-w-[84px] h-10 px-4 bg-[#fac638] text-[#1c180d] text-sm font-bold rounded-lg cursor-pointer"
              >
                <span className="truncate">Sign Up</span>
              </button>
            ) : (
              <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                <img
                  src={authInfo.profilePhoto}
                  alt={authInfo.name}
                  className=" cursor-pointer w-10 h-10 rounded-full object-cover"
                />
              </NavLink>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;