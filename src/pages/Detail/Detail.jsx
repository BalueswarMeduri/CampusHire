import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { assets } from "../../assets/assets";

const Detail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPost(snap.data());
      }
      setLoading(false);
    };
    getPost();
  }, [id]);

  if (loading) {
    return (
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mt-20 animate-pulse">
          <div className="bg-[#ecebe7] h-5 w-28 rounded mb-4"></div>
          <div className="bg-[#ecebe7] h-8 w-[60%] rounded mb-6"></div>

          <div className="flex gap-4 mb-6">
            <div className="w-40 h-40 bg-[#ddd] rounded-full"></div>
            <div className="flex flex-col justify-center gap-2">
              <div className="h-5 w-40 bg-[#e4e1d8] rounded"></div>
              <div className="h-4 w-28 bg-[#ecebe7] rounded"></div>
            </div>
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6">
              <div className="bg-[#ecebe7] h-6 w-40 rounded mb-2"></div>
              <div className="bg-[#f2f1ee] h-4 w-full rounded mb-1"></div>
              <div className="bg-[#f2f1ee] h-4 w-[85%] rounded mb-1"></div>
              <div className="bg-[#f2f1ee] h-4 w-[70%] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!post) return <p className="p-4 text-[#1c180d]">No data found.</p>;

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mt-20">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 p-4">
          <a href="/explore" className="text-[#9e8747] text-base font-medium leading-normal">
            Explore
          </a>
          <span className="text-[#9e8747] text-base font-medium leading-normal">/</span>
          <span className="text-[#1c180d] text-base font-medium leading-normal">
            Interview Experience
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#1c180d] tracking-light text-[32px] font-bold leading-tight min-w-72">
            {post.roal} at {post.company}
          </p>
        </div>

        {/* Profile */}
        <div className="flex p-4">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex gap-4">
              <img
                src={assets[post.company] || "/logos/default.png"}
                alt={post.company}
                className="w-40 h-40 object-contain rounded-full bg-white border-2 border-amber-400"
              />
              <div className="flex flex-col justify-center">
                <p className="text-[#1c180d] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  {post.author || "Anonymous"}
                </p>
                <p className="text-[#9e8747] text-base font-normal leading-normal">
                  {post.collage}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Details */}
        <h2 className="text-[#1c180d] text-[22px] font-bold px-4 pb-3 pt-5">
          Interview Details
        </h2>
        <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
          {[
            ["Company", post.company],
            ["Role", post.roal],
            ["Date", post.Date],
            ["Difficulty", post.difficulty],
            ["Rounds", post.rounds],
            ["Type", post.type],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="col-span-2 grid grid-cols-subgrid border-t border-[#e9e2ce] py-5"
            >
              <p className="text-[#9e8747] text-sm font-normal">{label}</p>
              <p className="text-[#1c180d] text-sm font-normal">{value}</p>
            </div>
          ))}
        </div>

        {/* Experience Summary */}
        <h2 className="text-[#1c180d] text-[22px] font-bold px-4 pb-3 pt-5">
          Experience Summary
        </h2>
        <p className="text-[#1c180d] text-base font-normal px-4 pb-3 whitespace-pre-line">
          {post.experience}
        </p>

        {/* Interview Rounds */}
        {post.roundsData && post.roundsData.length > 0 && (
          <>
            <h2 className="text-[#1c180d] text-[22px] font-bold px-4 pb-3 pt-5">
              Interview Rounds
            </h2>
            <div className="flex flex-col gap-4 px-4">
              {post.roundsData.map((round, index) => (
                <div
                  key={index}
                  className="bg-[#fcfbf8] border border-[#f4f0e6] p-4 rounded-md"
                >
                  <p className="text-[#1c180d] font-semibold">Round {index + 1}</p>
                  <p className="text-[#1c180d] text-sm whitespace-pre-line mt-1">
                    {round}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tips */}
        {post.tips && (
          <>
            <h2 className="text-[#1c180d] text-[22px] font-bold px-4 pb-3 pt-5">
              {post.author?.split(" ")[0] || "Their"}'s Tips
            </h2>
            <p className="text-[#1c180d] text-base font-normal px-4 pb-5 whitespace-pre-line">
              {post.tips}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
