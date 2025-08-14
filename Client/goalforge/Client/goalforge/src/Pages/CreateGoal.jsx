import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";      

export default function CreateGoalPage() {
  const navigate = useNavigate();

  // default today's date as yyyy-mm-dd
  const today = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  const [goalTitle, setGoalTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [isPublic, setIsPublic] = useState(false);

  function handleBack() {
    // navigate back if there is history, otherwise go to /my-goals
    if (window.history.length > 1) navigate(-1);
    else navigate("/my-goals");
  }

  function handleSubmit(e) {
    e.preventDefault();
    // simulated create
    alert(`Created goal: ${goalTitle || "(no title)"}`);
    navigate("/my-goals");
  }
return (
    <div className="min-h-screen bg-white px-8 py-10">
      {/* Top row: back, small icon, title (wider max) */}
      <div className="max-w-4xl mx-auto flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3 ml-1">
          <div className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="#111827" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="4" stroke="#111827" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="1.2" fill="#111827" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold text-gray-900">Create New Goal</h1>
        </div>
      </div>

      {/* Wider Card wrapper */}
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
        >
          {/* header */}
          <div className="flex items-start gap-3 mb-2">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="#111827" strokeWidth="1.2" />
                <path d="M16 2v4M8 2v4" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900">Goal Details</h2>
              <p className="text-xs text-gray-500 mt-1">
                Set up your goal with all the details to start tracking your progress
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Goal Title <span className="text-red-500">*</span>
            </label>
            <input
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="e.g., Run 5K every morning"
              required
              className="w-full bg-gray-50 placeholder-gray-400 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about your goal, why it's important to you, or how you plan to achieve it..."
              rows={3}
              className="w-full bg-gray-50 placeholder-gray-400 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Category */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none"
            >
              <option>General</option>
              <option>Fitness</option>
              <option>Career</option>
              <option>Education</option>
            </select>
          </div>

          {/* Dates grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full bg-gray-50 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-gray-50 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Frequency */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-gray-50 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          {/* Public toggle */}
          <div className="mt-5 border border-gray-100 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Make this goal public</p>
              <p className="text-xs text-gray-500 mt-1">
                Public goals can be seen by other users and appear in the community feed
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPublic((s) => !s)}
              aria-pressed={isPublic}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                isPublic ? "bg-black" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform ${
                  isPublic ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/my-goals")}
              className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 shadow-sm"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}