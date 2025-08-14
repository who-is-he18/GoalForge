// MyGoalsWithEditModal.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";


/* ---------- Icons ---------- */
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconStreak = () => (
  <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 6 4 7 4 11c0 5 8 11 8 11s8-6 8-11c0-4-4-5-8-9z" fill="#FB923C"/>
  </svg>
);
const IconXP = () => (
  <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" fill="#8B5CF6"/>
  </svg>
);
const IconFollowers = () => (
  <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0H4z" fill="#06B6D4"/>
  </svg>
);

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

/* ---------- Dummy sample data (so this file runs standalone) ---------- */
const sampleGoals = [
  {
    id: 6,
    title: "Read 20 Pages a Day",
    category: "Habit",
    description: "Finish more books and expand knowledge",
    streak: 5,
    xp: 120,
    followers: 4,
    progress: 22,
    status: "completed",
    isPublic: true,

    author: "Alex Johnson",
    handle: "@alex_reads",
    frequency: "daily",
    start_date: "2025-01-10",
    end_date: "2025-06-10",
    tag: "Learning",
    timeAgo: "30d ago",
    content: "Just finished 'Atomic Habits' — feeling motivated!",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794", // book photo
    totalDays: 50,
    createdAt: "2025-01-10T08:00:00Z",
    likes: 45,
    comments: 12,
    liked: false,
    progress_logs: [
      {
        id: 601,
        goal_id: 6,
        date: "2025-01-15",
        note: "Read 'Deep Work' for 25 minutes. Great insights.",
        media_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
        xp_earned: 5,
        created_at: "2025-01-15T09:00:00Z"
      },
      {
        id: 602,
        goal_id: 6,
        date: "2025-02-01",
        note: "Finished 'The Alchemist' in 3 days!",
        media_url: "https://images.unsplash.com/photo-1471102204082-0d7a5be3d9a5",
        xp_earned: 10,
        created_at: "2025-02-01T14:30:00Z"
      }
    ]
  },
  {
    id: 7,
    title: "Cook a New Recipe Weekly",
    category: "Lifestyle",
    description: "Experiment with different cuisines every week to expand cooking skills.",
    streak: 6,
    xp: 140,
    followers: 7,
    progress: 40,
    status: "active",
    isPublic: false,

    author: "Samantha Lee",
    handle: "@samcooks",
    frequency: "weekly",
    start_date: "2025-03-01",
    end_date: "2025-09-01",
    tag: "Creativity",
    timeAgo: "14d ago",
    content: "Perfected a homemade sourdough loaf today!",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
    totalDays: 14,
    createdAt: "2025-03-01T10:00:00Z",
    likes: 74,
    comments: 15,
    liked: true,
    progress_logs: [
      {
        id: 701,
        goal_id: 7,
        date: "2025-03-05",
        note: "Tried Indian butter chicken—rich and flavorful.",
        media_url: "https://images.unsplash.com/photo-1617196039897-99a9ee1e5d49",
        xp_earned: 7,
        created_at: "2025-03-05T17:00:00Z"
      },
      {
        id: 702,
        goal_id: 7,
        date: "2025-03-12",
        note: "Cooked authentic Spanish paella—lots of seafood!",
        media_url: "https://images.unsplash.com/photo-1607270999456-f83c7d9d7d74",
        xp_earned: 9,
        created_at: "2025-03-12T18:15:00Z"
      }
    ]
  },
  {
    id: 8,
    title: "Read 20 Pages a Day",
    category: "Habit",
    description: "Finish more books and expand knowledge",
    streak: 8,
    xp: 200,
    followers: 10,
    progress: 60,
    status: "active",
    isPublic: true,

    author: "Michael Chen",
    handle: "@mike_reads",
    frequency: "daily",
    start_date: "2025-02-01",
    end_date: "2025-08-01",
    tag: "Self-Improvement",
    timeAgo: "7d ago",
    content: "Dived into 'Sapiens' — mind-blowing so far.",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    totalDays: 100,
    createdAt: "2025-02-01T09:00:00Z",
    likes: 80,
    comments: 20,
    liked: false,
    progress_logs: [
      {
        id: 801,
        goal_id: 8,
        date: "2025-02-10",
        note: "Read 30 pages of 'Thinking, Fast and Slow'.",
        media_url: "https://images.unsplash.com/photo-1581091215367-70d3b7e63b29",
        xp_earned: 8,
        created_at: "2025-02-10T10:00:00Z"
      },
      {
        id: 802,
        goal_id: 8,
        date: "2025-03-01",
        note: "Completed 'Man’s Search for Meaning'.",
        media_url: "https://images.unsplash.com/photo-1602526434204-f7d2f6a8a4a6",
        xp_earned: 12,
        created_at: "2025-03-01T12:30:00Z"
      }
    ]
  },
  {
    id: 9,
    title: "Cook a New Recipe Weekly",
    category: "Lifestyle",
    description: "Experiment with different cuisines every week to expand cooking skills.",
    streak: 4,
    xp: 100,
    followers: 5,
    progress: 18,
    status: "completed",
    isPublic: false,

    author: "Emma Davis",
    handle: "@emmacooks",
    frequency: "weekly",
    start_date: "2025-04-01",
    end_date: "2025-09-01",
    tag: "Cooking",
    timeAgo: "2d ago",
    content: "Mastered homemade sushi rolls—so fun to make!",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    totalDays: 12,
    createdAt: "2025-04-01T10:00:00Z",
    likes: 90,
    comments: 18,
    liked: true,
    progress_logs: [
      {
        id: 901,
        goal_id: 9,
        date: "2025-04-05",
        note: "Tried making mac and cheese with truffle oil.",
        media_url: "https://images.unsplash.com/photo-1543353071-087092ec393b",
        xp_earned: 6,
        created_at: "2025-04-05T17:00:00Z"
      },
      {
        id: 902,
        goal_id: 9,
        date: "2025-04-12",
        note: "Cooked beef bourguignon — slow but worth it.",
        media_url: "https://images.unsplash.com/photo-1562967916-eb82221dfb30",
        xp_earned: 9,
        created_at: "2025-04-12T18:20:00Z"
      }
    ]
  }
];

/* ---------- Edit Modal Component ---------- */
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

  // sync when modal opens or goal changes
  React.useEffect(() => {
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
    }
  }, [open, goal]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // build updated object; preserve other fields from goal
    const updated = { ...goal, ...form };
    onSave(updated);
  }

  return (
    // modal backdrop
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl mt-12">
        {/* header */}
        <div className="flex flex-col px-6 py-4">
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-bold">Edit Goal</h2>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
  </div>
  <p className="text-sm text-gray-500 mt-1">
    Make changes to your goal. Click save when you're done.
  </p>
</div>


        <form onSubmit={handleSubmit} className="px-6 py-5 max-h-[80vh] overflow-auto">

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-bold block mb-1">Goal Title *</label>
              <input name="title" value={form.title} onChange={handleChange}className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0"
required />
            </div>

            <div>
              <label className="text-sm font-bold block mb-1">Description (Optional)</label>
<textarea
  name="description"
  value={form.description}
  onChange={handleChange}
className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0"  rows={3}
/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0"
 >
                  <option>Fitness</option>
                  <option>Skill</option>
                  <option>Health</option>
                  <option>Habit</option>
                  <option>Lifestyle</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold block mb-1">Frequency</label>
                <select name="frequency" value={form.frequency} onChange={handleChange}  className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0"
 >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block mb-1">Start Date *</label>
                <input name="start_date" value={form.start_date} onChange={handleChange} type="date"   className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0"
 />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">End Date (Optional)</label>
                <input name="end_date" value={form.end_date} onChange={handleChange} type="date"   className="w-full rounded-md px-3 py-2 bg-gray-100 focus:border-gray-500 focus:ring-0"
 />
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

          {/* footer actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-bold" >Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-black text-white text-sm font-bold">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Main Page Component ---------- */
export default function MyGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState(sampleGoals);
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'completed' | 'all'

  // modal state
  const [editingGoal, setEditingGoal] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const visibleGoals = useMemo(() => {
    if (activeTab === "all") return goals;
    return goals.filter((g) => g.status === activeTab);
  }, [goals, activeTab]);

  function togglePublic(id) {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, isPublic: !g.isPublic } : g));
    // Note: persist to backend later
  }

  function logProgress(id) { alert("Log Progress clicked for goal id " + id + " (not implemented)"); }
  function viewGoal(id) { alert("View " + id); }

  // open modal and pass goal
  function editGoal(id) {
    const g = goals.find((x) => x.id === id);
    if (!g) return;
    setEditingGoal(g);
    setModalOpen(true);
  }

  function handleDelete(id) {
    if (!confirm("Delete this goal?")) return;
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  // save updated goal from modal
  function handleSave(updatedGoal) {
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? { ...g, ...updatedGoal } : g)));
    setModalOpen(false);
    setEditingGoal(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
                <button
      onClick={() => navigate(-1)}
      className="text-sm text-gray-600 flex items-center gap-2"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18l-6-6 6-6"
          stroke="#111827"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm">Back</span>
    </button>
            <h1 className="text-lg font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold">GF</div>
              My Goals
            </h1>
          </div>

          <Link
            to="/create-goal"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-white-100 transition-colors"
          >
            <span className="hidden sm:inline">Create Goal</span>
            <PlusIcon />
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-full text-sm ${activeTab === "active" ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>
              Active ({goals.filter(g=>g.status==='active').length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-full text-sm ${activeTab === "completed" ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>
              Completed ({goals.filter(g=>g.status==='completed').length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm ${activeTab === "all" ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>
              All ({goals.length})
            </button>
          </div>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleGoals.map((g) => (
            <div key={g.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
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

              {/* Stats box */}
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
                  <div className="text-cyan-600 font-bold flex items-center"><IconFollowers />{g.followers}</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <div>Progress</div>
                  <div>{g.progress}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full" style={{ width: `${g.progress}%`, background: 'linear-gradient(90deg,#0b1220,#000)' }}></div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-3">
                <Link to={`/log-progress/${g.id}`}       className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-white-100 transition-colors">+ Log Progress</Link>

                <Link
  to={`/goal/${g.id}`}
  state={{ goal: g }}
  className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-100"
>
  <HiOutlineEye className="w-4 h-4" />
  View
</Link>

<button
  onClick={() => editGoal(g.id)}
  className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-white"
>
  <HiOutlinePencil className="w-4 h-4" />
</button>

<button
  onClick={() => handleDelete(g.id)}
  className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
>
  <HiOutlineTrash className="w-4 h-4 text-black font-bold" />
</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit modal */}
      <EditGoalModal
        open={isModalOpen}
        onClose={() => { setModalOpen(false); setEditingGoal(null); }}
        goal={editingGoal}
        onSave={handleSave}
      />
    </div>
  );
}
