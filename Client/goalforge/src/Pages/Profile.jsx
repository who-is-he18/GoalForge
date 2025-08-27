import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaFire, FaBullseye, FaCheckSquare, FaRegGrinStars } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import profilePic from "../assets/profile-placeholder.png"; // fallback image
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';


// Local UI fallback badges (keeps your existing UI when backend badges are missing)
const fallbackBadges = [
  {
    id: 1,
    icon: <FaFire color="#FF6B00" size={28} />,
    title: "7-Day Streak",
    desc: "Maintained a 7-day streak",
    date: "Jan 10, 2025",
  },
  {
    id: 2,
    icon: <FaBullseye color="#FF2E63" size={28} />,
    title: "First Goal",
    desc: "Created your first goal",
    date: "Jun 15, 2024",
  },
  {
    id: 3,
    icon: <FaRegGrinStars color="#FFB800" size={28} />,
    title: "Social Butterfly",
    desc: "Followed 10 goals",
    date: "Dec 1, 2024",
  },
  {
    id: 4,
    icon: <FaCheckSquare color="#4CAF50" size={28} />,
    title: "Completionist",
    desc: "Completed your first goal",
    date: "Sep 20, 2024",
  },
];

function extractLevel(levelStr) {
  const match = String(levelStr).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

export default function Profile() {
  // UI state
  const [tab, setTab] = useState("badges");
  const [isEditing, setIsEditing] = useState(false);

  // Profile state
  const [username, setUsername] = useState("@user");
  const [displayName, setDisplayName] = useState("");
  const [level, setLevel] = useState("Level 1");
  const [xp, setXp] = useState(0);
  const [profileImage, setProfileImage] = useState(profilePic);
  const [stats, setStats] = useState({
    total_goals: 0,
    completed_goals: 0,
    current_streak: 0,
    following_count: 0,
  });

  // Badges
  const [badges, setBadges] = useState([]);

  // Editing temp state
  const [tempUsername, setTempUsername] = useState("");
  const [tempDisplayName, setTempDisplayName] = useState("");
  const [tempProfileImage, setTempProfileImage] = useState(null);

  const fileInputRef = useRef(null);

  // Loading / errors
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // counts derived from /api/followers and /api/goals
const [followersOfGoalsCount, setFollowersOfGoalsCount] = useState(0); // people following this user's goals
const [followingCountProfile, setFollowingCountProfile] = useState(0); // how many goals this profile user follows
// id of the profile being viewed (for /me this will be the logged-in user id)
const [profileUserId, setProfileUserId] = useState(null);



  // ----------------------
  // Fetch profile + badges on mount (uses axios `api` instance)
  // ----------------------
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: me } = await api.get('/me');

        if (!isMounted) return;
        if (me && me.id) setProfileUserId(me.id);


        // Map returned fields with safe fallbacks
        setUsername(me.username ? (me.username.startsWith('@') ? me.username : `@${me.username}`) : '@user');
        setDisplayName(me.display_name || me.displayName || '');

        const lvlNum = me.level != null ? me.level : 1;
        setLevel(`Level ${lvlNum}${me.level_title ? ` ${me.level_title}` : ''}`);

        setXp(me.xp != null ? me.xp : 0);
        setProfileImage(me.profile_pic ? me.profile_pic : profilePic);
        if (me.stats) setStats(me.stats);

        // Try badges: prefer user-specific endpoint first
        const tryFetchBadges = async () => {
          const userId = me.id;

          // 1) try GET /user-badges?user_id=
          try {
            const { data: list1 } = await api.get(`/user-badges`, { params: { user_id: userId } });
            if (Array.isArray(list1) && list1.length) return list1;
          } catch (e) {
            // ignore and try next
          }

          // 2) try GET /user-badges/:id
          try {
            const { data: single } = await api.get(`/user-badges/${userId}`);
            if (single) return Array.isArray(single) ? single : [single];
          } catch (e) {
            // ignore
          }

          // 3) fallback to GET /user-badges and filter
          try {
            const { data: all } = await api.get('/user-badges');
            if (Array.isArray(all)) return all.filter((ub) => ub.user_id === me.id);
          } catch (e) {
            // ignore
          }
          if (isMounted && me && me.id) {
  setProfileUserId(me.id);
}


          return [];
        };

        const ub = await tryFetchBadges();
        if (!isMounted) return;

        const mapped = ub.map((ubItem, idx) => {
          const awardedAt = ubItem.awarded_at || ubItem.created_at || null;
          if (ubItem.badge) {
            return {
              id: ubItem.id,
              title: ubItem.badge.name,
              desc: ubItem.badge.description,
              date: awardedAt ? new Date(awardedAt).toLocaleDateString() : '',
              icon_url: ubItem.badge.icon_url || null,
            };
          }

          const fb = fallbackBadges.find((f) => f.id === ubItem.badge_id) || fallbackBadges[ubItem.badge_id - 1];
          return {
            id: ubItem.id,
            title: fb ? fb.title : `Badge #${ubItem.badge_id}`,
            desc: fb ? fb.desc : '',
            date: awardedAt ? new Date(awardedAt).toLocaleDateString() : '',
            icon_url: null,
          };
        });

        setBadges(mapped.length ? mapped : fallbackBadges.map((b) => ({ id: b.id, title: b.title, desc: b.desc, date: b.date, icon_url: null })));
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data?.message || err.message || String(err);
        if (isMounted) setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, []);

  // ----------------------
  // XP progress calculations
  // ----------------------
  const currentLevelNum = extractLevel(level);
  const nextLevel = currentLevelNum + 1;
  const xpForCurrentLevel = (currentLevelNum - 1) * 200 + 50;
  const xpForNextLevel = currentLevelNum * 200 + 50;
  const progress = xpForNextLevel > xpForCurrentLevel ? Math.min(100, ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100) : 0;
  const xpToNext = Math.max(0, xpForNextLevel - xp);

  // ----------------------
  // Edit / Save handlers
  // ----------------------
  const handleEdit = () => {
    setTempUsername(username.replace(/^@/, ''));
    setTempDisplayName(displayName);
    setTempProfileImage(profileImage);
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfileImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTempProfileImage(ev.target.result); // data URL for preview and (temporarily) for sending
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageEditClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {};
      if (tempUsername) payload.username = tempUsername.replace(/^@/, '');
      if (tempDisplayName) payload.display_name = tempDisplayName;

      // If we have a data URL image, send it as `profile_pic` (your backend currently expects a string)
      if (tempProfileImage && tempProfileImage.startsWith('data:')) {
        payload.profile_pic = tempProfileImage;
      } else if (tempProfileImage && tempProfileImage !== profilePic) {
        payload.profile_pic = tempProfileImage; // could be an existing URL
      }

      const res = await api.put('/users/me', payload);
      // backend returns { message, user }
      if (res && res.data && res.data.user) {
        const u = res.data.user;
        setUsername(u.username ? (u.username.startsWith('@') ? u.username : `@${u.username}`) : username);
        setProfileImage(u.profile_pic ? u.profile_pic : profilePic);
        setXp(u.xp != null ? u.xp : xp);
        setLevel(u.level != null ? `Level ${u.level}` : level);
      } else {
        // optimistic fallback
        setUsername(tempUsername ? (tempUsername.startsWith('@') ? tempUsername : `@${tempUsername}`) : username);
        setProfileImage(tempProfileImage || profileImage);
      }

      setIsEditing(false);
      // Inside handleLogin success case:
      toast.success("Profile Updated Successfully");
      setTimeout(() => {
        navigate("/my-goals");
      }, 1000); // Short delay to allow toast to render
    } catch (err) {
      console.error(err);
      let msg = "Profile update failed. Please try again.";
      if (err.response && err.response.data) {
        msg = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  // wait until we know which profile we're viewing
  if (!profileUserId) return;

  let mounted = true;

  async function loadFollowerStats() {
    try {
      const [followersRes, goalsRes] = await Promise.all([api.get("/followers"), api.get("/goals")]);
      if (!mounted) return;

      const followers = followersRes.data || [];
      const allGoals = goalsRes.data || [];

      const userGoalIds = allGoals.filter((gg) => gg.user_id === profileUserId).map((gg) => gg.id);

      const followersOfGoals = followers.filter((f) => userGoalIds.includes(f.followed_goal_id)).length;
      const followingCount = followers.filter((f) => f.follower_id === profileUserId).length;

      setFollowersOfGoalsCount(followersOfGoals);
      setFollowingCountProfile(followingCount);

      // keep older stats shape in sync if you rely on it elsewhere
      setStats((prev) => ({ ...prev, following_count: followingCount }));
    } catch (err) {
      console.error("Failed to load follower stats", err);
    }
  }

  loadFollowerStats();

  const handler = () => {
    // simplest approach: reload counts when a follow/unfollow happens
    loadFollowerStats();
  };
  window.addEventListener("followers:changed", handler);

  return () => {
    mounted = false;
    window.removeEventListener("followers:changed", handler);
  };
}, [profileUserId]); // runs once profileUserId is available and whenever it changes

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            className="bg-none border-none cursor-pointer mr-3 text-2xl text-gray-900"
            onClick={() => window.history.back()}
            aria-label="Back"
          >
            <FaArrowLeft />
          </button>
          <h2 className="font-semibold text-2xl m-0">Profile</h2>
          <div className="flex-1" />
          <button
            className="bg-white border border-gray-200 rounded-lg px-5 py-2 font-medium text-base cursor-pointer mr-2 hover:bg-gray-100 transition"
            onClick={handleEdit}
            disabled={isEditing}
          >
            Edit Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-80 flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center shadow-sm relative">
              <div className="relative mb-4">
                <img
                  src={isEditing && tempProfileImage ? tempProfileImage : profileImage}
                  alt="Profile"
                  className="w-[90px] h-[90px] rounded-full object-cover border-4 border-gray-200"
                />
                {isEditing && (
                  <>
                    <button
                      className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100 transition"
                      onClick={handleImageEditClick}
                      type="button"
                      title="Change profile picture"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>

              {isEditing ? (
                <>
                  <input
                    className="font-semibold text-xl mb-1 text-center border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg font-medium hover:bg-gray-300 transition"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-xl mb-1">{username}</div>
                  <div className="text-gray-500 text-base">{level}</div>
                </>
              )}
            </div>

            {/* XP Card */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <div className="font-medium text-base mb-3 flex items-center">
                <span role="img" aria-label="XP" className="mr-2">📈</span>
                Experience Points
              </div>
              <div className="font-bold text-4xl mb-1">{xp}</div>
              <div className="text-gray-500 text-sm mb-4">Total XP</div>

              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Level {currentLevelNum}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-lg mx-2 relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-2 bg-black rounded-lg transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-medium text-sm text-gray-400">Level {nextLevel}</span>
              </div>
              <div className="text-gray-400 text-xs">{xpToNext} XP to next level</div>
            </div>

            {/* Stats Card */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <div className="font-medium text-base mb-4">Stats</div>
              <div className="flex flex-wrap gap-6">
  <div>
    <div className="font-bold text-xl text-gray-900">{stats.total_goals}</div>
    <div className="text-gray-500 text-sm">Total Goals</div>
  </div>

  <div>
    <div className="font-bold text-xl text-green-700">{stats.completed_goals}</div>
    <div className="text-gray-500 text-sm">Completed</div>
  </div>

  <div>
    <div className="font-bold text-xl text-orange-500">{stats.current_streak}</div>
    <div className="text-gray-500 text-sm">Current Streak</div>
  </div>

  {/* Following: how many goals this user is following */}
  <div>
    <div className="font-bold text-xl text-purple-700">{followingCountProfile}</div>
    <div className="text-gray-500 text-sm">Following</div>
  </div>

  {/* Followers: how many people follow this user's goals */}
  <div>
    <div className="font-bold text-xl text-indigo-700">{followersOfGoalsCount}</div>
    <div className="text-gray-500 text-sm">Followers</div>
  </div>
</div>

            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setTab("badges")}
                className={`px-5 py-1.5 rounded-xl font-medium text-sm cursor-pointer outline-none border transition 
                  ${tab === "badges" ? "bg-white border-[1.5px] border-gray-900 shadow-sm" : "bg-gray-100 border-[1.5px] border-gray-200"}`}
              >
                Badges ({badges.length})
              </button>
              <button
                onClick={() => setTab("activity")}
                className={`px-5 py-1.5 rounded-xl font-medium text-sm cursor-pointer outline-none border transition 
                  ${tab === "activity" ? "bg-white border-[1.5px] border-gray-900 shadow-sm" : "bg-gray-100 border-[1.5px] border-gray-200"}`}
              >
                Recent Activity
              </button>
            </div>

            {/* Tab Content */}
            {tab === "badges" ? (
              <div className="flex flex-wrap gap-6">
                {badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 min-w-[260px] flex-1 shadow-md flex flex-col gap-2"
                  >
                    <div>
                      {badge.icon_url ? (
                        <img src={badge.icon_url} alt={badge.title} className="w-7 h-7" />
                      ) : (
                        // fallback to local icon set (by matching title)
                        fallbackBadges[idx % fallbackBadges.length].icon
                      )}
                    </div>
                    <div className="font-semibold text-lg">{badge.title}</div>
                    <div className="text-gray-600 text-base">{badge.desc}</div>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                      <IoMdCalendar className="mr-1.5" />
                      {badge.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-gray-400 text-lg text-center shadow-md">
                No recent activity yet.
              </div>
            )}

            {loading && <div className="text-sm text-gray-500">Loading...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </div>
      </div>
                  <ToastContainer position="top-right" />
      
    </div>
  );
}
