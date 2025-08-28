// MyGoalsWithEditModal.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




/* ---------- Icons ---------- */
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconStreak = () => (/* ...same as before... */ <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 6 4 7 4 11c0 5 8 11 8 11s8-6 8-11c0-4-4-5-8-9z" fill="#FB923C"/></svg>);
const IconXP = () => (/* ... */ <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" fill="#8B5CF6"/></svg>);
const IconFollowers = () => (/* ... */ <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0H4z" fill="#06B6D4"/></svg>);

/* ---------- Category badge ---------- */
function CategoryBadge({ category }) {
  const map = {
    Fitness: "bg-green-50 text-green-700 border border-green-100",
    Skill: "bg-blue-50 text-blue-700 border border-blue-100",
    Health: "bg-red-50 text-red-700 border border-red-100",
    Habit: "bg-violet-50 text-violet-700 border border-violet-100",
    Lifestyle: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-md ${map[category] || "bg-gray-50 text-gray-700 border border-gray-100"}`}>{category}</span>;
}

/* ---------- Edit Modal Component (unchanged) ---------- */
function EditGoalModal({ open, onClose, goal, onSave }) {
  const [form, setForm] = useState(() => ({
    title: "",
    description: "",
    category: "Fitness",
    start_date: "",
    end_date: "",
    frequency: "Daily",
    isPublic: false,
    status: "active",
  }));
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (open && goal) {
      setForm({
        title: goal.title || "",
        description: goal.description || "",
        category: goal.category || "Fitness",
        start_date: goal.start_date || "",
        end_date: goal.end_date || "",
        frequency: goal.frequency || "Daily",
        isPublic: !!goal.isPublic,
        status: goal.status || "active",
      });
      setPreviewUrl(goal.image_url || null);
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [open, goal]);

  if (!open) return null;


  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  function onPickFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setRemoveImage(false);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  }

  function handleRemoveImageToggle() {
    setImageFile(null);
    setPreviewUrl(null);
    setRemoveImage((s) => !s);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const updated = { ...goal, ...form };
    // Pass imageFile and removeImage flag to parent so parent can decide FormData vs JSON
    onSave(updated, imageFile, removeImage);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl mt-12">
        <div className="flex flex-col px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Edit Goal</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Make changes to your goal. Click save when you're done.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 max-h-[80vh] overflow-auto">
          <div className="grid grid-cols-1 gap-4">
            
            <div>
              <label className="text-sm font-bold block mb-1">Goal Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0" required />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1">Description (Optional)</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0">
                  <option>Fitness</option>
                  <option>Skill</option>
                  <option>Health</option>
                  <option>Habit</option>
                  <option>Lifestyle</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Frequency</label>
                <select name="frequency" value={form.frequency} onChange={handleChange} className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block mb-1">Start Date *</label>
                <input name="start_date" value={form.start_date} onChange={handleChange} type="date" className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0" />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">End Date (Optional)</label>
                <input name="end_date" value={form.end_date} onChange={handleChange} type="date" className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-3">
                <input name="isPublic" type="checkbox" checked={form.isPublic} onChange={handleChange} className="h-4 w-4" />
                <div>
                  <div className="text-sm font-bold">Make this goal public</div>
                  <div className="text-xs text-gray-500">Public goals can be seen by other users and appear in the community feed</div>
                </div>
              </label>
            </div>
          </div>
            <div className="mt-4">
                        <label className="text-sm font-bold block mb-1">Cover image</label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer bg-white text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>{imageFile ? imageFile.name : (previewUrl ? "Change image" : "Choose image")}</span>
                  <input type="file" accept="image/*" onChange={onPickFile} className="hidden" />
                </label>

                <button type="button" onClick={handleRemoveImageToggle} className={`px-3 py-2 rounded-md border ${removeImage ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white'}`}>
                  {removeImage ? "Will remove" : (previewUrl ? "Remove" : "No image")}
                </button>

                {previewUrl && (
                  <div className="w-28 h-20 rounded-md overflow-hidden border border-gray-100">
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-2">Replace or remove the image. Max 5MB.</div>
            </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-black text-white text-sm font-bold">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ---------- helpers (add near top of file) ----------
function daysBetweenInclusive(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.max(0, Math.round((db - da) / msPerDay)) + 1; // inclusive
}

function weeksBetweenInclusive(a, b) {
  // count calendar weeks (floor of days/7) but ensure at least 1 if same week
  const days = daysBetweenInclusive(a, b);
  return Math.max(1, Math.ceil(days / 7));
}

function monthsBetweenInclusive(a, b) {
  // count months inclusive, e.g. Feb1 -> Apr1 = 3 months
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
  return Math.max(1, months);
}

// compute expected periods for a goal between start and end (or today if no end)
function computeTotalPeriodsForGoal(goal) {
  // parse date strings safely
  const parseDate = (d) => (d ? new Date(d) : null);
  const start = parseDate(goal.start_date || goal.raw?.start_date);
  if (!start || Number.isNaN(start.getTime())) return 0;

  const endRaw = goal.end_date || goal.raw?.end_date;
  const now = new Date();
  const end = endRaw ? new Date(endRaw) : now;

  const freq = (goal.frequency || goal.raw?.frequency || "Daily").toLowerCase();
  if (freq.startsWith("daily")) {
    return daysBetweenInclusive(start, end);
  } else if (freq.startsWith("week")) {
    return weeksBetweenInclusive(start, end);
  } else if (freq.startsWith("month")) {
    return monthsBetweenInclusive(start, end);
  } else {
    // fallback to days
    return daysBetweenInclusive(start, end);
  }
}

/* ---------- normalize backend goal -> UI goal ---------- */
// normalize backend goal -> UI goal (fixed status logic)
function normalizeGoal(apiGoal) {
  const parseDateOnly = (d) => {
    if (!d) return null;
    // Accept Date object or date string
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime && dt.getTime())) return null;
    // Normalize to local date (strip time)
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  const today = (() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  })();

  const endDateObj = parseDateOnly(apiGoal.end_date || apiGoal.endDate || apiGoal.endDateAt);

  // status: completed only if end_date exists AND it is strictly before today
  const status = apiGoal.status
    ? apiGoal.status
    : endDateObj && endDateObj < today
    ? "completed"
    : "active";

  return {
    id: apiGoal.id,
    title: apiGoal.title,
    description: apiGoal.description,
    category: apiGoal.category || "General",
    start_date: apiGoal.start_date || apiGoal.startDate || "",
    end_date: apiGoal.end_date || apiGoal.endDate || null,
    frequency: apiGoal.frequency || "Daily",
    isPublic: apiGoal.is_public ?? apiGoal.isPublic ?? false,
    status,
    streak: `${apiGoal.streak_count || 0} day streak`,
    xp: apiGoal.xp || 0,
    followers: apiGoal.followers || 0,
    progress: apiGoal.progress_percent ?? apiGoal.progress ?? 0,
    user_id: apiGoal.user?.id ?? apiGoal.user_id,
    raw: apiGoal,
    image: apiGoal.image_url || "https://i.pinimg.com/1200x/80/7f/b5/807fb5c3c5efb50dd303ae17e242ac96.jpg",  
  };
}


/* ---------- Main Page Component ---------- */
export default function MyGoals({ currentUser }) {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'completed' | 'all'

  const [editingGoal, setEditingGoal] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  // Map: goalId -> number of followers
const [followersCountMap, setFollowersCountMap] = useState({});


  const visibleGoals = useMemo(() => {
    if (activeTab === "all") return goals;
    return goals.filter((g) => g.status === activeTab);
  }, [goals, activeTab]);

  // ---------- Fetch the current user's goals (robust) ----------
  const fetchGoals = useCallback(async () => {
    if (!currentUser || !currentUser.id) {
      setGoals([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Primary attempt: ask backend for this user's goals
      const res = await api.get("/goals", { params: { user_id: currentUser.id } });

      // Normalize different possible response shapes
      const rawArr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.goals)
        ? res.data.goals
        : typeof res.data === "object" && res.data !== null && Array.isArray(res.data.data)
        ? res.data.data
        : [];

      // Filter client-side to be 100% sure we only keep goals owned by currentUser
      const owned = rawArr.filter((g) => {
        const ownerId = g.user?.id ?? g.user_id ?? g.userId ?? null;
        return ownerId === currentUser.id;
      });

      const normalized = owned.map(normalizeGoal);
      setGoals(normalized);
      fetchProgressAndApply(normalized);

    } catch (err) {
      console.error("Failed to fetch my goals", err);
      setError("Failed to load your goals.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);
// fetch a single goal and upsert into state
const fetchGoalById = useCallback(async (id) => {
  if (!id) return;
  try {
    const res = await api.get(`/goals/${id}`);
    const raw = res.data;
    const normalized = normalizeGoal(raw);
    setGoals((prev) => {
      // if goal exists, replace it; otherwise append to front
      const found = prev.some((g) => g.id === normalized.id);
      if (found) return prev.map((g) => (g.id === normalized.id ? { ...g, ...normalized } : g));
      return [normalized, ...prev];
    });
    fetchProgressAndApply([normalized]);
  } catch (err) {
    console.error("Failed to fetch single goal", id, err);
    // optional: fallback to re-fetch all goals
    // fetchGoals();
  }
}, [/* no deps or include normalizeGoal/fetchGoals if defined externally */]);


useEffect(() => {
  const handler = (e) => {
    const id = e?.detail?.goalId;
    if (!id) return;
    // update only the changed goal
    fetchGoalById(id);
  };
  window.addEventListener("progressCreated", handler);
  return () => window.removeEventListener("progressCreated", handler);
}, [fetchGoalById]);

useEffect(() => {
  const onGoalUpdated = (e) => {
    const raw = e?.detail?.goal;
    if (!raw) return;
    const normalized = normalizeGoal(raw);
    setGoals(prev => prev.map(g => g.id === normalized.id ? { ...g, ...normalized } : g));
  };

  const onProgressCreated = (e) => {
    const id = e?.detail?.goalId;
    if (!id) return;
    fetchGoalById(id); // fallback if server didn't return goal
  };

  window.addEventListener("goalUpdated", onGoalUpdated);
  window.addEventListener("progressCreated", onProgressCreated);
  return () => {
    window.removeEventListener("goalUpdated", onGoalUpdated);
    window.removeEventListener("progressCreated", onProgressCreated);
  };
}, [fetchGoalById]);


// ---------- after fetchGoals(), fetch progress logs and compute per-goal metrics ----------
// ---------- after fetchGoals(), fetch progress logs and compute per-goal metrics ----------
const fetchProgressAndApply = useCallback(async (goalsArr) => {
  if (!goalsArr || goalsArr.length === 0) return;

  try {
    // fetch progress logs (prefer server-side filtering if available)
    // If your API supports filtering, do: api.get('/progress', { params: { goal_id: [id1,id2] } })
    const res = await api.get("/progress");
    const rawProgress = Array.isArray(res.data) ? res.data : res.data?.progress || [];

    // Build map: goalId -> list of progress records
    const progressMap = rawProgress.reduce((acc, p) => {
      if (!p || p.goal_id == null) return acc;
      if (!acc[p.goal_id]) acc[p.goal_id] = [];
      acc[p.goal_id].push(p);
      return acc;
    }, {});

    // collect IDs that reached completion this run so we can persist them
    const toMarkCompleted = [];

    // Update each goal with computed progress percent and total xp
    setGoals((prevGoals) =>
      prevGoals.map((g) => {
        const records = progressMap[g.id] || [];

        // distinct dates logged (use date string only)
        const uniqueDates = new Set(records.map((r) => (r.date ? r.date.split("T")[0] : String(r.date))));
        const entriesCount = uniqueDates.size;

        // total XP from those records
        const totalXp = records.reduce((s, r) => s + (Number(r.xp_earned) || 0), 0);

        const totalPeriods = computeTotalPeriodsForGoal(g);
        const progressPct = totalPeriods > 0 ? Math.round((entriesCount / totalPeriods) * 100) : 0;
        const boundedProgress = Math.min(100, Math.max(0, progressPct));

        // If we reached 100% and goal isn't already completed, mark it locally and queue for backend update
        const newStatus = boundedProgress >= 100 ? "completed" : g.status;
        if (boundedProgress >= 100 && g.status !== "completed") {
          toMarkCompleted.push(g.id);
        }

        return {
          ...g,
          progress: boundedProgress,
          xp: totalXp,
          progress_logs: records,
          status: newStatus,
        };
      })
    );

    // persist status changes for newly completed goals (non-blocking UI)
    if (toMarkCompleted.length > 0) {
      // fire-and-forget but await so we can refresh each updated goal afterwards
      await Promise.all(
        toMarkCompleted.map(async (id) => {
          try {
            await api.patch(`/goals/${id}`, { status: "completed" });
            // refresh authoritative goal data (progress/xp comes from progress endpoint)
            if (typeof fetchGoalById === "function") {
              fetchGoalById(id);
            }
          } catch (err) {
            // don't crash UI on failure — log for debugging
            console.error("Failed to persist completed status for goal", id, err);
          }
        })
      );
    }
  } catch (err) {
    console.error("Failed to fetch progress logs:", err);
    // if fetch fails we don't block the goals UI; optionally set an error state
  }
}, [fetchGoalById]);



  // toggle public (optimistic)
// Replace your current togglePublic with this
async function togglePublic(id) {
  const before = goals.find((g) => g.id === id);
  if (!before) return;

  // optimistic UI flip
  setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, isPublic: !g.isPublic } : g)));

  try {
    const res = await api.patch(`/goals/${id}`, { is_public: !before.isPublic });
    const updated = normalizeGoal(
      res.data || { ...(before?.raw || {}), is_public: !before.isPublic }
    );

    // merge server response while preserving computed fields like progress/xp/logs
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        return {
          ...g, // keep existing computed props by default
          ...updated, // overwrite with server-sent fields
          progress: g.progress ?? updated.progress ?? 0,
          xp: g.xp ?? updated.xp ?? 0,
          progress_logs: g.progress_logs ?? updated.progress_logs ?? [],
        };
      })
    );
  } catch (err) {
    console.error("Failed to toggle public", err);
    // revert optimistic change
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, isPublic: before.isPublic } : g)));
  }
}


  function logProgress(id) {
    navigate(`/log-progress/${id}`);
  }
  function viewGoal(id) {
    navigate(`/goal/${id}`, { state: { goal: goals.find(g => g.id === id) } });
  }

  function editGoal(id) {
    const g = goals.find((x) => x.id === id);
    if (!g) return;
    setEditingGoal(g);
    setModalOpen(true);
  }


// make sure at top of file:
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

async function handleDelete(goalId) {
  // keep a copy so we can restore on failure
  const prevGoals = goals;

  // show a non-auto-closing toast with confirmation UI
  const confirmToastId = toast(
    ({ closeToast }) => {
      // Handler invoked when user confirms deletion
      const onConfirm = async () => {
        // optimistic UI: remove immediately
        setGoals((p) => p.filter((g) => g.id !== goalId));
        setLoading(true);

        // close the confirmation toast
        closeToast();

        try {
          await api.delete(`/goals/${goalId}`);

          // success toast (styled to match your app)
          toast.success("Goal deleted successfully", {
            position: 'top-right',
            autoClose: 2000,
            className: 'rounded-full border border-black shadow-md',
            bodyClassName: 'text-sm font-medium text-white bg-transparent px-4 py-2',
            progressClassName: 'bg-white',
          });

          // small delay so user sees toast, then navigate/show updated view
          setTimeout(() => navigate("/my-goals"), 800);
        } catch (err) {
          console.error(err);
          // restore previous data on error
          setGoals(prevGoals);

          let msg = "Goal deletion failed. Please try again.";
          if (err.response && err.response.data) {
            msg = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
          }
          setError(msg);

          toast.error(msg, {
            position: 'top-right',
            autoClose: 3000,
            className: 'rounded-lg border border-red-100 shadow-sm bg-red-50',
            bodyClassName: 'text-sm text-red-600 px-3 py-2',
            progressClassName: 'bg-red-600',
          });
        } finally {
          setLoading(false);
        }
      };

      // Render confirmation UI (Tailwind classes used in your app)
      return (
        <div className="max-w-xs">
          <div className="text-sm font-medium text-gray-800">Delete this goal?</div>
          <div className="text-xs text-gray-500 mt-1">This action cannot be undone.</div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={onConfirm}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-black text-white text-sm font-medium shadow-sm hover:opacity-95"
            >
              Delete
            </button>

            <button
              onClick={() => closeToast()}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm text-gray-600 border border-transparent hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    },
    {
      // keep this confirm toast open until user interacts
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
      position: 'top-right',
    }
  );
}

// parent component scope
async function handleSave(updatedGoal, imageFile, removeImage) {
  try {
    // If we need to upload image or remove image, use FormData (multipart)
    if (imageFile || removeImage) {
      const fd = new FormData();
      fd.append("title", updatedGoal.title);
      fd.append("description", updatedGoal.description || "");
      fd.append("category", updatedGoal.category || "");
      fd.append("start_date", updatedGoal.start_date || "");
      fd.append("end_date", updatedGoal.end_date || "");
      fd.append("frequency", updatedGoal.frequency || "");
      fd.append("is_public", updatedGoal.isPublic ? "true" : "false");

      if (imageFile) fd.append("image", imageFile);
      if (removeImage) fd.append("remove_image", "1");

      const res = await api.patch(`/goals/${updatedGoal.id}`, fd);
      const fresh = res.data;
      setGoals((prev) => prev.map((g) => (g.id === fresh.id ? fresh : g)));
    } else {
      // simple JSON patch (no file)
      const payload = {
        title: updatedGoal.title,
        description: updatedGoal.description,
        category: updatedGoal.category,
        start_date: updatedGoal.start_date,
        end_date: updatedGoal.end_date || null,
        frequency: updatedGoal.frequency,
        is_public: !!updatedGoal.isPublic,
      };
      const res = await api.patch(`/goals/${updatedGoal.id}`, payload);
      const fresh = res.data;
      setGoals((prev) => prev.map((g) => (g.id === fresh.id ? fresh : g)));
    }

    setModalOpen(false);
    setEditingGoal(null);

    // 🔄 Force immediate page refresh
    window.location.reload();

  } catch (err) {
    console.error("Failed to save goal", err);
    toast.error("Failed to save changes");
  }
}


useEffect(() => {
  let mounted = true;

  // load all followers and build counts
  const loadFollowerCounts = async () => {
    try {
      const res = await api.get("/followers");
      if (!mounted) return;
      const list = res.data || [];
      const counts = {};
      list.forEach((f) => {
        // backend uses followed_goal_id per your model
        const goalId = f.followed_goal_id || f.followed_goal || f.followed_goalId;
        if (!goalId) return;
        counts[goalId] = (counts[goalId] || 0) + 1;
      });
      setFollowersCountMap(counts);
    } catch (err) {
      console.error("Failed to load follower counts", err);
    }
  };

  loadFollowerCounts();

  // incremental updates when other pages dispatch followers:changed
  const handler = (e) => {
    // if event contains detail, apply incremental change for performance
    try {
      const detail = e?.detail;
      if (!detail || !detail.goalId) {
        // fallback: reload full counts
        loadFollowerCounts();
        return;
      }

      const { goalId, action } = detail;
      setFollowersCountMap((prev) => {
        const next = { ...prev };
        if (action === "follow") {
          next[goalId] = (next[goalId] || 0) + 1;
        } else if (action === "unfollow") {
          next[goalId] = Math.max(0, (next[goalId] || 1) - 1);
        } else if (action === "follow_rollback") {
          // rollback a failed follow: decrement
          next[goalId] = Math.max(0, (next[goalId] || 1) - 1);
        } else if (action === "unfollow_rollback") {
          // rollback a failed unfollow: increment
          next[goalId] = (next[goalId] || 0) + 1;
        } else {
          // unknown action -> reload to be safe
          loadFollowerCounts();
        }
        return next;
      });
    } catch (err) {
      // on any error just reload full counts
      console.error("Error handling followers:changed event", err);
      loadFollowerCounts();
    }
  };

  window.addEventListener("followers:changed", handler);

  return () => {
    mounted = false;
    window.removeEventListener("followers:changed", handler);
  };
}, []); // one-time subscribe; you can add dependencies if needed


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="text-sm text-gray-600 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-lg font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold">GF</div>
              My Goals
            </h1>
          </div>

          <Link to="/create-goal" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-white-100 transition-colors">
            <span className="hidden sm:inline">Create Goal</span>
            <PlusIcon />
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm">
            <button onClick={() => setActiveTab("active")} className={`px-4 py-2 rounded-full text-sm ${activeTab === "active" ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>Active ({goals.filter(g=>g.status==='active').length})</button>
            <button onClick={() => setActiveTab("completed")} className={`px-4 py-2 rounded-full text-sm ${activeTab === "completed" ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>Completed ({goals.filter(g=>g.status==='completed').length})</button>
            <button onClick={() => setActiveTab("all")} className={`px-4 py-2 rounded-full text-sm ${activeTab === "all" ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>All ({goals.length})</button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" />
            <div className="mt-3 text-sm text-gray-500">Loading your goals…</div>
          </div>
        )}

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleGoals.map((g) => (
<div key={g.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">  {/* Image hero */}
  <div className="w-full h-40 bg-gray-100">
    {g.image ? (
      <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
    )}
  </div>
  <br>
  </br>

              <div className="flex items-start justify-between">
                <div className="pr-4 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{g.title}</h3>
                    <CategoryBadge category={g.category} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{g.description}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={g.isPublic} onChange={() => togglePublic(g.id)} className="sr-only" />
                      <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${g.isPublic ? 'bg-black' : 'bg-gray-200'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${g.isPublic ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </label>
                    <span className="text-xs text-gray-500">{g.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center gap-4 text-sm text-gray-700">
                <div className="flex-1">
                  <div className="text-orange-600 font-bold flex items-center"><IconStreak />{g.streak}</div>
                  <div className="text-xs text-gray-400">Current Streak</div>
                </div>

                <div className="flex-1">
                  <div className="text-violet-600 font-bold flex items-center"><IconXP />{g.xp}</div>
                  <div className="text-xs text-gray-400">Total XP</div>
                </div>

                <div className="flex-1">
                  <div className="text-cyan-600 font-bold flex items-center"><IconFollowers />{followersCountMap[g.id] ?? g.followers ?? 0}
</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
              </div>


              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <div>Progress</div>
                  <div>{g.progress}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full" style={{ width: `${g.progress}%`, background: 'linear-gradient(90deg,#0b1220,#000)' }} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button onClick={() => logProgress(g.id)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-white-100 transition-colors">+ Log Progress</button>

                <button onClick={() => viewGoal(g.id)} className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-100">
                  <HiOutlineEye className="w-4 h-4" />
                  View
                </button>

                <button onClick={() => editGoal(g.id)} className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-white">
                  <HiOutlinePencil className="w-4 h-4" />
                </button>

                <button onClick={() => handleDelete(g.id)} className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                  <HiOutlineTrash className="w-4 h-4 text-black font-bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
            <ToastContainer position="top-right" />
      <EditGoalModal
        open={isModalOpen}
        onClose={() => { setModalOpen(false); setEditingGoal(null); }}
        goal={editingGoal}
        onSave={handleSave}
      />
    </div>
  );
}
