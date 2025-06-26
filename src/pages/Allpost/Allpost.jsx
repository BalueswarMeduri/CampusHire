import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const Allpost = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snap = await getDocs(collection(db, "posts"));
        const allPosts = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const currentUserId = auth.currentUser?.uid;

        if (currentUserId) {
          const userPosts = allPosts.filter(
            (post) => post.userId === currentUserId
          );
          setPosts(userPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post.");
    }
  };

  if (!auth.currentUser) {
    return (
      <div className="text-center mt-10 text-[#9e8747] text-lg">
        Please login to view your posts.
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="hidden sm:block w-52 p-6 border-r border-[#e0dbcf]">
        <div className="flex flex-col gap-4 pt-14">
          <Link
            to="/post"
            className="flex items-center gap-2 text-[#1c180d] px-4 py-2 rounded-lg font-semibold transition hover:bg-[#f4f0e6]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
            </svg>
            <span>Post</span>
          </Link>

          <Link
            to="/all-post"
            className="flex items-center gap-2 text-[#1c180d] px-4 py-2 rounded-lg font-semibold transition hover:bg-[#f4f0e6]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.92,15.92,0,0,0,168,219.31L219.31,168A15.92,15.92,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM96,88h64a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Zm32,80H96a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16ZM96,136a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm64,68.69V160h44.7Z" />
            </svg>
            <span>My Posts</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto">
        <div className="flex flex-wrap justify-between gap-3 p-4 mt-20">
          <p className="text-[#1c180d] tracking-light text-[32px] font-bold leading-tight min-w-72">
            My Posts
          </p>
        </div>

        <h3 className="text-[#1c180d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Interview Experiences
        </h3>

        {posts.length === 0 ? (
          <div className="pb-28 pt-20">
            <p className="p-4 text-[#9e8747]">No posts found.</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between gap-4 rounded-lg bg-[#fcfbf8] p-4 shadow-sm">
                {/* Text Section */}
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <p className="text-[#9e8747] text-sm font-normal leading-normal">
                    {post.roal}
                  </p>
                  <p className="text-[#1c180d] text-base font-bold leading-tight">
                    Interview at {post.company}
                  </p>
                  <p className="text-[#9e8747] text-sm font-normal leading-normal">
                    {post.roundsData?.[0]?.includes("Behavioral")
                      ? "Behavioral Interview"
                      : "Technical Interview"}
                  </p>

                  {/* Edit and Delete Buttons */}
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => navigate(`/edit-post/${post.id}`)}
                      className="text-yellow-500 text-[15px] font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <svg
                        fill="currentColor"
                        width="16"
                        height="16"
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M 25 4.03125 C 24.234375 4.03125 23.484375 4.328125 22.90625 4.90625 L 13 14.78125 L 12.78125 15 L 12.71875 15.3125 L 12.03125 18.8125 L 11.71875 20.28125 L 13.1875 19.96875 L 16.6875 19.28125 L 17 19.21875 L 17.21875 19 L 27.09375 9.09375 C 28.246094 7.941406 28.246094 6.058594 27.09375 4.90625 C 26.515625 4.328125 25.765625 4.03125 25 4.03125 Z" />
                      </svg>
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this post?"
                          )
                        ) {
                          handleDelete(post.id);
                        }
                      }}
                      className="text-red-600 text-[15px] font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                      >
                        <path
                          d="M 8 0 L 7 1 L 7 2 L 2 2 L 2 3 L 3 3 L 3 18 L 5 20 L 14 20 L 16 18 L 16 3 L 17 3 L 17 2 L 12 2 L 12 1 L 11 0 L 8 0 z M 8.4140625 1 L 10.585938 1 L 11 1.4140625 L 11 2 L 8 2 L 8 1.4140625 L 8.4140625 1 z M 4 3 L 15 3 L 15 17.585938 L 13.585938 19 L 5.4140625 19 L 4 17.585938 L 4 3 z M 6 5 L 6 17 L 7 17 L 7 5 L 6 5 z M 9 5 L 9 17 L 10 17 L 10 5 L 9 5 z M 12 5 L 12 17 L 13 17 L 13 5 L 12 5 z"
                          fill="#dc2626"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Image Section */}
                <div
                  className="w-44 h-24 bg-center bg-no-repeat bg-cover rounded-lg"
                  style={{
                    backgroundImage: `url(${
                      assets[post.company] || "/logos/default.png"
                    })`,
                  }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Allpost;
