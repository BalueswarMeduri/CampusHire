import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase"; // Adjust the path if needed

const Hero = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("auth");

  const handleProtectedClick = (route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      setShowModal(true);
    }
  };

  const signWithGoogle = async () => {
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
      setShowModal(false);
      window.location.reload();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-20 py-10 flex justify-center mt-24 sm:mt-32">
      <div className="flex flex-col-reverse lg:flex-row gap-10 max-w-[1200px] w-full">
        {/* ✅ Image Section */}
        <div
          className="w-full sm:min-w-[400px] aspect-video bg-center bg-no-repeat bg-cover rounded-lg min-h-[240px]"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXDSrVioR_TH_PpYg3WpL2RRrgVjZ5aapJFEa_AIvYCa_2tjEhERCZ0TDVoVXgq9VS---zgWBu2vepnBY16owNRn_4vqPJBndmzKEur_BjzAKqp87ONO_VO-T6d-JSuYI3TfYMKmBUTYedz8oe9b1aP_kanyENJ5CWfm-GXdx_zqKzZQ1Ucaj-1stgH7DcdNtzN_c5pf0WWLXYz0n7tfZE-o04l_5nYu2enGJdKS3O0le5TSMKLbnxTLzdt6J3prz2YjkER2XDddZn")',
          }}
        ></div>

        {/* ✅ Text & Actions Section */}
        <div className="flex flex-col gap-6 sm:gap-8 text-center sm:text-left max-w-[600px] w-full">
          <div className="flex flex-col gap-3">
            <h1 className="text-[#1c180d] text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.03em]">
              Unlock Your Career Potential with Real Interview Insights
            </h1>
            <h2 className="text-[#1c180d] text-sm sm:text-base font-normal leading-relaxed">
              Gain a competitive edge with authentic interview experiences
              shared by students from your college. Search by company, role, or
              college to find the insights you need to succeed.
            </h2>
          </div>

          {/* ✅ Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleProtectedClick("/explore")}
              className="w-full sm:w-auto flex items-center justify-center rounded-lg h-11 px-5 bg-[#fac638] text-[var(--text-light)] text-base font-bold tracking-[0.015em] shadow-md hover:bg-yellow-400 transition transform hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              Explore Experiences
            </button>
            <button
              onClick={() => handleProtectedClick("/post")}
              className="w-full sm:w-auto flex items-center justify-center rounded-lg h-11 px-7 bg-yellow-50 text-black text-base font-bold tracking-[0.015em] hover:bg-yellow-100 transition transform hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              Share Your Story
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-sm shadow-lg text-center space-y-4">
            <h2 className="text-xl font-semibold text-[#1c180d]">
              Please Log In
            </h2>
            <p className="text-sm text-[#1c180d]">
              You need to be logged in to access this feature.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                className="bg-[#ecebe7bb] text-black px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#fac638] text-[#1c180d] px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 cursor-pointer"
                onClick={signWithGoogle}
              >
                Login with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
