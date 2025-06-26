import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [authInfo, setAuthInfo] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setAuthInfo(parsed);
      fetchUserProfile(parsed.userID);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserProfile(docSnap.data());
      setForm(docSnap.data());
    } else {
      const initialData = {
        name: authInfo?.name || "",
        emailId: authInfo?.emailId || "",
        profilePhoto: authInfo?.profilePhoto || "",
        userId: authInfo?.userID,
        college: "",
        year: "",
        linkedin: "",
      };
      setUserProfile(initialData);
      setForm(initialData);
    }
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "users", authInfo.userID), {
        ...form,
        userId: authInfo.userID,
      });
      setUserProfile(form);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile!");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("auth");
      navigate("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen mt-12">
      {/* Sidebar for Desktop */}
      <aside className="w-52 p-6 border-r border-[#e0dbcf] hidden md:flex">
        <div className="flex flex-col gap-4 w-full">
          <Link to="/post">
            <button className="flex items-center gap-2 text-[#1c180d] px-4 py-2 rounded-lg font-semibold transition hover:bg-[#f4f0e6] cursor-pointer w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
              </svg>
              <span>Post</span>
            </button>
          </Link>

          <Link to="/all-post">
            <button className="flex items-center gap-2 text-[#1c180d] px-4 py-2 rounded-lg font-semibold transition hover:bg-[#f4f0e6] cursor-pointer w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.92,15.92,0,0,0,168,219.31L219.31,168A15.92,15.92,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM96,88h64a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Zm32,80H96a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16ZM96,136a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm64,68.69V160h44.7Z" />
              </svg>
              <span>My Posts</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Mobile Buttons */}
        <div className="flex gap-4 mb-6 md:hidden">
          <Link to="/post" className="flex-1">
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold">
              Post
            </button>
          </Link>
          <Link to="/all-post" className="flex-1">
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold">
              My Posts
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#1c180d] tracking-light text-[28px] font-bold leading-tight min-w-72">
            {form.role || "Student"} at {form.college || "Your College"}
          </p>
        </div>

        <div className="flex p-4">
          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="flex gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                style={{
                  backgroundImage: `url(${authInfo?.profilePhoto || ""})`,
                }}
              ></div>
              <div className="flex flex-col justify-center">
                <p className="text-[#1c180d] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  {authInfo?.name || "Your Name"}
                </p>
                <p className="text-[#9e8747] text-base font-normal leading-normal">
                  {form.year ? `${form.year} Year` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-[#1c180d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Profile Details
        </h2>

        <div className="p-4 grid grid-cols-[30%_1fr] sm:grid-cols-[20%_1fr] gap-x-6">
          {["College", "Year", "Email", "LinkedIn"].map((label, i) => (
            <div
              key={i}
              className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e9e2ce] py-5"
            >
              <p className="text-[#9e8747] text-sm font-normal leading-normal">
                {label}
              </p>
              <p className="text-[#1c180d] text-sm font-normal leading-normal">
                {label === "Email"
                  ? authInfo?.emailId || "Not Provided"
                  : form[label.toLowerCase()] || "Not Provided"}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </main>

      {/* Modal */}
      {isEditing && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm p-4">
    <div className="bg-[#fcfbf8] rounded-lg shadow-lg w-full max-w-md sm:max-w-sm p-5 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-center mb-4 text-yellow-400">
        Edit Profile
      </h3>
      <div className="flex flex-col gap-3">
        <input
          name="college"
          value={form.college}
          onChange={handleChange}
          placeholder="College"
          className="border p-2 rounded w-full"
        />
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
          className="border p-2 rounded w-full"
        />
        <input
          name="linkedin"
          value={form.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="border p-2 rounded w-full"
        />
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="bg-[#ebeae3d6] hover:bg-gray-50 text-black px-4 py-2 rounded cursor-pointer w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Profile;
