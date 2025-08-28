import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { HiOutlineEye } from "react-icons/hi";


// (Icons & small components kept the same as your original file)
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
  </svg>
);
const TargetIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const FlameIcon = () => (
  <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2s1.5 2.5 1.5 4.5S12 9 12 9s-1.5-2.5-1.5-4.5S12 2 12 2z" fill="#F97316" />
    <path d="M6 14c0 3.3137 2.6863 6 6 6s6-2.6863 6-6c0-3.2329-2.7891-5.8546-6-9C8.7891 8.1454 6 10.7671 6 14z" fill="#FB923C" />
  </svg>
);
const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11v6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Avatar with robust fallback (initial if no image or on error)
const Avatar = ({ src, name }) => {
  const [ok, setOk] = useState(!!src);

  useEffect(() => setOk(!!src), [src]);

  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
      {ok ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setOk(false)}
        />
      ) : (
        <img
          src="https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg" 
          alt={name || "User"}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

const TAG_STYLES = {
  Habit: "bg-violet-100 text-violet-700",
  Health: "bg-green-100 text-green-700",
  Hobby: "bg-yellow-100 text-yellow-700",
  General: "bg-gray-100 text-black",
  default: "bg-gray-100 text-black",
};
function tagClass(tag) {
  return TAG_STYLES[tag] || TAG_STYLES.default;
}
export function ResponsiveCover({ src, alt, className = "", fallback }) {
  const [ratioPct, setRatioPct] = useState(56.25); // 16:9 default
  useEffect(() => {
    let cancelled = false;
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      const r = (img.height / img.width) * 100;
      setRatioPct(r || 56.25);
    };
    return () => { cancelled = true; };
  }, [src]);

  if (!src) return fallback || <div className="text-gray-300">No image</div>;

  return (
    <div className={`w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 ${className}`}>
      <div style={{ width: "100%", paddingTop: `${ratioPct}%`, position: "relative" }}>
        <img
          src={src}
          alt={alt}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );
}

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
  const [currentUser, setCurrentUser] = useState(null);
  const [followMap, setFollowMap] = useState({});
  const [followersCount, setFollowersCount] = useState({});
  const [onlyFollowing, setOnlyFollowing] = useState(false);




    function viewGoal(id) {
    navigate(`/goal/${id}`, { state: { goal: goals.find(g => g.id === id) } });
  }


  // ---------- Normalizers ----------
const normalizeComment = (c) => ({
  id: c.id,
  user_id: c.user?.id ?? c.user_id,              // <<---- ensure user_id present
  author: c.user?.username || `User ${c.user_id}`,
  avatar: c.user?.profile_pic || null,
  content: c.content || c.text || "",
  created_at: c.created_at || c.createdAt || new Date().toISOString(),
});


  function normalizeGoal(apiGoal) {
    // Prefer nested user (if backend returns it); else fall back to user_id
    const authorName = apiGoal.user?.username || `User ${apiGoal.user_id}`;
    const handle = apiGoal.user
      ? `@${String(apiGoal.user.username || "").toLowerCase()}`
      : `@user${apiGoal.user_id}`;

    const firstProgressId =
      apiGoal.progress_logs && apiGoal.progress_logs.length > 0
        ? apiGoal.progress_logs[0].id
        : null;

    return {
      id: apiGoal.id,
      title: apiGoal.title,
      description: apiGoal.description,
      category: apiGoal.category || "General",
      frequency: apiGoal.frequency,
      start_date: apiGoal.start_date,
      end_date: apiGoal.end_date,
      createdAt: apiGoal.created_at,

      user_id: apiGoal.user?.id ?? apiGoal.user_id,


      author: authorName,
      handle,
      avatar: apiGoal.user?.profile_pic || null,

      timeAgo: new Date(apiGoal.created_at).toLocaleDateString(),

      progressId: firstProgressId,

      // we keep "comments" as a number; the list lives in commentsByGoal
      comments: apiGoal.comments_count || 0,
      comments_loaded: false,

      cheers: apiGoal.cheers_count || 0,
      my_cheer_id: apiGoal.my_cheer_id || null,
      liked: !!apiGoal.my_cheer_id,

      streak: `${apiGoal.streak_count || 0} day streak`,
      totalDays: apiGoal.longest_streak || 0,

      image:
        apiGoal.image_url ||
        "https://i.pinimg.com/1200x/80/7f/b5/807fb5c3c5efb50dd303ae17e242ac96.jpg",

      progress_logs: apiGoal.progress_logs || [],
    };
  }
  

  // ---------- Fetch goals ----------
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/goals");
      const normalized = (res.data || []).map(normalizeGoal);
      setGoals(normalized);
      setError(null);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError("Failed to load goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // only show goals NOT owned by the current user
const otherGoals = useMemo(() => {
  if (!currentUser || !currentUser.id) return goals; // if we don't know current user yet, show all until known
  return goals.filter((g) => g.user_id !== currentUser.id);
}, [goals, currentUser]);

useEffect(() => {
  // only fetch if user logged in
  if (!currentUser?.id) {
    setFollowMap({});
    setFollowersCount({});
    return;
  }

  let mounted = true;
  const loadFollowers = async () => {
    try {
      const res = await api.get("/followers"); // returns list of all follower rows
      if (!mounted) return;
      const all = res.data || [];

      // build followMap for current user + counts map for all goals
      const fm = {};
      const counts = {};

      all.forEach((f) => {
        // count for goal
        counts[f.followed_goal_id] = (counts[f.followed_goal_id] || 0) + 1;
        // if this row belongs to current user, mark in fm
        if (f.follower_id === currentUser.id) {
          fm[f.followed_goal_id] = f.id; // store the follower record id
        }
      });

      setFollowMap(fm);
      setFollowersCount(counts);
    } catch (err) {
      console.error("Failed to load followers", err);
    }
  };

  loadFollowers();

  return () => {
    mounted = false;
  };
}, [currentUser]);
// Optimistic follow
// Follow a goal (optimistic + persisted)
const followGoal = async (goal) => {
  if (!currentUser?.id) {
    alert("Please log in to follow goals.");
    return;
  }

  const tempFollowerId = `temp-${Date.now()}`;

  // optimistic UI
  setFollowMap((p) => ({ ...p, [goal.id]: tempFollowerId }));
  setFollowersCount((c) => ({ ...c, [goal.id]: (c[goal.id] || 0) + 1 }));

  // optimistic dispatch so other pages update immediately
  window.dispatchEvent(new CustomEvent("followers:changed", {
    detail: { goalId: goal.id, action: "follow", followerId: tempFollowerId }
  }));

  try {
    const payload = {
      follower_id: currentUser.id,
      followed_goal_id: goal.id,
    };
    const res = await api.post("/followers", payload);
    const created = res.data || {};

    // replace temp id with real id (only if still the temp)
    setFollowMap((p) => {
      const next = { ...p };
      if (next[goal.id] === tempFollowerId) next[goal.id] = created.id;
      return next;
    });

    // final dispatch with real id so listeners can use the real record id
    window.dispatchEvent(new CustomEvent("followers:changed", {
      detail: { goalId: goal.id, action: "follow", followerId: created.id }
    }));

    // optionally ensure followersCount is consistent with server response
    setFollowersCount((c) => ({ ...c, [goal.id]: (c[goal.id] || 1) }));
  } catch (err) {
    console.error("Follow failed", err);
    // rollback optimistic UI
    setFollowMap((p) => {
      const next = { ...p };
      delete next[goal.id];
      return next;
    });
    setFollowersCount((c) => ({ ...c, [goal.id]: Math.max(0, (c[goal.id] || 1) - 1) }));

    // notify others to refresh/rollback
    window.dispatchEvent(new CustomEvent("followers:changed", {
      detail: { goalId: goal.id, action: "follow_rollback", followerId: tempFollowerId }
    }));

    alert("Failed to follow — please try again.");
  }
};

// Unfollow a goal (optimistic + persisted)
const unfollowGoal = async (goal) => {
  if (!currentUser?.id) {
    alert("Please log in to unfollow goals.");
    return;
  }

  const existingFollowerId = followMap[goal.id];
  if (!existingFollowerId) return; // nothing to do

  // optimistic remove
  setFollowMap((p) => {
    const next = { ...p };
    delete next[goal.id];
    return next;
  });
  setFollowersCount((c) => ({ ...c, [goal.id]: Math.max(0, (c[goal.id] || 1) - 1) }));

  // optimistic dispatch
  window.dispatchEvent(new CustomEvent("followers:changed", {
    detail: { goalId: goal.id, action: "unfollow", followerId: existingFollowerId }
  }));

  try {
    // If it was a temp id, nothing to call on server
    if (String(existingFollowerId).startsWith("temp-")) {
      return;
    }

    await api.delete(`/followers/${existingFollowerId}`);

    // success — nothing else to do, we've already dispatched
  } catch (err) {
    console.error("Unfollow failed", err);
    // rollback: re-add mapping + increment count
    setFollowMap((p) => ({ ...p, [goal.id]: existingFollowerId }));
    setFollowersCount((c) => ({ ...c, [goal.id]: (c[goal.id] || 0) + 1 }));

    // notify others to refresh/rollback
    window.dispatchEvent(new CustomEvent("followers:changed", {
      detail: { goalId: goal.id, action: "unfollow_rollback", followerId: existingFollowerId }
    }));

    alert("Failed to unfollow — please try again.");
  }
};

// convenience wrapper used by UI
const toggleFollow = (goal) => {
  if (followMap[goal.id]) {
    unfollowGoal(goal);
  } else {
    followGoal(goal);
  }
};

  // ---------- Fetch all comments once goals arrive ----------
useEffect(() => {
  if (!otherGoals || otherGoals.length === 0) return;

  const anyUnloaded = otherGoals.some((g) => !g.comments_loaded);
  if (!anyUnloaded) return;

  let mounted = true;

  async function loadAllComments() {
    try {
      const promises = otherGoals.map((g) =>
        api
          .get("/comments", {
            params: g.progressId ? { goal_progress_id: g.progressId } : { goal_id: g.id },
          })
          .catch((err) => {
            console.warn("comments fetch failed for goal", g.id, err);
            return { data: [] };
          })
      );
      const results = await Promise.all(promises);
      if (!mounted) return;

      const next = {};
      otherGoals.forEach((g, i) => {
        const list = Array.isArray(results[i].data) ? results[i].data : [];
        next[g.id] = list.map(normalizeComment);
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
}, [otherGoals]); // <-- note dependency changed to otherGoals


  // Keep each goal.comments (#) in sync with the commentsByGoal array length
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

  // ---------- debounce ----------
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

const tags = useMemo(() => {
  const setTags = new Set(otherGoals.map((g) => g.category || "General"));
  return ["All", ...Array.from(setTags)];
}, [otherGoals]);

const filtered = useMemo(() => {
  const q = debouncedQuery.trim().toLowerCase();

  // base filtering (category + optional text search)
  let out = otherGoals.filter((g) => {
    if (category !== "All" && (g.category || "General") !== category) return false;
    if (!q) return true;
    const hay = `${g.author} ${g.handle} ${g.title} ${g.description}`.toLowerCase();
    return hay.includes(q);
  });

  // If user selected "Following" in the dropdown, narrow to followed goals first
  if (sortBy === "Following") {
    out = out.filter((g) => !!(followMap && followMap[g.id]));
    // then sort by newest as a reasonable default for followed goals
    out = out.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return out;
  }

  if (sortBy === "Newest") {
    out = out.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === "Oldest") {
    out = out.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortBy === "Trending") {
    out = out.slice().sort((a, b) => (b.cheers || 0) - (a.cheers || 0));
  }

  return out;
}, [otherGoals, debouncedQuery, category, sortBy, followMap]);




  function handleClear() {
    setQuery("");
    setDebouncedQuery("");
    setCategory("All");
    setSortBy("Newest");
  }

  async function loadCommentsForGoal(goal) {
    try {
      if (goal.progressId) {
        const res = await api.get("/comments", { params: { goal_progress_id: goal.progressId } });
        setCommentsByGoal((prev) => ({
          ...prev,
          [goal.id]: (res.data || []).map(normalizeComment),
        }));
      } else {
        const res = await api.get("/comments", { params: { goal_id: goal.id } });
        setCommentsByGoal((prev) => ({
          ...prev,
          [goal.id]: (res.data || []).map(normalizeComment),
        }));
      }

      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, comments_loaded: true } : g))
      );
    } catch (err) {
      console.error("Failed loading comments for goal", goal.id, err);
    }
  }

// Updated addComment
async function addComment(goal) {
  const text = (commentInputs[goal.id] || "").trim();
  if (!text) return;

  // optimistic UI - temp comment
  const tempId = `temp-${Date.now()}`;
  const tempComment = {
    id: tempId,
    user_id: currentUser?.id ?? null,
    author: currentUser?.username ? "You" : "You",
    avatar: currentUser?.profile_pic || null,
    content: text,
    created_at: new Date().toISOString(),
      // frontend-only like fields:
    likes_count: 0,
    liked: false,
  };

  setCommentsByGoal((prev) => ({
    ...prev,
    [goal.id]: [...(prev[goal.id] || []), tempComment],
  }));
  setCommentInputs((prev) => ({ ...prev, [goal.id]: "" }));

  try {
    const payload = goal.progressId
      ? { goal_progress_id: goal.progressId, content: text }
      : { goal_id: goal.id, content: text };

    const res = await api.post("/comments", payload);
    const data = res.data || {};

    // Server shape can be:
    // 1) comment object (old)
    // 2) { comment: <...>, created_goal_progress: <...> } (new)
    // 3) comment object that contains goal_progress_id property
    let serverCommentRaw = null;
    let createdGp = null;

    if (data.comment) {
      serverCommentRaw = data.comment;
      createdGp = data.created_goal_progress || null;
    } else {
      // maybe server returned the comment directly
      serverCommentRaw = data;
      createdGp = data.created_goal_progress || null;
      // or the server might have returned top-level goal_progress_id along with the comment fields
    }

    const created = normalizeComment(serverCommentRaw || {});
    created.likes_count = created.likes_count ?? created.likesCount ?? 0;
    created.liked = created.liked ?? false;

    // Replace temp comment with server version
    setCommentsByGoal((prev) => ({
      ...prev,
      [goal.id]: (prev[goal.id] || []).map((c) => (c.id === tempId ? created : c)),
    }));
    // after const created = normalizeComment(...)
const stored = getStoredLikes();
if (stored[tempId]) {
  // move like to real id
  stored[created.id] = true;
  delete stored[tempId];
  saveStoredLikes(stored);
}


    // Update goals list: bump comment count and attach progressId if server created one
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goal.id) return g;
        const updated = { ...g, comments: (g.comments || 0) + 1 };

        // If server returned a created goal progress, use its id as progressId
        if (!g.progressId) {
          // look for createdGp or a goal_progress_id on the comment
          const gpFromComment = created.goal_progress_id || created.goalProgressId || created.goalProgress?.id;
          if (createdGp && createdGp.id) updated.progressId = createdGp.id;
          else if (gpFromComment) updated.progressId = gpFromComment;
        }

        return updated;
      })
    );

    // If the server created a full GoalProgress returned in payload, optionally merge it into
    // any progress state you keep elsewhere (e.g. in ViewGoal). If you have a fetchProgressLogs()
    // available, you can call it here instead of trying to merge broadly.

  } catch (err) {
    console.error("Failed to add comment", err);
    // revert optimistic UI
    setCommentsByGoal((prev) => ({
      ...prev,
      [goal.id]: (prev[goal.id] || []).filter((c) => c.id !== tempId),
    }));
    // Optionally show a toast/error to user here
  }
}
const LIKES_STORAGE_KEY = "app_comment_likes_v1"; // bump version to reset if you change shape

const getStoredLikes = () => {
  try {
    const raw = localStorage.getItem(LIKES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("Failed to read comment likes from localStorage", e);
    return {};
  }
};

const saveStoredLikes = (obj) => {
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(obj || {}));
  } catch (e) {
    console.warn("Failed to save comment likes to localStorage", e);
  }
};

// Toggle like/unlike for a comment (frontend-only)
const toggleLikeComment = (goalId, commentId) => {
  // update UI
  setCommentsByGoal((prev) => {
    const goalComments = [...(prev[goalId] || [])];
    const updated = goalComments.map((c) => {
      if (c.id !== commentId) return c;
      const liked = !!c.liked;
      return {
        ...c,
        liked: !liked,
        likes_count: (c.likes_count ?? c.likesCount ?? 0) + (liked ? -1 : 1),
      };
    });
    return { ...prev, [goalId]: updated };
  });

  // persist to localStorage
  const stored = getStoredLikes();
  if (stored[commentId]) {
    // currently liked -> unlike (remove)
    delete stored[commentId];
  } else {
    // not liked -> like
    stored[commentId] = true;
  }
  saveStoredLikes(stored);
};

useEffect(() => {
  const stored = getStoredLikes();
  if (!stored || Object.keys(stored).length === 0) return;

  setCommentsByGoal((prev) => {
    let changed = false;
    const next = {};

    for (const goalId of Object.keys(prev)) {
      next[goalId] = (prev[goalId] || []).map((c) => {
        const shouldBeLiked = !!stored[c.id];
        const alreadyLiked = !!c.liked;
        if (shouldBeLiked && !alreadyLiked) {
          changed = true;
          return { ...c, liked: true, likes_count: (c.likes_count ?? 0) + 1 };
        } else if (!shouldBeLiked && alreadyLiked) {
          changed = true;
          return { ...c, liked: false, likes_count: Math.max(0, (c.likes_count ?? 1) - 1) };
        }
        return c;created.likes_count = created.likes_count ?? created.likesCount ?? 0;
created.liked = created.liked ?? false;
      });
    }

    return changed ? next : prev;
  });
}, [commentsByGoal]); // re-run when comments change (safe — only writes if something needs update)




  function toggleComments(goal) {
    setOpenComments((prev) => {
      const n = new Set(prev);
      if (n.has(goal.id)) {
        n.delete(goal.id);
      } else {
        n.add(goal.id);
        if (!goal.comments_loaded) loadCommentsForGoal(goal);
      }
      return n;
    });
  }

  // ---------- CHEERS ----------
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
            ...g,
            ...normalized,
            comments: g.comments,
            comments_loaded: g.comments_loaded ?? false,
          };
        })
      );
    } catch (err) {
      console.error("Failed to fetch single goal", goalId, err);
    }
  }

// Updated toggleCheer
async function toggleCheer(goal) {
  const wasLiked = !!goal.my_cheer_id;
  const originalCheers = goal.cheers || 0;
  const originalMyCheerId = goal.my_cheer_id || null;

  // optimistic UI: flip liked and adjust count
  setGoals((prev) =>
    prev.map((g) =>
      g.id === goal.id
        ? {
            ...g,
            liked: !wasLiked,
            cheers: wasLiked ? Math.max(originalCheers - 1, 0) : originalCheers + 1,
          }
        : g
    )
  );

  try {
    if (wasLiked) {
      // optimistic delete
      await api.delete(`/cheers/${originalMyCheerId}`);

      // try to refresh the specific goal, fall back to refetch all
      try {
        if (typeof fetchGoalById === "function") {
          await fetchGoalById(goal.id);
        } else if (typeof fetchGoals === "function") {
          await fetchGoals();
        }
      } catch (err) {
        console.warn("fetchGoalById failed after DELETE; falling back", err);
        // best-effort local revert if fetch fails
        setGoals((prev) =>
          prev.map((g) =>
            g.id === goal.id ? { ...g, liked: false, cheers: Math.max(originalCheers - 1, 0), my_cheer_id: null } : g
          )
        );
      }
    } else {
      // create cheer
      const payload = goal.progressId ? { goal_progress_id: goal.progressId } : { goal_id: goal.id };

      const res = await api.post("/cheers", payload);
      const data = res.data || {};

      // Server shapes:
      // 1) cheer object (old) { id: 123, ... } maybe plus goal_progress_id/cheer_count
      // 2) { cheer: {...}, created_goal_progress: {...} } (new)
      let createdCheer = null;
      let createdGp = null;
      if (data.cheer) {
        createdCheer = data.cheer;
        createdGp = data.created_goal_progress || null;
      } else {
        createdCheer = data;
        createdGp = data.created_goal_progress || null;
      }

      // extract useful bits
      const cheerId = createdCheer?.id || createdCheer?.cheer_id || null;
      const cheerCount = createdCheer?.cheer_count ?? data?.cheer_count ?? null;
      const gpFromResponse = createdCheer?.goal_progress_id || data?.goal_progress_id || (createdGp && createdGp.id);

      // Update the goals list with returned info (prefer server truth)
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goal.id) return g;
          const updated = { ...g, liked: true };
          if (cheerCount !== null) updated.cheers = cheerCount;
          else updated.cheers = (g.cheers || 0) + 1;

          // set my_cheer_id if server returned it
          if (cheerId) updated.my_cheer_id = cheerId;

          // if server created a goal progress, attach it
          if (!g.progressId && gpFromResponse) updated.progressId = gpFromResponse;

          return updated;
        })
      );

      // If we can't trust the local merge, try to re-fetch the goal
      try {
        if (typeof fetchGoalById === "function") {
          await fetchGoalById(goal.id);
        }
      } catch (err) {
        console.warn("fetchGoalById failed after POST; attempting fetchGoals()", err);
        if (typeof fetchGoals === "function") await fetchGoals();
      }
    }
  } catch (err) {
    console.error("toggleCheer failed", err);
    // On failure, attempt to re-fetch the goal, otherwise revert optimistic UI
    try {
      if (typeof fetchGoalById === "function") {
        await fetchGoalById(goal.id);
      } else if (typeof fetchGoals === "function") {
        await fetchGoals();
      } else {
        // revert optimistic UI
        setGoals((prev) =>
          prev.map((g) =>
            g.id === goal.id
              ? {
                  ...g,
                  liked: wasLiked,
                  cheers: originalCheers,
                  my_cheer_id: originalMyCheerId,
                }
              : g
          )
        );
      }
    } catch (fetchErr) {
      console.warn("Re-fetch after error failed, reverting optimistic UI", fetchErr);
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goal.id
            ? {
                ...g,
                liked: wasLiked,
                cheers: originalCheers,
                my_cheer_id: originalMyCheerId,
              }
            : g
        )
      );
    }
  }
}

  async function deleteComment(goalId, commentId) {
  // Optimistic UI: remove comment immediately
  const previousComments = commentsByGoal[goalId] || [];
  setCommentsByGoal((prev) => ({
    ...prev,
    [goalId]: prev[goalId].filter((c) => c.id !== commentId),
  }));

  // Update goal comment count
  setGoals((prev) =>
    prev.map((g) => g.id === goalId ? { ...g, comments: Math.max((g.comments || 1) - 1, 0) } : g)
  );

  try {
    await api.delete(`/comments/${commentId}`);
    // optionally re-fetch goal or comments to ensure canonical state
    // await fetchGoalById(goalId);
  } catch (err) {
    console.error("Failed to delete comment", err);
    // revert optimistic UI if deletion fails
    setCommentsByGoal((prev) => ({
      ...prev,
      [goalId]: previousComments,
    }));
    // revert comment count
    setGoals((prev) =>
      prev.map((g) => g.id === goalId ? { ...g, comments: previousComments.length } : g)
    );
  }
}

useEffect(() => {
  async function fetchCurrentUser() {
    try {
      const res = await api.get('/me'); // adjust endpoint if needed
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user", err);
    }
  }
  fetchCurrentUser();
}, []);

  const handleCommentInputChange = (goalId, value) => {
    setCommentInputs((prev) => ({ ...prev, [goalId]: value }));
  };

  const handleLogout = () => {
    navigate("/");
  };

  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-4 h-6">
                <TargetIcon />
              </div>
              <span className="font-semibold text-lg tracking-tight">GoalForge</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-gray-100 transition-colors"
              >
                <UserIcon />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <Link
                to="/create-goal"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-white-100 transition-colors"
              >
                <PlusIcon />
                <span className="hidden sm:inline">Create Goal</span>
              </Link>
              <Link
                to="/my-goals"
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-white-100 transition-colors"
              >
                <span className="hidden sm:inline">My Goals</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-white-100 transition-colors"
              >
                Logout
              </button>
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
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="placeholder-gray-400 block w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Search goals, users, or updates..."
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-black">Category:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent outline-none text-sm"
                >
                  {tags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-black">Sort by:</span>
                <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="bg-transparent outline-none text-sm"
>
  <option>Newest</option>
  <option>Oldest</option>
  <option>Trending</option>
  <option>Following</option> {/* NEW */}
</select>

              </div>
              <button onClick={handleClear} className="text-sm text-black px-3 py-1">
                Clear
              </button>
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
                      <Avatar name={g.author} src={g.avatar} />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-semibold">{g.author}</h3>
                          <span className="text-sm text-black">{g.handle}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <h4 className="font-medium">{g.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tagClass(g.category)}`}>{g.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-black">
                                                {/* Follow button */}
<button
  onClick={() => toggleFollow(g)}
  className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md border ${
    followMap[g.id]
      ? "bg-green-50 border-green-100 text-green-700"
      : "bg-white border-gray-200 text-black"
  }`}
>
  {/* simple user-plus / check icon */}
  {followMap[g.id] ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 17c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 7h-2V5h-2V3h2V1h2v2h2v2h-2v2z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3z" />
      <path d="M2 21v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2" />
      <path d="M22 7h-3M20 5v4" />
    </svg>
  )}

  <span>{followMap[g.id] ? "Following" : "Follow"}</span>
  <span className="text-xs text-gray-500">{followersCount[g.id] ?? 0}</span>
</button>
                    </div>
                  </div>

                  <p className="mt-4 text-black leading-relaxed">{g.description}</p>

<ResponsiveCover src={g.image} alt={g.title} className="h-auto" />



                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 border border-gray-100 rounded-md px-4 py-2 text-sm text-black inline-flex items-center">
                        <FlameIcon />
                        <span>
                          {g.streak} • {g.totalDays} total days
                        </span>
                        
                      </div>
                                                                        <h2 className="text-sm text-black">Created on : {g.timeAgo}</h2>

                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleComments(g)}
                        className="flex items-center gap-2 text-sm text-black px-3 py-1 rounded-md bg-white border border-gray-200"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{g.comments || 0}</span>
                      </button>

                      <button
                        onClick={() => toggleCheer(g)}
                        className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md border ${
                          g.liked ? "bg-red-50 border-red-100 text-red-600" : "bg-white border-gray-200 text-black"
                        }`}
                      >
                        <FlameIcon />
                        <span>{g.cheers || 0}</span>
                      </button>

                      <button onClick={() => viewGoal(g.id)} className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-100">
                                        <HiOutlineEye className="w-4 h-4" />
                                        View
                                      </button>
                    </div>
                  </div>

                {/* Comments Section */}
                {openComments.has(g.id) && (
                  <div className="mt-4 border-t pt-4">
                    {/* Add comment box */}
                    <div className="flex gap-3 items-start">
                      <Avatar name="Current User" />
                      <div className="flex-1">
                        <textarea
                          value={commentInputs[g.id] || ""}
                          onChange={(e) => handleCommentInputChange(g.id, e.target.value)}
                          rows={2}
                          className="w-full border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          placeholder="Add a comment..."
                        />
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <button
  onClick={() => {
    // clear the input
    setCommentInputs((p) => ({ ...p, [g.id]: "" }));
    // close comments (openComments is a Set)
    setOpenComments((prev) => {
      const clone = new Set(prev);
      clone.delete(g.id);
      return clone;
    });
  }}
  className="text-sm text-black px-3 py-1"
>
  Cancel
</button>
                          <button
                            onClick={() => addComment(g)}
                            className="text-sm px-3 py-1 rounded-md bg-black text-white"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comment list */}
                    <div className="mt-4 space-y-3">
                      {(commentsByGoal[g.id] || []).length === 0 ? (
                        <div className="text-sm text-gray-400">No comments yet — be the first!</div>
                      ) : (
                        (commentsByGoal[g.id] || []).map((c) => (
                          <div key={c.id} className="flex items-start gap-3">
                            <Avatar name={c.author || 'User'} />
                            <div className="flex-1">
                              <div className="flex items-baseline justify-between">
  <div>
    <div className="text-sm font-semibold">{c.author || 'User'}</div>
    <div className="text-xs text-black">{new Date(c.created_at || c.createdAt).toLocaleString()}</div>
  </div>

  <div className="ml-2 flex items-center gap-2">
    {/* Like button */}
    <button
      onClick={() => toggleLikeComment(g.id, c.id)}
      aria-label={c.liked ? "Unlike comment" : "Like comment"}
      className="flex items-center gap-1 text-sm p-1 rounded-md hover:bg-gray-100 transition"
    >
      {/* simple heart/thumb svg — filled when liked */}
      {c.liked ? (
        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 21s-7.5-4.9-9.6-7.1C-0.1 10.8 1.6 6.8 5 5.3 7 4.3 9.4 5 12 7c2.6-2 5-2.7 7-1.7 3.4 1.5 5.1 5.5 2.6 8.6C19.5 16.1 12 21 12 21z"/>
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M20.8 8.6c-.9-3.2-4.1-4.6-6.5-3.3C12.3 6 12 6.2 12 6.2s-.3-.2-2.3-1c-2.4-1.3-5.6.1-6.5 3.3C2.2 10 4.9 14 7.5 16.6 10.2 19.3 12 21 12 21s1.8-1.7 4.5-4.4C19.1 14 21.9 10 20.8 8.6z" />
        </svg>
      )}

      <span className="text-xs">{c.likes_count ?? 0}</span>
    </button>

    {/* Show delete if comment owner OR goal owner */}
    {(currentUser?.id === c.user_id || currentUser?.id === g.user_id) && (
      <button
        onClick={() => deleteComment(g.id, c.id)}
        aria-label="Delete comment"
        className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    )}
  </div>
</div>
                              <div className="mt-1 text-black">{c.content || c.text}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
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
