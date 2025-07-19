import React, { useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
   useEffect(() => {
            AOS.init({
              duration: 1000,
              once: true,
            });
          }, []);
  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] mx-auto mt-20">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#1c180d] tracking-light text-[32px] font-bold leading-tight min-w-72">
            About CampusHire
          </p>
        </div>
        <p className="text-[#1c180d] text-base font-normal leading-normal pb-3 pt-1 px-4">
          CampusHire is a platform dedicated to helping students prepare for their future careers by providing a space to share and learn from real interview experiences.
          Our mission is to empower students with the knowledge and confidence they need to succeed in their job search.
        </p>
        <h2 className="text-[#1c180d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Our Features
        </h2>

        {/* Feature 1 */}
        <div className="flex items-center gap-4 bg-[#fcfbf8] px-4 min-h-[72px] py-2" data-aos="fade-up">
          <div className="text-[#1c180d] flex items-center justify-center rounded-lg bg-[#f4f0e6] shrink-0 w-12 h-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Z..." />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#1c180d] text-base font-medium leading-normal">Interview Experience Database</p>
            <p className="text-[#9e8747] text-sm font-normal leading-normal">
              Access a vast collection of interview experiences shared by students from various universities and companies.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center gap-4 bg-[#fcfbf8] px-4 min-h-[72px] py-2" data-aos="fade-up">
          <div className="text-[#1c180d] flex items-center justify-center rounded-lg bg-[#f4f0e6] shrink-0 w-12 h-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07..." />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#1c180d] text-base font-medium leading-normal">Advanced Search</p>
            <p className="text-[#9e8747] text-sm font-normal leading-normal">
              Search for experiences based on company, role, and difficulty level to find the most relevant information.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center gap-4 bg-[#fcfbf8] px-4 min-h-[72px] py-2" data-aos="fade-up">
          <div className="text-[#1c180d] flex items-center justify-center rounded-lg bg-[#f4f0e6] shrink-0 w-12 h-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76..." />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#1c180d] text-base font-medium leading-normal">Filtering Options</p>
            <p className="text-[#9e8747] text-sm font-normal leading-normal">
              Filter experiences by company, role, and difficulty level to find the most relevant information.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 px-4 max-w-[940px] mx-auto" data-aos="fade-down">
          <h2 className="text-[#1c180d] text-[24px] font-bold leading-tight mb-3">Golden Opportunities</h2>
          <p className="text-[#1c180d] text-base font-normal leading-normal mb-4">
            Golden Opportunities is your go-to resource hub for all things interview preparation and career readiness. Whether you're brushing up on coding skills or fine-tuning your resume, we've got you covered.
          </p>

          <ul className="list-disc pl-5 text-[#1c180d] mb-6 space-y-1">
            <li>DSA & Development Resources</li>
            <li>Projects with Source Code</li>
            <li>Aptitude Practice Questions</li>
            <li>HR Interview Prep</li>
            <li>Previous Year Question Papers</li>
            <li>CS Fundamentals</li>
            <li>Resume Templates with Tips</li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.whatsapp.com/channel/0029VayCXrsDTkK9M5LRc91E"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#fac638] text-[#1c180d] px-6 py-2 rounded-full font-bold text-sm text-center"
            >
              Follow on WhatsApp
            </a>
          </div>
        </div>
    </div>
  );
};

export default About;
