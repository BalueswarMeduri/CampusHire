import React from 'react';

const Herofive = () => {
  return (
    <div className="max-w-[950px] mx-auto mt-10">
      <div
        className="flex flex-col lg:flex-row items-center justify-between gap-6 rounded-xl p-6"
        data-aos="fade-up"
      >
        {/* Text and Button */}
        <div className="flex flex-col items-center text-center gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <p className="text-[#1c180d] text-lg sm:text-4xl font-bold leading-tight">
              Join Golden Opportunities
            </p>
            <p className="text-[#9e8747] text-sm sm:text-2xl font-normal leading-normal max-w-3xl">
              Join a vibrant community where innovation meets collaboration.
              Whether you're learning, coding, or creating — this is the place to grow.
            </p>
          </div>
          <a
          href='https://www.whatsapp.com/channel/0029VayCXrsDTkK9M5LRc91E'
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-10 px-6 rounded-full bg-[#fac638] hover:bg-yellow-400 transition transform hover:scale-105 hover:shadow-lg  cursor-pointer text-[#1c180d] text-sm font-medium w-fit"
          >
            <span className="truncate">Join Now</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Herofive;
