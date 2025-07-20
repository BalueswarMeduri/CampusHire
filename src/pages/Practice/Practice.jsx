import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../firebase'; // Assuming db and auth are exported from your firebase file
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AOS from "aos";
import "aos/dist/aos.css";

// Main Component based on your provided structure
const Practice = () => {
  // State variables to manage the application
  const [selectedTopic, setSelectedTopic] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [finalResults, setFinalResults] = useState({ wpm: 0, accuracy: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authInfo, setAuthInfo] = useState(null);

  // Refs for managing intervals, focus, and calculation state
  const timerInterval = useRef(null);
  const practiceAreaRef = useRef(null);
  const hasCalculatedFinalResults = useRef(false);

  // API Key - It's better to store this in an environment variable for security
  const API_KEY = "AIzaSyCRj9J2bZZ7XxdlHzeVAk4FtLgmWW6om3w";

  // Effect to get user authentication info from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuthInfo(JSON.parse(storedAuth));
    }
  }, []);

   useEffect(() => {
      AOS.init({
        duration: 1000,
        once: true,
      });
    }, []);

  // Effect to handle the timer countdown
  useEffect(() => {
    const cleanup = () => clearInterval(timerInterval.current);

    if (isTestActive && !isTestFinished) {
      if (timeLimit !== "No Limit") {
        timerInterval.current = setInterval(() => {
          setTimeRemaining((prevTime) => {
            if (prevTime <= 1) {
              cleanup();
              endTest();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        // 'No Limit' case
        timerInterval.current = setInterval(() => {
          setTimeRemaining((prevTime) => prevTime + 1);
        }, 1000);
      }
    }

    return cleanup;
  }, [isTestActive, isTestFinished, timeLimit]);

  // Effect to end test when paragraph is fully typed
  useEffect(() => {
    if (paragraph && typedText.length === paragraph.length && !isTestFinished) {
      endTest();
    }
  }, [typedText, paragraph, isTestFinished]);

  // New robust Effect to calculate final results only ONCE when the test is finished
  useEffect(() => {
    if (isTestFinished && !hasCalculatedFinalResults.current) {
      hasCalculatedFinalResults.current = true; // Prevent re-calculation

      const totalTypedChars = typedText.length;
      if (!paragraph || totalTypedChars === 0) {
        setFinalResults({ wpm: 0, accuracy: 0 });
        setShowResultsModal(true);
        return;
      }

      let correctChars = 0;
      for (let i = 0; i < totalTypedChars; i++) {
        if (typedText[i] === paragraph[i]) correctChars++;
      }
      const finalAccuracy = (correctChars / totalTypedChars) * 100;

      let timeElapsedInSeconds;
      if (timeLimit === "No Limit") {
        timeElapsedInSeconds = timeRemaining;
      } else {
        const initialTime = timeLimit === "30s" ? 30 : 60;
        timeElapsedInSeconds = initialTime - (timeRemaining || 0);
      }

      let finalWpm = 0;
      if (timeElapsedInSeconds > 0) {
        const wordsTyped = totalTypedChars / 5;
        finalWpm = Math.round((wordsTyped / timeElapsedInSeconds) * 60);
      }
      
      const results = {
        wpm: finalWpm,
        accuracy: parseFloat(finalAccuracy.toFixed(1)),
      };

      setFinalResults(results);
      saveTestResults(results); // Save results to Firebase
      setShowResultsModal(true);
    }
  }, [isTestFinished, typedText, timeRemaining, paragraph, timeLimit]);

  // Function to save test results to Firestore
  const saveTestResults = async (results) => {
    if (!authInfo?.userID) {
      console.log("User not logged in. Skipping save.");
      return;
    }
    
    try {
      await addDoc(collection(db, "typing-sessions"), {
        userId: authInfo.userID,
        wpm: results.wpm,
        accuracy: results.accuracy,
        timestamp: serverTimestamp(),
      });
      console.log("Typing session saved successfully!");
    } catch (error) {
      console.error("Error saving typing session: ", error);
      setError("Could not save your results. Please try again.");
    }
  };


  // Function to fetch paragraph from Gemini API
  const generateParagraph = async () => {
    if (!selectedTopic || !timeLimit) {
      setError("Please select both a topic and a time limit.");
      return;
    }
    resetTest(true); // Soft reset before fetching
    setLoading(true);
    setError("");

    const prompt = `Generate a short, factual, and interview-relevant paragraph (about 60–80 words) based on the DSA topic: "${selectedTopic}". The paragraph should simulate a common technical interview question or concept explanation, similar to what is typically asked in coding interviews. For example, describe a classic problem (like "Merge Intervals", "Binary Search", "Heap Sort") or a conceptual scenario that could be framed as an MCQ. Ensure it is precise, logical, and clear enough for a typing test. Avoid fluff.`;

    try {
      const apiKey =
        typeof __gemini_api_key__ !== "undefined"
          ? __gemini_api_key__
          : API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `API request failed with status ${response.status}`
        );
      }

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content.parts[0].text
      ) {
        const generatedText = result.candidates[0].content.parts[0].text;
        setParagraph(generatedText);
        const time = timeLimit === "30s" ? 30 : timeLimit === "60s" ? 60 : 0;
        setTimeRemaining(time);
        setTimeout(() => practiceAreaRef.current?.focus(), 100);
      } else {
        throw new Error("No content generated. Please try again.");
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to generate paragraph. Check your API key and network."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to end the test by setting a flag
  const endTest = () => {
    if (isTestFinished) return; // Prevent multiple calls
    setIsTestActive(false);
    setIsTestFinished(true); // This will trigger the useEffect for calculations
    clearInterval(timerInterval.current);
  };

  // Function to handle keyboard input
  const handleKeyDown = (e) => {
    if (!paragraph || isTestFinished || loading) return;

    e.preventDefault();

    if (!isTestActive) {
      setIsTestActive(true);
    }

    let newTypedText;
    if (e.key === "Backspace") {
      newTypedText = typedText.slice(0, -1);
    } else if (e.key.length === 1) {
      // Catches letters, numbers, symbols, space
      newTypedText = typedText + e.key;
    } else {
      return; // Do nothing for other keys like Shift, Alt, etc.
    }

    setTypedText(newTypedText);
    calculatePerformance(newTypedText); // Pass the new value for live updates
  };

  // Function to calculate WPM and Accuracy for LIVE display
  const calculatePerformance = (currentTypedText) => {
    if (!paragraph || currentTypedText.length === 0) {
      setWpm(0);
      setAccuracy(0);
      return;
    }

    const totalTypedChars = currentTypedText.length;

    let correctChars = 0;
    for (let i = 0; i < totalTypedChars; i++) {
      if (currentTypedText[i] === paragraph[i]) {
        correctChars++;
      }
    }

    const currentAccuracy = (correctChars / totalTypedChars) * 100;
    setAccuracy(parseFloat(currentAccuracy.toFixed(1)));

    let timeElapsedInSeconds;
    if (timeLimit === "No Limit") {
      timeElapsedInSeconds = timeRemaining;
    } else {
      const initialTime = timeLimit === "30s" ? 30 : 60;
      timeElapsedInSeconds = initialTime - timeRemaining;
    }

    if (timeElapsedInSeconds > 0) {
      const wordsTyped = totalTypedChars / 5;
      const wpm = (wordsTyped / timeElapsedInSeconds) * 60;
      setWpm(Math.round(wpm));
    } else {
      setWpm(0);
    }
  };

  // Function to reset the test state
  const resetTest = (isStartingNew = false) => {
    clearInterval(timerInterval.current);
    setShowResultsModal(false);
    setParagraph("");
    setTypedText("");
    setIsTestActive(false);
    setIsTestFinished(false);
    setWpm(0);
    setAccuracy(0);
    setFinalResults({ wpm: 0, accuracy: 0 });
    hasCalculatedFinalResults.current = false; // Reset the calculation flag
    setError("");
    if (!isStartingNew) {
      setTimeRemaining(0);
    }
  };

  // Function to render the paragraph with character highlighting and cursor
  const renderParagraph = () => {
    if (loading)
      return (
        <p className="text-[#827b68] text-1xl">
          Generating interview question...
        </p>
      );
    if (!paragraph)
      return (
        <p className="text-[#827b68] text-1xl">
          Select a topic and time, then click Start.
        </p>
      );

    const typedPart = typedText.split("").map((char, index) => (
      <span
        key={`typed-${index}`}
        className={
          paragraph[index] === char
            ? "text-green-700"
            : "text-red-600 bg-red-100 rounded"
        }
      >
        {paragraph[index]}
      </span>
    ));

    const cursor = !isTestFinished ? (
      <span className="blinking-cursor inline-block w-[1px] h-[1em] align-baseline bg-[#171512] mx-[0.5px]" />
    ) : null;

    const untypedPart = (
      <span className="text-gray-500">
        {paragraph.substring(typedText.length)}
      </span>
    );
    
    return (
      <span>
        {typedPart}
        {cursor}
        {untypedPart}
      </span>
    );
  };

  const { text: buttonText, action: buttonAction } =
    isTestActive || paragraph
      ? { text: "Reset", action: () => resetTest(false) }
      : { text: "Start Test", action: generateParagraph };

  return (
    <>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .blinking-cursor {
         animation: blink 1s step-end infinite;
         display: inline-block;
         width: 1px;
         height: 1em;
         background-color: #171512;
         vertical-align: baseline;
         }
        .typing-area-content {
         white-space: pre-wrap;
         word-wrap: break-word;
         }
      `}</style>
      <div className=" min-h-screen font-sans">
        <div className="layout-content-container flex flex-col max-w-[970px] flex-1 pt-10 md:pt-18 mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col gap-2 p-4" data-aos="fade-up">
            <p className="text-[#171512] tracking-light text-[32px] font-bold leading-tight">
              Typing with DSA
            </p>
            <p className="text-[#44403c] text-base max-w-xl">
              Sharpen your typing speed while learning core data structures and
              algorithms.
            </p>
          </div>

          {/* Topic + Time Limit - Side by Side */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 px-4 py-4" data-aos="fade-up">
            <div className="flex flex-col min-w-[45%] flex-1">
              <h3 className="text-[#171512] text-lg font-bold leading-tight tracking-[-0.015em] pb-2">
                Select an Interview Topic
              </h3>
              <select
                className="form-input w-full rounded-xl text-[#171512] border border-[#e4e2dd] bg-[#f4f0e6] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={isTestActive || loading}
              >
                <option value="">Select a topic</option>
                <option value="arrays">Arrays</option>
                <option value="linked list">Linked List</option>
                <option value="binary search">Binary Search</option>
                <option value="graphs">Graphs</option>
                <option value="trees">Trees</option>
                <option value="dynamic programming ">DP</option>
                <option value="hash tables">Hash Tables</option>
                <option value="stack and queue">Stack & Queue</option>
                <option value="hash tables">Hash Tables</option>
                <option value="react-js">React js</option>
                <option value="node-js">Node js</option>
                <option value="oops">OOPS</option>
              </select>
            </div>

            <div className="flex flex-col min-w-[45%] flex-1">
              <h3 className="text-[#171512] text-lg font-bold leading-tight tracking-[-0.015em] pb-2">
                Time Limit
              </h3>
              <div className="flex items-center gap-3">
                {["30s", "60s", "No Limit"].map((label) => (
                  <label
                    key={label}
                    className={`text-sm font-medium flex bg-[#f4f0e6] items-center justify-center rounded-xl border px-4 h-11 text-[#171512] relative transition-all ${
                      timeLimit === label
                        ? "border-2 border-amber-400"
                        : "border-[#e4e2dd]"
                    } ${
                      isTestActive || loading
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }`}
                  >
                    {label}
                    <input
                      type="radio"
                      className="invisible absolute"
                      name="time-limit"
                      value={label}
                      checked={timeLimit === label}
                      onChange={() => setTimeLimit(label)}
                      disabled={isTestActive || loading}
                    />
                  </label>
                ))}
                <button
                  onClick={buttonAction}
                  disabled={loading}
                  className="ml-auto px-6 py-2.5 rounded-xl bg-[#fac638] text-white font-bold hover:bg-yellow-500 cursor-pointer transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : buttonText}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-4 my-2 p-3 text-center bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Typing Content Display & Input Area */}
          <h3 data-aos="fade-up" className="text-[#171512] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Typing Content
          </h3>
          <div
            data-aos="fade-up"
            ref={practiceAreaRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="w-full p-4 rounded-xl border border-[#e4e2dd] bg-[#f3f3f2ec] min-h-[140px] text-xl font-mono leading-relaxed select-none mx-4  cursor-text"
          >
            <div className="typing-area-content">{renderParagraph()}</div>
          </div>

          {/* Performance */}
          <h3 className="text-[#171512] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Performance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
            <div data-aos="fade-right" className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#e4e2dd] bg-white">
              <p className="text-[#171512] text-base font-medium leading-normal">
                WPM
              </p>
              <p className="text-[#171512] tracking-light text-4xl font-bold leading-tight">
                {wpm}
              </p>
            </div>
            <div data-aos="fade-up" className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#e4e2dd] bg-white">
              <p className="text-[#171512] text-base font-medium leading-normal">
                Accuracy
              </p>
              <p className="text-[#171512] tracking-light text-4xl font-bold leading-tight">
                {accuracy}%
              </p>
            </div>
            <div data-aos="fade-left" className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#e4e2dd] bg-white">
              <p className="text-[#171512] text-base font-medium leading-normal">
                Time
              </p>
              <p className="text-[#171512] tracking-light text-4xl font-bold leading-tight">
                {String(Math.floor(timeRemaining / 60)).padStart(2, "0")}:
                {String(timeRemaining % 60).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10  flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center relative w-11/12 max-w-md">
            <button
              onClick={() => resetTest(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-4 text-[#171512]">
              Test Complete!
            </h2>
            <div className="flex justify-around my-6">
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-600">WPM</p>
                <p className="text-5xl font-bold text-yellow-500">
                  {finalResults.wpm}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-600">Accuracy</p>
                <p className="text-5xl font-bold text-yellow-500">
                  {finalResults.accuracy}%
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              You completed the test in the "{timeLimit}" category.
            </p>
            <button
              onClick={() => resetTest(false)}
              className="mt-6 w-full px-6 py-3 rounded-xl bg-[#fac638] text-white font-bold hover:bg-yellow-500 cursor-pointer transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Practice;
