import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// MyGoals.jsx
// Refined styling to more closely match the provided screenshot.
// - tighter spacing, larger rounded cards (rounded-2xl)
// - softer shadows and light-gray stat panels
// - pill category badges with subtle borders
// - improved toggle switch visuals
// - progress bar and action button colors tweaked
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

const sampleGoals = [
  {
    id: 1,
    title: "Run 5K Every Morning",
    category: "Fitness",
    description: "Building cardiovascular endurance and starting my day with energy",
    streak: 15,
    xp: 450,
    followers: 12,
    progress: 47,
    status: "active",
    isPublic: true,
  },
  {
    id: 2,
    title: "Learn Spanish for 30 Minutes Daily",
    category: "Skill",
    description: "Preparing for my trip to Spain and improving my language skills",
    streak: 23,
    xp: 690,
    followers: 8,
    progress: 76,
    status: "active",
    isPublic: true,
  },
  {
    id: 3,
    title: "Meditate for 15 Minutes Daily",
    category: "Health",
    description: "Improving mental clarity and reducing stress through mindfulness",
    streak: 32,
    xp: 960,
    followers: 15,
    progress: 89,
    status: "active",
    isPublic: false,
  },
  {
    id: 4,
    title: "Read 20 Pages a Day",
    category: "Habit",
    description: "Finish more books and expand knowledge",
    streak: 5,
    xp: 120,
    followers: 4,
    progress: 22,
    status: "completed",
    isPublic: true,
  },
];

function CategoryBadge({ category }) {
  const map = {
    Fitness: "bg-green-50 text-green-700 border border-green-100",
    Skill: "bg-blue-50 text-blue-700 border border-blue-100",
    Health: "bg-red-50 text-red-700 border border-red-100",
    Habit: "bg-violet-50 text-violet-700 border border-violet-100",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-md ${map[category] || "bg-gray-50 text-gray-700 border border-gray-100"}`}>{category}</span>;
}

export default function MyGoals() {
    const navigate = useNavigate();
  const [goals, setGoals] = useState(sampleGoals);
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'completed' | 'all'

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
  function editGoal(id) { alert("Edit " + id); }
  function deleteGoal(id) {
    if (!confirm("Delete this goal?")) return;
    setGoals((prev) => prev.filter((g) => g.id !== id));
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
            <h1 className="text-lg font-semibold flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm font-medium">GF</div>
              My Goals
            </h1>
          </div>

<Link
      to="/create-goal"
      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-white-100 transition-colors"
    >               
                <span className="hidden sm:inline">Create Goal</span>
                <PlusIcon />
                
              </Link>        </div>

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
                    <h3 className="font-semibold text-gray-900">{g.title}</h3>
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
                  <div className="text-orange-600 font-medium flex items-center"><IconStreak />{g.streak}</div>
                  <div className="text-xs text-gray-400">Current Streak</div>
                </div>

                <div className="flex-1">
                  <div className="text-violet-600 font-medium flex items-center"><IconXP />{g.xp}</div>
                  <div className="text-xs text-gray-400">Total XP</div>
                </div>

                <div className="flex-1">
                  <div className="text-cyan-600 font-medium flex items-center"><IconFollowers />{g.followers}</div>
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
                <button onClick={() => logProgress(g.id)} className="flex-1 px-4 py-2 bg-black text-white rounded-md shadow-sm">+ Log Progress</button>
                <button onClick={() => viewGoal(g.id)} className="px-4 py-2 border rounded-md text-sm">View</button>
                <button onClick={() => editGoal(g.id)} className="px-3 py-2 border rounded-md text-sm">✎</button>
                <button onClick={() => deleteGoal(g.id)} className="px-3 py-2 border rounded-md text-sm">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
