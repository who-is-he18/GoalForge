import React, { useState, useRef } from "react";
import { FaArrowLeft, FaFire, FaBullseye, FaCheckSquare, FaRegGrinStars } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import profilePic from "../assets/profile-placeholder.png"; // Use a placeholder image

const badges = [
  {
    icon: <FaFire color="#FF6B00" size={28} />,
    title: "7-Day Streak",
    desc: "Maintained a 7-day streak",
    date: "Jan 10, 2025",
  },
  {
    icon: <FaBullseye color="#FF2E63" size={28} />,
    title: "First Goal",
    desc: "Created your first goal",
    date: "Jun 15, 2024",
  },
  {
    icon: <FaRegGrinStars color="#FFB800" size={28} />,
    title: "Social Butterfly",
    desc: "Followed 10 goals",
    date: "Dec 1, 2024",
  },
  {
    icon: <FaCheckSquare color="#4CAF50" size={28} />,
    title: "Completionist",
    desc: "Completed your first goal",
    date: "Sep 20, 2024",
  },
];

// Helper to extract level number from string like "Level 12 Achiever"
function extractLevel(levelStr) {
  const match = levelStr.match(/Level\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : 1;
}

export default function Profile() {
  const [tab, setTab] = useState("badges");
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("@john_achiever");
  const [level, setLevel] = useState("Level 12 Achiever");
  const [xp, setXp] = useState(2450);
  const [profileImage, setProfileImage] = useState(profilePic);

  // For editing
  const [tempUsername, setTempUsername] = useState(username);
  const [tempLevel, setTempLevel] = useState(level);
  const [tempProfileImage, setTempProfileImage] = useState(profileImage);

  const fileInputRef = useRef(null);

  // Simulate XP needed for next level (for demo, 150 XP per level)
  const currentLevel = extractLevel(isEditing ? tempLevel : level);
  const nextLevel = currentLevel + 1;
  const xpForCurrentLevel = (currentLevel - 1) * 200 + 50; // Example formula
  const xpForNextLevel = currentLevel * 200 + 50;
  const progress =
    xpForNextLevel > xpForCurrentLevel
      ? Math.min(100, ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100)
      : 0;
  const xpToNext = Math.max(0, xpForNextLevel - xp);

  const handleEdit = () => {
    setTempUsername(username);
    setTempLevel(level);
    setTempProfileImage(profileImage);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUsername(tempUsername);
    setLevel(tempLevel);
    setProfileImage(tempProfileImage);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTempProfileImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageEditClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

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
                  src={isEditing ? tempProfileImage : profileImage}
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
                    onChange={e => setTempUsername(e.target.value)}
                  />
                  <input
                    className="text-gray-500 text-base text-center border border-gray-300 rounded-lg px-2 py-1 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={tempLevel}
                    onChange={e => setTempLevel(e.target.value)}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition"
                      onClick={handleSave}
                    >
                      Save
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
                <span role="img" aria-label="XP" className="mr-2">
                  📈
                </span>
                Experience Points
              </div>
              <div className="font-bold text-4xl mb-1">{xp}</div>
              <div className="text-gray-500 text-sm mb-4">Total XP</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Level {currentLevel}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-lg mx-2 relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-2 bg-black rounded-lg transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-medium text-sm text-gray-400">
                  Level {nextLevel}
                </span>
              </div>
              <div className="text-gray-400 text-xs">{xpToNext} XP to next level</div>
            </div>

            {/* Stats Card */}
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <div className="font-medium text-base mb-4">Stats</div>
              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="font-bold text-xl text-gray-900">8</div>
                  <div className="text-gray-500 text-sm">Total Goals</div>
                </div>
                <div>
                  <div className="font-bold text-xl text-green-700">3</div>
                  <div className="text-gray-500 text-sm">Completed</div>
                </div>
                <div>
                  <div className="font-bold text-xl text-orange-500">15</div>
                  <div className="text-gray-500 text-sm">Current Streak</div>
                </div>
                <div>
                  <div className="font-bold text-xl text-purple-700">23</div>
                  <div className="text-gray-500 text-sm">Following</div>
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
                  ${
                    tab === "badges"
                      ? "bg-white border-[1.5px] border-gray-900 shadow-sm"
                      : "bg-gray-100 border-[1.5px] border-gray-200"
                  }`}
              >
                Badges (4)
              </button>
              <button
                onClick={() => setTab("activity")}
                className={`px-5 py-1.5 rounded-xl font-medium text-sm cursor-pointer outline-none border transition 
                  ${
                    tab === "activity"
                      ? "bg-white border-[1.5px] border-gray-900 shadow-sm"
                      : "bg-gray-100 border-[1.5px] border-gray-200"
                  }`}
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
                    <div>{badge.icon}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}