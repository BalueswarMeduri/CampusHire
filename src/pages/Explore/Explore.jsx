import { collection, onSnapshot, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";

const collageOptions = [
  "SRM-AP", "VIT-AP", "VR-Siddharatha", "KLU", "Gitam", "Andhra university",
  "VVIT", "Vigan", "Amrita", "RVRJC", "IIT", "NIT", "IIIT", "others",
];
const companyOptions = [
  "Google", "Microsoft", "Amazon", "Paypal", "TCS","JPMorgan","SAMSUNG", "Cognizant" ,"Infosys", "Wipro", "HCL",
  "Capgemini", "Deloitte", "Adobe", "Flipkart", "Startup",
];
const roleOptions = [
  "Software Developer(SDE) intern", "Front-end", "Back-end", "ML",
  "Data Scientist", "DevOps", "Cloud", "Cybersecurity",
];

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filters, setFilters] = useState({ college: "", company: "", role: "" });
  const [sortBy, setSortBy] = useState(""); // New state for sorting - empty by default
  const [loading, setLoading] = useState(true);
  const [authInfo, setAuthInfo] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [loadingLikes, setLoadingLikes] = useState(new Set());

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || "";

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const maxPages = 100;

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuthInfo(JSON.parse(storedAuth));
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPosts(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);
  

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

  // Function to sort posts based on the selected option
  const sortPosts = (posts) => {
    if (sortBy === "mostLiked") {
      return [...posts].sort((a, b) => {
        const aLikes = likeCounts[a.id] || 0;
        const bLikes = likeCounts[b.id] || 0;
        return bLikes - aLikes;
      });
    } else if (sortBy === "latest") {
      // Sort by latest (assuming posts have a timestamp or date field)
      return [...posts].sort((a, b) => {
        // You might need to adjust this based on your date field structure
        const aDate = new Date(a.Date || a.timestamp || 0);
        const bDate = new Date(b.Date || b.timestamp || 0);
        return bDate - aDate;
      });
    } else {
      // Default - return posts as they are (no sorting)
      return posts;
    }
  };

  // Use useMemo to calculate filtered posts without affecting pagination
  const computedFilteredPosts = useMemo(() => {
    const { college, company, roal } = filters;
    let filtered = [...posts]; // Start with all posts by default

    // Apply filters only if they are selected
    if (college) filtered = filtered.filter((p) => p.collage === college);
    if (company) filtered = filtered.filter((p) => p.company === company);
    if (roal) filtered = filtered.filter((p) => p.roal === roal);

    // Apply search query filter if exists
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.company?.toLowerCase().includes(searchQuery) ||
          p.role?.toLowerCase().includes(searchQuery)
      );
    }

    // Apply sorting to all filtered posts
    return sortPosts(filtered);
  }, [posts, filters, searchQuery, sortBy, likeCounts]);

  // Only reset pagination when filters actually change (not when like counts change)
  useEffect(() => {
    setFilteredPosts(computedFilteredPosts);
    // Only reset to page 1 when filters or search changes, not when like counts change
    setCurrentPage(1);
  }, [posts, filters, searchQuery, sortBy]); // Removed likeCounts from dependencies

  // Update filtered posts when like counts change (for sorting) but don't reset pagination
  useEffect(() => {
    setFilteredPosts(computedFilteredPosts);
  }, [computedFilteredPosts]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const totalPages = Math.min(Math.ceil(filteredPosts.length / postsPerPage), maxPages);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const generatePageNumbers = () => {
    const pages = [];
    const addPage = (p) =>
      pages.push(
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          className={`w-9 h-9 rounded-full font-medium cursor-pointer ${
            currentPage === p
              ? "bg-[#fac638] text-black font-bold"
              : "bg-[#f4f0e6] text-[#1c180d]"
          } hover:bg-[#e3e0d5]`}
        >
          {p}
        </button>
      );

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      if (currentPage > 2) {
        addPage(1);
        if (currentPage > 3) pages.push(<span key="dots1">...</span>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) addPage(i);

      if (currentPage < totalPages - 2) pages.push(<span key="dots2">...</span>);
      if (currentPage < totalPages - 1) addPage(totalPages);
    }

    return pages;
  };

   useEffect(() => {
            AOS.init({
              duration: 1000,
              once: true,
            });
          }, []);

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5 mt-16">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#1c180d] tracking-light text-[32px] font-bold leading-tight mt-6">
              Explore Experiences
            </p>
            <p className="text-[#9e8747] text-sm font-normal leading-normal">
              Browse through real interview experiences shared by students from your college.
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-3 flex-wrap pr-4">
          <select
            onChange={(e) => handleFilterChange("college", e.target.value)}
            className="text-[#1c180d] text-sm font-medium leading-normal bg-[#f4f0e6] rounded-lg pl-3 pr-6 py-1"
          >
            <option value="">All Colleges</option>
            {collageOptions.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <select
            onChange={(e) => handleFilterChange("company", e.target.value)}
            className="text-[#1c180d] text-sm font-medium leading-normal bg-[#f4f0e6] rounded-lg pl-3 pr-6 py-1"
          >
            <option value="">All Companies</option>
            {companyOptions.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <select
            onChange={(e) => handleFilterChange("roal", e.target.value)}
            className="text-[#1c180d] text-sm font-medium leading-normal bg-[#f4f0e6] rounded-lg pl-3 pr-6 py-1"
          >
            <option value="">All Roles</option>
            {roleOptions.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>

          {/* New Sort By dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-[#1c180d] text-sm font-medium leading-normal bg-[#f4f0e6] rounded-lg pl-3 pr-6 py-1"
          >
            <option value="">Sort By</option>
            <option value="latest">Latest</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>

        <h2 className="text-[#1c180d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Recent Experiences
        </h2>

        {loading ? (
          <div className="flex flex-col gap-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[#ecebe7] rounded-lg p-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-sm" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 w-3/4 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
                  </div>
                </div>
                <div className="mt-4 h-3 bg-gray-200 w-full rounded"></div>
                <div className="mt-2 h-3 bg-gray-100 w-5/6 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          currentPosts.map((post) => (
            <div key={post.id} className="p-4" onClick={() => navigate(`/detail/${post.id}`)}>
              <div className="flex flex-col gap-2 rounded-lg bg-[#f3f3f2ec] p-4 cursor-pointer relative"  data-aos="fade-down">
                {/* Like and Share buttons - Desktop (top right) */}
                <div className="hidden md:flex absolute top-4 right-4 flex items-center gap-4 ">
                  {/* Like Button */}
                  <div className="flex flex items-center">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      disabled={loadingLikes.has(post.id)}
                      className={`p-2 rounded-full cursor-pointer transition-all duration-200 transform active:scale-95 hover:scale-105 ${
                        likedPosts.has(post.id) ? 'bg-[#fac638]/10' : 'hover:bg-gray-100'
                      } ${loadingLikes.has(post.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={likedPosts.has(post.id) ? "#fac638" : "none"}
                        stroke={likedPosts.has(post.id) ? "#fac638" : "#9e8747"}
                        strokeWidth="2"
                        className={`transition-all duration-200 ${
                          loadingLikes.has(post.id) ? 'animate-pulse' : ''
                        } ${likedPosts.has(post.id) ? 'drop-shadow-sm' : ''}`}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    {likeCounts[post.id] > 0 && (
                      <span className={`text-xs font-medium transition-all duration-200 ${
                        likedPosts.has(post.id) ? 'text-[#fac638]' : 'text-[#9e8747]'
                      }`}>
                        {likeCounts[post.id]}
                      </span>
                    )}
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={(e) => handleShare(post.id, e)}
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

                <div className="flex items-center gap-3" >
                  <img
                    src={assets[post.company] || "/logos/default.png"}
                    alt={post.company}
                    className="w-10 h-10 object-contain rounded-sm bg-white"
                  />
                  <div>
                    <p className="text-[#1c180d] font-bold text-base">
                      Interview Experience at {post.company}
                    </p>
                    <p className="text-[#9e8747] text-sm">{post.roal}</p>
                  </div>
                </div>
                <p className="text-[#9e8747] text-sm">
                  Rounds: {post.rounds} &nbsp;|&nbsp; Difficulty: {post.difficulty}
                </p>
                <p className="text-[#9e8747] text-sm line-clamp-2">{post.experience}</p>
                
                {/* Mobile Like and Share buttons (bottom of card) */}
                <div className="flex md:hidden justify-between items-center pt-3 border-t border-gray-200 mt-2">
                  {/* Like Button Mobile - Left side */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      disabled={loadingLikes.has(post.id)}
                      className={`p-1.5 rounded-full cursor-pointer transition-all duration-200 transform active:scale-95 ${
                        likedPosts.has(post.id) ? 'bg-[#fac638]/10' : ''
                      } ${loadingLikes.has(post.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={likedPosts.has(post.id) ? "#fac638" : "none"}
                        stroke={likedPosts.has(post.id) ? "#fac638" : "#9e8747"}
                        strokeWidth="2"
                        className={`transition-all duration-200 ${
                          loadingLikes.has(post.id) ? 'animate-pulse' : ''
                        }`}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    {likeCounts[post.id] > 0 && (
                      <span className={`text-sm font-medium transition-all duration-200 ${
                        likedPosts.has(post.id) ? 'text-[#fac638]' : 'text-[#9e8747]'
                      }`}>
                        {likeCounts[post.id]}
                      </span>
                    )}
                  </div>

                  {/* Share Button Mobile - Right side */}
                  <button
                    onClick={(e) => handleShare(post.id, e)}
                    className="p-1.5 rounded-full cursor-pointer transition-all duration-200 transform active:scale-95"
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

                <div className="flex justify-between pt-2 text-[#9e8747] text-xs md:block">
                  <span className="font-bold text-[15px]">{post.collage}</span>
                  <span className="md:float-right">{post.Date}</span>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="flex justify-center items-center gap-2 pt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full bg-[#f4f0e6] text-[#1c180d] font-medium hover:bg-[#e3e0d5] disabled:opacity-50 cursor-pointer"
          >
            &lt;
          </button>
          {generatePageNumbers()}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full bg-[#f4f0e6] text-[#1c180d] font-medium hover:bg-[#e3e0d5] disabled:opacity-50 cursor-pointer"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;