import React from "react";

const Herofour = () => {
  return (
    <div className="max-w-[980px] mx-auto px-4 mt-28">
      <h2 className="text-[#1c180d] text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center sm:text-left">
        Want to Prepare for the Interview?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M69.12,94.15L28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Z" />
              </svg>
            ),
            label: "DSA & Development Resources",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M176,88a40,40,0,1,0,0,80h.05a48.37,48.37,0,0,0,23.95-6.21V208H56V48H200v29.23A56.3,56.3,0,0,0,176,88Z" />
              </svg>
            ),
            label: "Projects with Source Code",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,56H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16Zm0,56H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16Z" />
              </svg>
            ),
            label: "Aptitude Practice Questions",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92Z" />
              </svg>
            ),
            label: "HR Interview Prep",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160Z" />
              </svg>
            ),
            label: "Previous Year Question Papers",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Z" />
              </svg>
            ),
            label: "CS Fundamentals",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M80,224a8,8,0,0,1-8,8H56a16,16,0,0,1-16-16V184a8,8,0,0,1,16,0v32H72A8,8,0,0,1,80,224ZM216,88v48a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H120a8,8,0,0,1,0-16h32a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88Z" />
              </svg>
            ),
            label: "Resume Templates with Tips",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-1 items-center gap-3 rounded-lg border border-[#e9e2ce] bg-[#fcfbf8] p-3 sm:p-4"
          >
            <div className="text-[#1c180d]">{item.icon}</div>
            <h2 className="text-[#1c180d] text-sm sm:text-base font-semibold leading-tight">
              {item.label}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4 py-6">
        <a
          href="https://golden-opportunities.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full sm:w-auto justify-center items-center rounded-full h-10 px-4 bg-[#fac638] text-[#1c180d] text-sm font-bold leading-normal tracking-[0.015em] text-center"
        >
          <span className="truncate">Visit golden-opportunities.vercel.app</span>
        </a>

        <a
          href="https://www.whatsapp.com/channel/0029VayCXrsDTkK9M5LRc91E"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full sm:w-auto justify-center items-center rounded-full h-10 px-4 bg-[#fac638] text-[#1c180d] text-sm font-bold leading-normal tracking-[0.015em] text-center"
        >
          <span className="truncate">Join our WhatsApp channel</span>
        </a>
      </div>
    </div>
  );
};

export default Herofour;
