import React from "react";

const Herothree = () => {
  return (
    <div className="max-w-[1010px] mx-auto px-4 mt-28">
      <h2 className="text-[#1c180d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Interview Preparation
      </h2>

      {/* Responsive Layout: vertical on mobile, horizontal scroll on larger screens */}
      <div className="flex flex-col sm:flex-row sm:overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col sm:flex-row items-stretch p-4 gap-4 w-full">
          {/* Card 1 */}
          <div className="flex flex-col gap-4 rounded-lg sm:min-w-[280px] w-full">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{
                backgroundImage:
                  'url("https://img.freepik.com/premium-vector/business-colleagues-engage-productive-conversation-cups-business-concept-illustration-xa_341149-561.jpg?ga=GA1.1.249675554.1750828418&semt=ais_items_boosted&w=740")',
              }}
            ></div>
            <div>
              <p className="text-[#1c180d] text-base font-medium leading-normal">
                Ace Your Behavioral Interviews
              </p>
              <p className="text-[#9e8747] text-sm font-normal leading-normal">
                Learn how to effectively answer common behavioral interview questions and showcase your soft skills.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-4 rounded-lg sm:min-w-[280px] w-full">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{
                backgroundImage:
                  'url("https://img.freepik.com/premium-vector/new-worker-interview-concept-illustration_203587-9.jpg?ga=GA1.1.249675554.1750828418&w=740")',
              }}
            ></div>
            <div>
              <p className="text-[#1c180d] text-base font-medium leading-normal">
                Master Technical Interview Questions
              </p>
              <p className="text-[#9e8747] text-sm font-normal leading-normal">
                Practice coding challenges and system design questions to excel in technical interviews.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-4 rounded-lg sm:min-w-[280px] w-full">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{
                backgroundImage:
                  'url("https://img.freepik.com/premium-vector/picture-man-woman-front-chart-that-says-word_1187092-70340.jpg?ga=GA1.1.249675554.1750828418&w=740")',
              }}
            ></div>
            <div>
              <p className="text-[#1c180d] text-base font-medium leading-normal">
                Crack Case Studies with Confidence
              </p>
              <p className="text-[#9e8747] text-sm font-normal leading-normal">
                Develop your problem-solving abilities and analytical skills to tackle case studies successfully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Herothree;
