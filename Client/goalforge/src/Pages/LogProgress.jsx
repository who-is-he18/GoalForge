// LogProgress.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function LogProgress() {
  const { id: goalId } = useParams(); // route: /log-progress/:id
  const navigate = useNavigate();

  // form state
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // goal meta
  const [goalTitle, setGoalTitle] = useState("");
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalError, setGoalError] = useState(null);

  // default date = today (YYYY-MM-DD)
  const today = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  // fetch goal details to show the title
  useEffect(() => {
    if (!goalId) return;
    let mounted = true;
    async function fetchGoal() {
      setGoalLoading(true);
      setGoalError(null);
      try {
        const res = await api.get(`/goals/${goalId}`);
        if (!mounted) return;
        const g = res.data;
        setGoalTitle(g?.title || `Goal #${goalId}`);
      } catch (err) {
        console.error("Failed to fetch goal:", err);
        setGoalError("Failed to load goal.");
      } finally {
        if (mounted) setGoalLoading(false);
      }
    }
    fetchGoal();
    return () => {
      mounted = false;
    };
  }, [goalId]);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleCancel = () => {
    // go back to the goal detail if possible, otherwise to my-goals
    if (window.history.length > 1) navigate(-1);
    else navigate("/my-goals");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!note.trim()) {
      setMessage("Please enter your progress update.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to log progress.");
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      // Backend expects: goal_id (int), date (YYYY-MM-DD), note, media_url (optional), xp_earned (optional)
      const payloadBase = {
        goal_id: Number(goalId),
        date: today,
        note: note.trim(),
        xp_earned: 15, // match the UI hint; adjust if backend calculates XP server-side
      };

      // If no file, just send JSON
      if (!file) {
        const res = await api.post("/progress", payloadBase);
        const created = res.data.progress;
const updatedGoal = res.data.goal;

// dispatch event with full updated goal
if (updatedGoal) {
  window.dispatchEvent(new CustomEvent("goalUpdated", { detail: { goal: updatedGoal } }));
} else {
  window.dispatchEvent(new CustomEvent("progressCreated", { detail: { goalId: created.goal_id } }));
}
        console.log("Progress created:", res.data);
      } else {
        // If a file is present, attempt multipart/form-data
        // NOTE: your backend currently expects media_url (string); if it doesn't accept files,
        // you'll need a dedicated upload endpoint that returns a hosted URL, then POST that URL here.
        const form = new FormData();
        form.append("goal_id", payloadBase.goal_id);
        form.append("date", payloadBase.date);
        form.append("note", payloadBase.note);
        form.append("xp_earned", payloadBase.xp_earned);
        // append file under a field name 'file' (backend must support this)
        form.append("file", file);

        await api.post("/progress", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
window.dispatchEvent(new CustomEvent("progressCreated", {
  detail: { goalId: Number(goalId) }
}));

setMessage("Your progress has been logged successfully!");
setNote("");
setFile(null);

// small delay so user sees the message, then go to goal view
setTimeout(() => {
  navigate(`/my-goals`);
}, 700);
    } catch (err) {
      console.error("Error creating progress:", err);
      // show a sane message
      setMessage("Failed to log progress. Please try again.");
    } finally {
      setLoading(false);
    }
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
            {goalLoading ? "Loading…" : goalError ? "Unknown goal" : goalTitle || `Goal #${goalId}`}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Progress Note */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Progress Note</label>
            <textarea
              placeholder="How did it go today? Share your thoughts, challenges, victories, or any observations..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800"
              rows="4"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Add Photo or Video (Optional)</label>
            <div className="flex items-center gap-3">
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="text-sm"
              />
              {file && <div className="text-xs text-gray-500">Selected: {file.name}</div>}
            </div>
            <div className="mt-2 text-xs text-gray-400">Images and videos up to 10MB (backend must support uploads)</div>
          </div>

          {/* Progress Reward */}
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">You'll earn XP for logging your progress today</p>
            <span className="text-indigo-600 font-semibold">+15 XP</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Logging…" : "Log Progress"}
            </button>
          </div>

          {/* Message */}
          {message && (
            <p className={`mt-2 text-xs text-center ${message.startsWith("Failed") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
