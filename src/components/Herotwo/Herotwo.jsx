import React, { useEffect } from 'react';

import AOS from "aos";
import "aos/dist/aos.css";

const Herotwo = () => {
   useEffect(() => {
      AOS.init({
        duration: 1000,
        once: true,
      });
    }, []);
  return (
    <div className="max-w-[2000px] mx-auto px-4 mt-28">
      <h2 className="text-[#1c180d] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
        Why Choose CampusHire?
      </h2>

      <div className="flex flex-col gap-10 py-10">
        {/* Top Heading */}
        <div className="flex flex-col gap-4" data-aos="fade-up">
          <h1 className="text-[#1c180d] text-[32px] font-bold leading-tight tracking-[-0.033em] sm:text-4xl sm:font-black max-w-[720px]">
            Your Success Starts Here
          </h1>
          <p className="text-[#1c180d] text-base font-normal leading-normal max-w-[720px]">
            CampusHire provides a unique platform for students to access and share real interview experiences, empowering them to navigate their career paths with confidence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3" data-aos="fade-up">
          {/* Card 1 */}
          <div className="flex flex-col gap-3 p-4 border border-[#e9e2ce] bg-[#fcfbf8] rounded-lg">
            <div className="text-[#1c180d]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#1c180d] text-base font-bold leading-tight">By Students, For Students</h2>
              <p className="text-[#9e8747] text-sm font-normal leading-normal">
                Our platform is built on the principle of peer-to-peer learning, ensuring that the insights you receive are authentic and relevant to your college experience.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-3 p-4 border border-[#e9e2ce] bg-[#fcfbf8] rounded-lg" data-aos="fade-up">
            <div className="text-[#1c180d]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#1c180d] text-base font-bold leading-tight">Comprehensive Search</h2>
              <p className="text-[#9e8747] text-sm font-normal leading-normal">
                Easily find the interview experiences you need by searching for specific companies, roles, or colleges, saving you time and effort in your preparation.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-3 p-4 border border-[#e9e2ce] bg-[#fcfbf8] rounded-lg" data-aos="fade-up">
            <div className="text-[#1c180d]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#1c180d] text-base font-bold leading-tight">Verified Experiences</h2>
              <p className="text-[#9e8747] text-sm font-normal leading-normal">
                We verify the authenticity of each interview experience to ensure the highest quality of information, giving you the confidence to trust the insights you gain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Herotwo;
