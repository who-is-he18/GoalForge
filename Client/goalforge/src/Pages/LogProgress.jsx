// src/pages/LogProgress.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function LogProgress() {
  const { id: goalId } = useParams(); // route: /log-progress/:id
  const navigate = useNavigate();

  // form state
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null); // "image" | "video" | null
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
        if (!mounted) return;
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

  // cleanup preview object URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }

    // validate size (10MB default)
    const maxBytes = 10 * 1024 * 1024;
    if (f.size > maxBytes) {
      setMessage("File is too large. Max 10MB.");
      return;
    }

    // validate type
    const mime = f.type || "";
    if (!mime.startsWith("image/") && !mime.startsWith("video/")) {
      setMessage("Unsupported file type. Use images or videos.");
      return;
    }

    setMessage("");
    setFile(f);

    // preview
    try {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      setPreviewType(mime.startsWith("image/") ? "image" : "video");
    } catch (err) {
      console.error("Preview creation failed", err);
      setPreviewUrl(null);
      setPreviewType(null);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setPreviewType(null);
    setMessage("");
    // also reset file input DOM if you keep a ref (not required here)
  };

  const handleCancel = () => {
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
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const payloadBase = {
        goal_id: Number(goalId),
        date: today,
        note: note.trim(),
        xp_earned: 15,
      };

      let res;
      // If a file is present, send multipart/form-data
      if (file) {
        const form = new FormData();
        form.append("goal_id", payloadBase.goal_id);
        form.append("date", payloadBase.date);
        form.append("note", payloadBase.note);
        form.append("xp_earned", payloadBase.xp_earned);
        // append file under 'file' — change this key if your backend expects something else
        form.append("file", file);

        // Do NOT set Content-Type manually — axios will set the multipart boundary
        res = await api.post("/progress", form);
      } else {
        // No file -> JSON body
        res = await api.post("/progress", payloadBase);
      }

      // server response shape in your app: { progress: ..., goal: ... }
      const created = res.data?.progress;
      const updatedGoal = res.data?.goal;

      // dispatch events so other pages can update
      if (updatedGoal) {
        window.dispatchEvent(new CustomEvent("goalUpdated", { detail: { goal: updatedGoal } }));
      }
      if (created) {
        window.dispatchEvent(new CustomEvent("progressCreated", { detail: { progress: created, goalId: Number(goalId) } }));
      } else {
        window.dispatchEvent(new CustomEvent("progressCreated", { detail: { goalId: Number(goalId) } }));
      }

      setMessage("Your progress has been logged successfully!");
      setNote("");
      handleRemoveFile();

      // short delay so user sees the message, then go back to goal list or view
      setTimeout(() => {
        // navigate to the goal view if you have it, otherwise my-goals
        // prefer /goals/:id if you have that route
        if (window.location.pathname.includes("/log-progress")) {
          navigate("/my-goals");
        } else {
          navigate("/my-goals");
        }
      }, 700);
    } catch (err) {
      console.error("Error creating progress:", err);
      let userMsg = "Failed to log progress. Please try again.";
      if (err?.response?.data?.message) userMsg = err.response.data.message;
      setMessage(userMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl border border-gray-200">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Log Today's Progress</h2>
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
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md cursor-pointer bg-white text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{file ? file.name : "Choose file"}</span>
                <input id="file-upload" type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
              </label>

              {file && (
                <button type="button" onClick={handleRemoveFile} className="px-3 py-1 text-xs rounded-md border border-gray-200 bg-white hover:bg-gray-50">
                  Remove
                </button>
              )}
            </div>

            {/* Preview */}
            {previewUrl && previewType === "image" && (
              <div className="mt-3 w-full rounded-md overflow-hidden border border-gray-100">
                <img src={previewUrl} alt="preview" className="w-full h-auto object-contain max-h-72" />
              </div>
            )}
            {previewUrl && previewType === "video" && (
              <div className="mt-3 w-full rounded-md overflow-hidden border border-gray-100">
                <video src={previewUrl} controls className="w-full max-h-72" />
              </div>
            )}

            <div className="mt-2 text-xs text-gray-400">Images and videos up to 10MB (server must accept multipart form uploads)</div>
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
            <p className={`mt-2 text-xs text-center ${message.startsWith("Failed") || message.startsWith("File is too") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
