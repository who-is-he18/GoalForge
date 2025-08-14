import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LogProgress() {
  const { goalTitle } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!progress) {
      setMessage("Please enter your progress update.");
      return;
    }

    console.log(`Progress for "${goalTitle || "goal"}":`, progress, file);
    setMessage("Your progress has been logged successfully!");
    setProgress("");
    setFile(null);
  };

  const handleCancel = () => {
    navigate("/my-goals");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
  <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl border border-gray-200">

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Log Today's Progress
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Record your progress for:{" "}
          <span className="font-semibold text-black">
            {goalTitle || "Your Goal"}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Progress Note */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Progress Note
            </label>
            <textarea
              placeholder="How did it go today? Share your thoughts, challenges, victories, or any observations..."
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800"
              rows="3"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Add Photo or Video (Optional)
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:border-gray-400 transition">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="text-sm text-gray-600">Choose File</span>
                <span className="text-xs text-gray-400">
                  Images and videos up to 10MB
                </span>
              </label>
            </div>
            {file && (
              <p className="mt-1 text-xs text-gray-500">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Progress Reward */}
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              You'll earn XP for logging your progress today
            </p>
            <span className="text-indigo-600 font-semibold">+15 XP</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Log Progress
            </button>
          </div>

          {/* Message */}
          {message && (
            <p className="mt-2 text-xs text-green-600 text-center">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
