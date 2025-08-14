import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LogProgress() {
  const { goalTitle } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!progress) {
      setMessage("Please enter your progress update.");
      return;
    }

    console.log(`Progress for "${goalTitle || "goal"}":`, progress);
    setMessage("Your progress has been logged successfully!");
    setProgress("");
  };

  const handleBack = () => {
    navigate("/my-goals");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-white">
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">LOG PROGRESS</h1>
        <h2 className="text-xl mb-4 text-center">
          Log Today's Progress {goalTitle && `for "${goalTitle}"`}
        </h2>
        <p className="mb-6 text-black text-center">
          Track your journey and update your achievements
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Progress Note</label>
            <textarea
              placeholder="How did it go today?Any progress?kindly share your today's experience..."
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-white"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition duration-200"
          >
            Save Progress
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-300">{message}</p>
        )}

        <button
          onClick={handleBack}
          className="mt-6 w-full bg-black border border-white text-white py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          Back to My Goals
        </button>
      </div>
    </div>
  );
}
