import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// Predefined filter options
const collageOptions = [
  "SRM-AP", "VIT-AP", "VR-Siddharatha", "KLU", "Gitam", "Andhra university",
  "VVIT", "Vigan", "Amrita", "RVRJC", "IIT", "NIT", "IIIT", "others",
];
const companyOptions = [
  "Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro", "HCL",
  "Capgemini", "Deloitte", "Adobe", "Flipkart", "Other",
];
const roleOptions = [
  "Software Developer(SDE) intern", "Front-end", "Back-end", "ML",
  "Data Scientist", "DevOps", "Cloud", "Cybersecurity",
];

const Explore = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filters, setFilters] = useState({ college: "", company: "", role: "" });
  const [loading, setLoading] = useState(true);

  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const searchQuery = queryParams.get("search")?.toLowerCase() || "";

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const maxPages = 100;

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
  const { college, company, role } = filters;
  let filtered = posts;

  if (college) filtered = filtered.filter((p) => p.collage === college);
  if (company) filtered = filtered.filter((p) => p.company === company);
  if (role) filtered = filtered.filter((p) => p.role === role);

  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.company?.toLowerCase().includes(searchQuery) ||
        p.role?.toLowerCase().includes(searchQuery)
    );
  }

  setFilteredPosts(filtered);
  setCurrentPage(1);
}, [posts, filters, searchQuery]);


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
          className={`w-9 h-9 rounded-full font-medium ${
            currentPage === p
              ? "bg-[#fac638] text-black font-bold"
              : "bg-[#f4f0e6] text-[#1c180d]"
          } hover:bg-[#e3e0d5] cursor-pointer`}
        >
          {p}
        </button>
      );

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);
      if (currentPage > 4) pages.push(<span key="dots1">...</span>);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) addPage(i);
      if (currentPage < totalPages - 3) pages.push(<span key="dots2">...</span>);
      addPage(totalPages);
    }
    return pages;
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5 mt-16">
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

        {/* ✅ Filters */}
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
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="text-[#1c180d] text-sm font-medium leading-normal bg-[#f4f0e6] rounded-lg pl-3 pr-6 py-1"
          >
            <option value="">All Roles</option>
            {roleOptions.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* ✅ Title */}
        <h2 className="text-[#1c180d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Recent Experiences
        </h2>

        {/* ✅ Loading Animation */}
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
              <div className="flex flex-col gap-2 rounded-lg bg-[#f3f3f2ec] p-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <img
                    src={assets[post.company] || "/logos/default.png"}
                    alt={post.company}
                    className="w-10 h-10 object-contain rounded-sm bg-white"
                  />
                  <div>
                    <p className="text-[#1c180d] font-bold text-base">
                      Interview Experience at {post.company}
                    </p>
                    <p className="text-[#9e8747] text-sm">{post.role}</p>
                  </div>
                </div>
                <p className="text-[#9e8747] text-sm">
                  Rounds: {post.rounds} &nbsp;|&nbsp; Difficulty: {post.difficulty}
                </p>
                <p className="text-[#9e8747] text-sm line-clamp-2">{post.experience}</p>
                <div className="flex justify-between pt-2 text-[#9e8747] text-xs">
                  <span className="font-bold text-[15px]">{post.collage}</span>
                  <span>{post.Date}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* ✅ Pagination */}
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
