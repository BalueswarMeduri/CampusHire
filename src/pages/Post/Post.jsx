import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  collage: "",
  company: "",
  roal: "",
  Date: "",
  rounds: "",
  difficulty: "",
  type: "",
  experience: "",
  tips: "",
  roundsData: [],
};

const collageOptions = [
  "SRM-AP", "VIT-AP", "VR-Siddharatha", "KLU", "Gitam",
  "Andhra university", "VVIT", "Vigan", "Amrita", "RVRJC",
  "IIT", "NIT", "IIIT", "others",
];

const roalOptions = [
  "Software Developer(SDE) intern", "Front-end", "Back-end", "ML",
  "Data Scientist", "DevOps", "Cloud", "Cybersecurity",
];

const companyOptions = [
  "Google", "Microsoft", "Amazon", "Paypal", "TCS","JPMorgan","SAMSUNG", "Infosys", "Wipro", "HCL",
  "Capgemini", "Deloitte", "Adobe", "Flipkart", "Startup",
];

const typeOptions = [
  "College Placement",
  "Internship Program",
  "Off-Campus Drive",
  "Referral",
];

const Post = () => {
  const [authInfo, setAuthInfo] = useState(null);
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuthInfo(JSON.parse(storedAuth));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rounds") {
      const roundCount = parseInt(value);
      const newRounds = isNaN(roundCount) ? [] : Array(roundCount).fill("");
      setForm((prev) => ({
        ...prev,
        [name]: value,
        roundsData: newRounds,
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRoundChange = (index, value) => {
    const newRounds = [...form.roundsData];
    newRounds[index] = value;
    setForm({ ...form, roundsData: newRounds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.collage && form.company && form.roal && form.Date &&
      form.rounds && form.difficulty && form.type &&
      form.experience && form.tips &&
      form.roundsData.every(r => r.trim() !== "")
    ) {
      try {
        await addDoc(collection(db, "posts"), {
          ...form,
          Timestamp: serverTimestamp(),
          author: authInfo.name,
          userId : authInfo.userID,
        });

        toast.success("Your interview experience has been posted!", {
          position: "top-center",
        });

        setForm(initialState);
      } catch (error) {
        toast.error("Something went wrong. Try again.");
        console.error(error);
      }
    } else {
      toast.warn("Please fill all required fields.");
    }
  };    

  return (
    <div className="flex min-h-screen">
      <aside className="hidden sm:block w-52 p-6 border-r border-[#e0dbcf]">
        <div className="flex flex-col gap-4 pt-14">
          <Link to="/post" className="flex items-center gap-2 text-[#1c180d] px-4 py-2 rounded-lg font-semibold transition hover:bg-[#f4f0e6]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
            </svg>
            <span>Post</span>
          </Link>
          <Link to="/myposts" className="flex items-center gap-2 text-[#1c180d] px-4 py-2 rounded-lg font-semibold transition hover:bg-[#f4f0e6]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.92,15.92,0,0,0,168,219.31L219.31,168A15.92,15.92,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM96,88h64a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Zm32,80H96a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16ZM96,136a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm64,68.69V160h44.7Z" />
            </svg>
             <Link to="/all-post">
                          <span>My Posts</span>
                </Link>
          </Link>
        </div>
      </aside>

      <form onSubmit={handleSubmit} className="mt-20 px-10 py-8 flex-1 flex justify-center">
        <div className="w-full max-w-[512px]">
          <h2 className="text-[#1c180d] text-[28px] font-bold px-4 pb-3">
            Share your interview experience
          </h2>

          {[{ name: "collage", options: collageOptions, label: "Select college" },
            { name: "type", options: typeOptions, label: "Type of opportunity" },
            { name: "company", options: companyOptions, label: "Select company" },
            { name: "roal", options: roalOptions, label: "Select role" },
            { name: "rounds", options: [1, 2, 3, 4, 5].map(n => `${n}`), label: "How many rounds?" },
            { name: "difficulty", options: ["Easy", "Medium", "Hard"], label: "Difficulty level" }]
            .map(({ name, options, label }) => (
              <div key={name} className="px-4 py-3">
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full h-14 border border-[#e9e2ce] bg-[#fcfbf8] rounded-lg px-4 text-[#1c180d]"
                >
                  <option value="">{label}</option>
                  {options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}

          <div className="px-4 py-3">
            <input
              type="month"
              name="Date"
              value={form.Date}
              onChange={handleChange}
              className="w-full h-14 border border-[#e9e2ce] bg-[#fcfbf8] rounded-lg px-4 text-[#1c180d]"
            />
          </div>

          {/* Dynamic Rounds */}
          {form.roundsData.length > 0 && (
            <div className="px-4 py-3">
              <h4 className="text-lg font-semibold mb-2 text-[#1c180d]">Round-wise Experience</h4>
              {form.roundsData.map((round, index) => (
                <div key={index} className="mb-3">
                  <label className="block mb-1 text-[#1c180d]">Round {index + 1}</label>
                  <textarea
                    value={round}
                    onChange={(e) => handleRoundChange(index, e.target.value)}
                    placeholder={`Describe Round ${index + 1}`}
                    className="w-full min-h-[100px] border border-[#e9e2ce] bg-[#fcfbf8] rounded-lg px-4 py-3 text-[#1c180d]"
                  />
                </div>
              ))}
            </div>
          )}

          {[{ name: "experience", placeholder: "Describe your overall interview experience" },
            { name: "tips", placeholder: "Any tips or resources you used?" }]
            .map(({ name, placeholder }) => (
              <div key={name} className="px-4 py-3">
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full min-h-[140px] border border-[#e9e2ce] bg-[#fcfbf8] rounded-lg px-4 py-3 text-[#1c180d]"
                />
              </div>
            ))}

          <div className="flex px-4 py-3 justify-end">
            <button
              type="submit"
              className="min-w-[84px] h-10 px-4 bg-[#fac638] text-[#1c180d] font-bold rounded-lg cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Post;
