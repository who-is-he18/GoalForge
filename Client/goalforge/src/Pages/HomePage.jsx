import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

// (Icons & small components kept the same as your original file)
const UserIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" /></svg>);
const TargetIcon = () => (<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>);
const PlusIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>);
const SearchIcon = () => (<svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>);
const FlameIcon = () => (<svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2s1.5 2.5 1.5 4.5S12 9 12 9s-1.5-2.5-1.5-4.5S12 2 12 2z" fill="#F97316"/><path d="M6 14c0 3.3137 2.6863 6 6 6s6-2.6863 6-6c0-3.2329-2.7891-5.8546-6-9C8.7891 8.1454 6 10.7671 6 14z" fill="#FB923C"/></svg>);
const Avatar = ({ src, name }) => (
  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm text-black">{name?.[0] || "G"}</div>}
  </div>
);

const TAG_STYLES = {
  Habit: "bg-violet-100 text-violet-700",
  Health: "bg-green-100 text-green-700",
  Hobby: "bg-yellow-100 text-yellow-700",
  default: "bg-gray-100 text-black",
};
function tagClass(tag) { return TAG_STYLES[tag] || TAG_STYLES.default; }

export default function GoalForgeHome() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [commentsByGoal, setCommentsByGoal] = useState({});
  const [openComments, setOpenComments] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});

  function normalizeGoal(apiGoal) {
    const progressId = (apiGoal.progress_logs && apiGoal.progress_logs.length > 0) ? apiGoal.progress_logs[0].id : null;

    return {
      id: apiGoal.id,
      title: apiGoal.title,
      description: apiGoal.description,
      category: apiGoal.category || "General",
      frequency: apiGoal.frequency,
      start_date: apiGoal.start_date,
      end_date: apiGoal.end_date,
      createdAt: apiGoal.created_at,

      author: `User ${apiGoal.user_id}`,
      handle: `@user${apiGoal.user_id}`,
      tag: apiGoal.category || "General",
      timeAgo: new Date(apiGoal.created_at).toLocaleDateString(),

      // remarks for comments/cheers integration
      progressId, // <-- important: goal_progress_id to use when posting comments/cheers
      comments: apiGoal.comments_count || 0,
      comments_loaded: false, // whether we fetched comments for this goal

      // cheers mapping (backend may provide these keys; fallbacks provided)
      cheers: apiGoal.cheers_count || 0,
      my_cheer_id: apiGoal.my_cheer_id || null, // if backend returns the current user's cheer id for this goal progress

      likes: apiGoal.cheers_count || 0, // kept for compatibility with UI code
      liked: !!apiGoal.my_cheer_id,

      streak: `${apiGoal.streak_count || 0} day streak`,
      totalDays: apiGoal.longest_streak || 0,
      image: null,
      progress_logs: apiGoal.progress_logs || [],
    };
  }
  

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals');
      const normalized = (res.data || []).map(normalizeGoal);
      setGoals(normalized);
      setError(null);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals.');
    } finally {
      setLoading(false);
    }
  }, []); // add deps if normalizeGoal depends on something external

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  
// NEW: load comments for all goals after goals are fetched so counts persist on refresh
useEffect(() => {
  if (!goals || goals.length === 0) return;

  // If all goals already have comments_loaded true, do nothing (prevents an infinite loop)
  const anyUnloaded = goals.some((g) => !g.comments_loaded);
  if (!anyUnloaded) return;

  let mounted = true;
  async function loadAllComments() {
    try {
      const promises = goals.map((g) =>
        api
          .get("/comments", { params: g.progressId ? { goal_progress_id: g.progressId } : { goal_id: g.id } })
          .catch((err) => {
            console.warn("comments fetch failed for goal", g.id, err);
            return { data: [] };
          })
      );
      const results = await Promise.all(promises);
      if (!mounted) return;

      const next = {};
      goals.forEach((g, i) => {
        next[g.id] = results[i].data || [];
      });

      // Only update commentsByGoal once
      setCommentsByGoal((prev) => ({ ...next, ...prev }));

      // Mark only those goals that are not yet marked as loaded.
      setGoals((prev) =>
        prev.map((g) => (g.comments_loaded ? g : { ...g, comments_loaded: true }))
      );
    } catch (err) {
      console.error("Failed to load comments for all goals", err);
    }
  }

  loadAllComments();
  return () => {
    mounted = false;
  };
}, [goals]);


  // Keep each goal.comments in sync with the commentsByGoal array length
  useEffect(() => {
    setGoals((prevGoals) =>
      prevGoals.map((g) => {
        const actual = (commentsByGoal[g.id] || []).length;
        if ((g.comments || 0) !== actual) {
          return { ...g, comments: actual };
        }
        return g;
      })
    );
  }, [commentsByGoal]);
  

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const tags = useMemo(() => {
    const setTags = new Set(goals.map((g) => g.tag));
    return ['All', ...Array.from(setTags)];
  }, [goals]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let out = goals.filter((g) => {
      if (category !== 'All' && g.tag !== category) return false;
      if (!q) return true;
      const hay = `${g.author} ${g.handle} ${g.title} ${g.description}`.toLowerCase();
      return hay.includes(q);
    });

    if (sortBy === "Newest") out = out.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "Oldest") out = out.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "Trending") out = out.slice().sort((a, b) => (b.cheers || 0) - (a.cheers || 0));


    return out;
  }, [goals, debouncedQuery, category, sortBy]);

  function handleClear() { setQuery(''); setDebouncedQuery(''); setCategory('All'); setSortBy('Newest'); }
async function loadCommentsForGoal(goal) {
  try {
    // If a progressId exists, fetch by it; otherwise fetch by goal_id (backend supports both)
    if (goal.progressId) {
      const res = await api.get("/comments", { params: { goal_progress_id: goal.progressId }});
      setCommentsByGoal((prev) => ({ ...prev, [goal.id]: res.data || [] }));
    } else {
      const res = await api.get("/comments", { params: { goal_id: goal.id }});
      setCommentsByGoal((prev) => ({ ...prev, [goal.id]: res.data || [] }));
    }

    // mark as loaded so we don't re-fetch repeatedly
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? { ...g, comments_loaded: true } : g)));
  } catch (err) {
    console.error("Failed loading comments for goal", goal.id, err);
  }
}
async function addComment(goal) {
  const text = (commentInputs[goal.id] || "").trim();
  if (!text) return;

  // optimistic UI: add temporary comment while we wait
  const tempId = `temp-${Date.now()}`;
  const tempComment = {
    id: tempId,
    author: "You",
    content: text,
    created_at: new Date().toISOString(),
  };
  setCommentsByGoal((prev) => ({ ...prev, [goal.id]: [...(prev[goal.id] || []), tempComment] }));
  setCommentInputs((prev) => ({ ...prev, [goal.id]: "" }));

  try {
    // crucial: if progressId present use goal_progress_id, otherwise send goal_id
    const payload = goal.progressId
      ? { goal_progress_id: goal.progressId, content: text }
      : { goal_id: goal.id, content: text };

    // Post to comments endpoint (your api instance likely has baseURL)
    const res = await api.post("/comments", payload);
    const created = res.data;

    // Replace temp comment with real comment returned by server
    setCommentsByGoal((prev) => ({
      ...prev,
      [goal.id]: (prev[goal.id] || []).map((c) => (c.id === tempId ? created : c)),
    }));

    // Update the goals list: increment comment count and set progressId if backend created it
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goal.id) return g;
        const updated = { ...g, comments: (g.comments || 0) + 1 };
        if (!g.progressId && created.goal_progress_id) {
          updated.progressId = created.goal_progress_id;
        }
        return updated;
      })
    );
  } catch (err) {
    console.error("Failed to add comment", err);
    // revert optimistic UI
    setCommentsByGoal((prev) => ({ ...prev, [goal.id]: (prev[goal.id] || []).filter((c) => c.id !== tempId) }));
    // optionally show an error to the user here
  }
}

function toggleComments(goal) {
  setOpenComments((prev) => {
    const n = new Set(prev);
    if (n.has(goal.id)) {
      n.delete(goal.id);
    } else {
      n.add(goal.id);
      // fetch comments if we haven't yet
      const shouldLoad = !goal.comments_loaded;
      if (shouldLoad) loadCommentsForGoal(goal);
    }
    return n;
  });
}
  // --- CHEERS (likes) on a goal progress ---


// fetch a single goal from the server and replace it in local state
async function fetchGoalById(goalId) {
  try {
    const res = await api.get(`/goals/${goalId}`);
    const apiGoal = Array.isArray(res.data) ? res.data[0] : res.data;
    if (!apiGoal) return;
    const normalized = normalizeGoal(apiGoal);

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;

        return {
          ...g,              // start with existing local goal
          ...normalized,     // overwrite with server data
          comments: g.comments, // always preserve local comment count
          comments_loaded: g.comments_loaded ?? false, // keep loaded state
        };
      })
    );
  } catch (err) {
    console.error("Failed to fetch single goal", goalId, err);
  }
}


async function toggleCheer(goal) {
  const wasLiked = !!goal.my_cheer_id;
  const originalCheers = goal.cheers || 0;
  const originalMyCheerId = goal.my_cheer_id || null;

  // optimistic UI: flip liked and adjust count immediately
  setGoals((prev) =>
    prev.map((g) =>
      g.id === goal.id
        ? { ...g, liked: !wasLiked, cheers: wasLiked ? Math.max(originalCheers - 1, 0) : originalCheers + 1 }
        : g
    )
  );

  try {
    if (wasLiked) {
      // remove existing cheer
      await api.delete(`/cheers/${originalMyCheerId}`);

      // try to fetch the single goal to get canonical server state
      try {
        await fetchGoalById(goal.id);
      } catch (err) {
        console.warn('fetchGoalById failed after DELETE, falling back to fetchGoals if available', err);
        if (typeof fetchGoals === 'function') await fetchGoals();
      }
    } else {
      // create cheer
      const payload = goal.progressId ? { goal_progress_id: goal.progressId } : { goal_id: goal.id };
      const postRes = await api.post('/cheers', payload);

      // after creation, fetch single goal to obtain my_cheer_id and authoritative cheer_count
      try {
        await fetchGoalById(goal.id);
      } catch (err) {
        console.warn('fetchGoalById failed after POST, falling back to fetchGoals if available', err);
        if (typeof fetchGoals === 'function') await fetchGoals();
      }
    }
  } catch (err) {
    console.error('toggleCheer failed', err);

    // attempt to restore authoritative state by re-fetching; if that fails, revert optimistic change
    try {
      await fetchGoalById(goal.id);
    } catch (fetchErr) {
      console.warn('Re-fetch after error failed, reverting optimistic UI', fetchErr);
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, liked: wasLiked, cheers: originalCheers, my_cheer_id: originalMyCheerId } : g))
      );
    }
  }
}



const handleCommentInputChange = (goalId, value) => {
  setCommentInputs((prev) => ({ ...prev, [goalId]: value }));
};

  const handleLogout = () => { navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-4 h-6"><TargetIcon /></div>
              <span className="font-semibold text-lg tracking-tight">GoalForge</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-gray-100 transition-colors"><UserIcon /><span className="hidden sm:inline">Profile</span></Link>
              <Link to="/create-goal" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-white-100 transition-colors"><PlusIcon /><span className="hidden sm:inline">Create Goal</span></Link>
              <Link to="/my-goals" className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-white-100 transition-colors"><span className="hidden sm:inline">My Goals</span></Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-white-100 transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-semibold">Explore Feed</h2>
        <p className="mt-1 text-sm text-black">Discover recent goal updates from the GoalForge community</p>

        {/* Search */}
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="relative block">
                <span className="sr-only">Search</span>
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} className="placeholder-gray-400 block w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Search goals, users, or updates..." />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2"><span className="text-sm text-black">Category:</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent outline-none text-sm">{tags.map((t) => <option key={t} value={t}>{t}</option>)}</select>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2"><span className="text-sm text-black">Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent outline-none text-sm"><option>Newest</option><option>Oldest</option><option>Trending</option></select>
              </div>
              <button onClick={handleClear} className="text-sm text-black px-3 py-1">Clear</button>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-black">No results found</div>
          ) : (
            filtered.map((g) => (
              <article key={g.id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar name={g.author} />
                      <div>
                        <div className="flex items-baseline gap-2"><h3 className="font-semibold">{g.author}</h3><span className="text-sm text-black">{g.handle}</span></div>
                        <div className="mt-1 flex items-center gap-2"><h4 className="font-medium">{g.title}</h4><span className={`text-xs px-2 py-0.5 rounded-full ${tagClass(g.tag)}`}>{g.tag}</span></div>
                      </div>
                    </div>

                    <div className="text-sm text-black">{g.timeAgo}</div>
                  </div>

                  <p className="mt-4 text-black leading-relaxed">{g.description}</p>

                  <div className="mt-4">
                    <div className="w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 h-48 flex items-center justify-center">{g.image ? <img src={g.image} alt={g.title} className="w-full h-full object-cover" /> : <span className="text-gray-300">No image available</span>}</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="bg-gray-50 border border-gray-100 rounded-md px-4 py-2 text-sm text-black inline-flex items-center"><FlameIcon /><span>{g.streak} • {g.totalDays} total days</span></div></div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleComments(g)} className="flex items-center gap-2 text-sm text-black px-3 py-1 rounded-md bg-white border border-gray-200"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span>{g.comments || 0}</span></button>

                      <button onClick={() => toggleCheer(g)} className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md border ${g.liked ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-gray-200 text-black'}`}>
                        <FlameIcon />
                        <span>{g.cheers || 0}</span>
                      </button>

                      <Link to={`/goal/${g.id}`} state={{ goal: g }} className="text-sm px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">View goal</Link>
                    </div>
                  </div>

                  {openComments.has(g.id) && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex gap-3 items-start"><Avatar name="Current User" /><div className="flex-1"><textarea value={commentInputs[g.id] || ""} onChange={(e) => handleCommentInputChange(g.id, e.target.value)} rows={2} className="w-full border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Add a comment..." />
                          <div className="mt-2 flex items-center justify-end gap-2"><button onClick={() => setCommentInputs((p) => ({ ...p, [g.id]: "" }))} className="text-sm text-black px-3 py-1">Cancel</button><button onClick={() => addComment(g)} className="text-sm px-3 py-1 rounded-md bg-black text-white">Comment</button></div>
                        </div></div>

                      <div className="mt-4 space-y-3">{(commentsByGoal[g.id] || []).length === 0 ? (<div className="text-sm text-grey-200">No comments yet — be the first!</div>) : ((commentsByGoal[g.id] || []).map((c) => (<div key={c.id} className="flex items-start gap-3"><Avatar name={c.author || 'User'} /><div className="flex-1"><div className="flex items-baseline justify-between"><div><div className="text-sm font-semibold">{c.author || 'User'}</div><div className="text-xs text-black">{new Date(c.created_at || c.createdAt || c.createdAt).toLocaleString()}</div></div></div><div className="mt-1 text-black">{c.content || c.text}</div></div></div>)))}</div>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
