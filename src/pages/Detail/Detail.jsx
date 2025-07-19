import { useParams } from "react-router-dom";
import { doc, getDoc, collection, onSnapshot, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const Detail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInfo, setAuthInfo] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [loadingLikes, setLoadingLikes] = useState(new Set());

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuthInfo(JSON.parse(storedAuth));
    }
  }, []);

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

  useEffect(() => {
    if (authInfo?.userID) {
      fetchUserLikes();
    }
    fetchLikeCounts();
  }, [authInfo]);

  const fetchUserLikes = async () => {
    try {
      const q = query(
        collection(db, "likes"),
        where("userId", "==", authInfo.userID)
      );
      const querySnapshot = await getDocs(q);
      const userLikes = new Set();
      querySnapshot.forEach((doc) => {
        userLikes.add(doc.data().postId);
      });
      setLikedPosts(userLikes);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchLikeCounts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "likes"));
      const counts = {};
      querySnapshot.forEach((doc) => {
        const postId = doc.data().postId;
        counts[postId] = (counts[postId] || 0) + 1;
      });
      setLikeCounts(counts);
    } catch (error) {
      console.error("Error fetching like counts:", error);
    }
  };

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    
    if (!authInfo?.userID) {
      return;
    }

    // Add loading state for this specific post
    setLoadingLikes(prev => new Set([...prev, postId]));

    try {
      const isLiked = likedPosts.has(postId);
      
      if (isLiked) {
        // Optimistically update UI
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setLikeCounts(prev => ({
          ...prev,
          [postId]: Math.max((prev[postId] || 1) - 1, 0)
        }));

        // Remove like from database
        const q = query(
          collection(db, "likes"),
          where("userId", "==", authInfo.userID),
          where("postId", "==", postId)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        // Optimistically update UI
        setLikedPosts(prev => new Set([...prev, postId]));
        setLikeCounts(prev => ({
          ...prev,
          [postId]: (prev[postId] || 0) + 1
        }));

        // Add like to database
        await addDoc(collection(db, "likes"), {
          userId: authInfo.userID,
          postId: postId,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error("Error handling like:", error);
      // Revert optimistic updates on error
      if (likedPosts.has(postId)) {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setLikeCounts(prev => ({
          ...prev,
          [postId]: Math.max((prev[postId] || 1) - 1, 0)
        }));
      } else {
        setLikedPosts(prev => new Set([...prev, postId]));
        setLikeCounts(prev => ({
          ...prev,
          [postId]: (prev[postId] || 0) + 1
        }));
      }
    } finally {
      // Remove loading state
      setLoadingLikes(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleShare = async (postId, e) => {
    e.stopPropagation();
    
    try {
      const currentUrl = window.location.origin;
      const shareUrl = `${currentUrl}/detail/${postId}`;
      
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy link", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

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
            
            {/* Like and Share buttons - Desktop: grouped together, Mobile: spread apart */}
            <div className="flex pt-5 justify-between sm:justify-center sm:gap-4 w-full sm:w-auto">
              {/* Like Button */}
              <div className="flex items-center">
                <button
                  onClick={(e) => handleLike(id, e)}
                  disabled={loadingLikes.has(id)}
                  className={`p-2 rounded-full cursor-pointer transition-all duration-200 transform active:scale-95 hover:scale-105 ${
                    likedPosts.has(id) ? 'bg-[#fac638]/10' : 'hover:bg-gray-100'
                  } ${loadingLikes.has(id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={likedPosts.has(id) ? "#fac638" : "none"}
                    stroke={likedPosts.has(id) ? "#fac638" : "#9e8747"}
                    strokeWidth="2"
                    className={`transition-all duration-200 ${
                      loadingLikes.has(id) ? 'animate-pulse' : ''
                    } ${likedPosts.has(id) ? 'drop-shadow-sm' : ''}`}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                {likeCounts[id] > 0 && (
                  <span className={`text-xs font-medium transition-all duration-200 ${
                    likedPosts.has(id) ? 'text-[#fac638]' : 'text-[#9e8747]'
                  }`}>
                    {likeCounts[id]}
                  </span>
                )}
              </div>
               
              {/* Share Button */}
              <button
                onClick={(e) => handleShare(id, e)}
                className="p-2 rounded-full cursor-pointer transition-all duration-200 transform active:scale-95 hover:scale-105 hover:bg-gray-100"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9e8747"
                  strokeWidth="2"
                  className="transition-all duration-200"
                >
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
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