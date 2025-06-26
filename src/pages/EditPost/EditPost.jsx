import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { toast } from "react-toastify";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    company: "",
    roal: "",
    collage: "",
    rounds: "",
    difficulty: "",
    experience: "",
    roundsData: "",
    tips: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setPostData({
            company: data.company || "",
            roal: data.roal || "",
            collage: data.collage || "",
            rounds: data.rounds || "",
            difficulty: data.difficulty || "",
            experience: data.experience || "",
            roundsData: Array.isArray(data.roundsData)
              ? data.roundsData.join("\n")
              : data.roundsData || "",
            tips: data.tips || "",
          });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "posts", id), {
        ...postData,
        roundsData: postData.roundsData.split("\n").filter(Boolean),
      });
      toast.success("Post updated successfully!")
      navigate("/all-post");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20">
      <h2 className="text-2xl font-bold mb-6 text-[#1c180d]">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["company", "Company"],
          ["roal", "Role"],
          ["collage", "College"],
          ["rounds", "Rounds"],
          ["difficulty", "Difficulty"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block text-[#1c180d] font-semibold">{label}</label>
            <input
              type="text"
              name={name}
              value={postData[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-[#1c180d] font-semibold">Experience</label>
          <textarea
            name="experience"
            value={postData.experience}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-[#1c180d] font-semibold">Rounds Data</label>
          <textarea
            name="roundsData"
            value={postData.roundsData}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            rows="4"
          />
          <p className="text-sm text-gray-500 mt-1">Add each round on a new line.</p>
        </div>

        <div>
          <label className="block text-[#1c180d] font-semibold">Tips</label>
          <textarea
            name="tips"
            value={postData.tips}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 text-white px-6 py-2 rounded font-semibold cursor-pointer"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
