// src/pages/CreateGoalPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    // cleanup object URL on unmount or when file changes
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  function handleBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/my-goals");
  }

  function onSelectImage(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    // optional: validate file size (e.g., max 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (f.size > maxBytes) {
      toast.error("Image is too large (max 5MB).");
      return;
    }

    // optional: validate type
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(f.type)) {
      toast.error("Unsupported image type. Use JPG, PNG, GIF or WEBP.");
      return;
    }

    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImagePreviewUrl(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to create a goal.");
        navigate("/login");
        return;
      }

      // Use FormData to allow file upload
      const fd = new FormData();
      fd.append("title", goalTitle);
      fd.append("description", description);
      fd.append("category", category);
      fd.append("start_date", startDate);
      fd.append("end_date", endDate || "");
      fd.append("frequency", frequency);
      fd.append("is_public", isPublic ? "true" : "false");

      if (imageFile) {
        fd.append("image", imageFile);
      }

      // Do not set Content-Type header — axios will set the correct multipart boundary.
      const res = await api.post("/goals", fd);
      toast.success("Goal created successfully");
      // navigate to my-goals or the created goal page
      const created = res.data;
      setTimeout(() => {
        if (created && created.id) {
          navigate("/my-goals");
        } else {
          navigate("/my-goals");
        }
      }, 700);
    } catch (err) {
      console.error(err);
      let msg = "Goal creation failed. Please try again.";
      if (err.response && err.response.data) {
        msg = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-8 py-10">
      <div className="max-w-4xl mx-auto flex items-center gap-3 mb-6">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
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

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Goal Title <span className="text-red-500">*</span></label>
            <input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="e.g., Run 5K every morning" required className="w-full bg-gray-50 placeholder-gray-400 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none focus:ring-0" />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details..." rows={3} className="w-full bg-gray-50 placeholder-gray-400 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none focus:ring-0" />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none">
              <option>General</option>
              <option>Fitness</option>
              <option>Career</option>
              <option>Education</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Start Date <span className="text-red-500">*</span></label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full bg-gray-50 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">End Date (Optional)</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-gray-50 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-gray-50 text-sm rounded-lg px-4 py-3 border border-gray-100 focus:outline-none">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          {/* Image upload */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">Cover image (optional)</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer bg-white text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>{imageFile ? imageFile.name : "Choose image"}</span>
                <input type="file" accept="image/*" onChange={onSelectImage} className="hidden" />
              </label>

              {imagePreviewUrl && (
                <div className="w-28 h-20 rounded-md overflow-hidden border border-gray-100">
                  <img src={imagePreviewUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">Optional. JPG, PNG, GIF, WEBP. Max 5MB.</p>
          </div>

          <div className="mt-5 border border-gray-100 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Make this goal public</p>
              <p className="text-xs text-gray-500 mt-1">Public goals can be seen by other users and appear in the community feed</p>
            </div>

            <button type="button" onClick={() => setIsPublic(s => !s)} aria-pressed={isPublic} className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${isPublic ? "bg-black" : "bg-gray-200"}`}>
              <span className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform ${isPublic ? "translate-x-5" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/my-goals")} disabled={loading} className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 shadow-sm">
              {loading ? "Creating…" : "Create Goal"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
