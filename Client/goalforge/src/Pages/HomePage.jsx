import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";


const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
  </svg>
);
const TargetIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>

  </svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12h-9m9 0l-3-3m3 3l-3 3" />
  </svg>
);
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
  </svg>
);
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FlameIcon = () => (
  <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2s1.5 2.5 1.5 4.5S12 9 12 9s-1.5-2.5-1.5-4.5S12 2 12 2z" fill="#F97316"/>
    <path d="M6 14c0 3.3137 2.6863 6 6 6s6-2.6863 6-6c0-3.2329-2.7891-5.8546-6-9C8.7891 8.1454 6 10.7671 6 14z" fill="#FB923C"/>
  </svg>
);

const Avatar = ({ src, name }) => (
  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">{name?.[0] || "G"}</div>}
  </div>
);

function useDarkMode() {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);
  return [dark, setDark];
}

const initialDummyGoals = [
  {
    id: 1,
    author: "Emma Davis",
    handle: "@emma_writes",
    title: "Write 500 Words Daily",
    tag: "Habit",
    timeAgo: "205d ago",
    content: "Just hit my 500-word target for today! Working on a short story about time travel. Writing has become such a therapeutic part of my routine.",
    image: null, // replace with url when available
    streak: "8 day streak",
    totalDays: 31,
    createdAt: "2025-02-01T08:30:00Z",
    likes: 56,
    comments: 4,
    liked: false,
  },
  {
    id: 2,
    author: "Marcus Lee",
    handle: "@mlee_keto",
    title: "30-Day Keto",
    tag: "Health",
    timeAgo: "12d ago",
    content: "Down 4kg and feeling energetic. Sharing weekly meal templates and progress photos.",
    image: null,
    streak: "12 day streak",
    totalDays: 12,
    createdAt: "2025-07-28T09:00:00Z",
    likes: 18,
    comments: 2,
    liked: false,
  },
  {
    id: 3,
    author: "Sofia Martinez",
    handle: "@sofiabakes",
    title: "Daily Bread Experiment",
    tag: "Hobby",
    timeAgo: "3d ago",
    content: "Tried sourdough again — this time the crumb opened up perfectly. Posting recipe tweaks tomorrow!",
    image: null,
    streak: "3 day streak",
    totalDays: 15,
    createdAt: "2025-08-06T14:20:00Z",
    likes: 42,
    comments: 7,
    liked: false,
  },
];

// map tags to Tailwind badge classes
const TAG_STYLES = {
  Habit: "bg-violet-100 text-violet-700",
  Health: "bg-green-100 text-green-700",
  Hobby: "bg-yellow-100 text-yellow-700",
  default: "bg-gray-100 text-gray-700",
};

function tagClass(tag) {
  return TAG_STYLES[tag] || TAG_STYLES.default;
}

export default function GoalForgeHome() {
  // TODO: when backend is ready, replace initialDummyGoals with fetched data
  // useEffect(()=>{ fetch('/api/goals').then(res=>res.json()).then(setGoals) },[])
  const [dark, setDark] = useDarkMode();
  const [goals, setGoals] = useState(initialDummyGoals);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Simple debounce for search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  // derive list of tags for category filter
  const tags = useMemo(() => {
    const setTags = new Set(goals.map((g) => g.tag));
    return ["All", ...Array.from(setTags)];
  }, [goals]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let out = goals.filter((g) => {
      // Category filter
      if (category !== "All" && g.tag !== category) return false;

      // Search across author, handle, title, content
      if (!q) return true;
      const hay = `${g.author} ${g.handle} ${g.title} ${g.content}`.toLowerCase();
      return hay.includes(q);
    });

    // Sorting
    if (sortBy === "Newest") {
      out = out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "Oldest") {
      out = out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "Trending") {
      out = out.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return out;
  }, [goals, debouncedQuery, category, sortBy]);

  function handleClear() {
    setQuery("");
    setDebouncedQuery("");
    setCategory("All");
    setSortBy("Newest");
  }

  function toggleLike(id) {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== id) return g;
      const liked = !g.liked;
      const likes = (g.likes || 0) + (liked ? 1 : -1);
      return { ...g, liked, likes };
    }));
  }

  function onComment(id) {
    // placeholder - in future open comment drawer or navigate
    console.log('Open comments for', id);
    alert('Comments are not implemented in this demo.');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top navigation */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-4 h-6"><TargetIcon /></div>
              <span className="font-semibold text-lg tracking-tight">GoalForge</span>
            </div>
            <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-gray-100 transition-colors">
                <UserIcon />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <Link
      to="/my-goals"
      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-gray-100 transition-colors"
    >
      <TargetIcon />
      <span className="hidden sm:inline">My Goals</span>
    </Link>
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-gray-900 transition-colors">
                <PlusIcon />
                <span className="hidden sm:inline">Create Goal</span>
            </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md shadow hover:bg-gray-100 transition-colors">
                <LogoutIcon />
                <span className="hidden sm:inline">Logout</span>
            </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-semibold">Explore Feed</h2>
        <p className="mt-1 text-sm text-gray-500">Discover recent goal updates from the GoalForge community</p>

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
                <span className="text-sm text-gray-600">Category:</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent outline-none text-sm">
                  {tags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent outline-none text-sm">
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Trending</option>
                </select>
              </div>
              <button onClick={handleClear} className="text-sm text-gray-600 px-3 py-1">Clear</button>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="mt-8 space-y-6">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">No results found</div>
          ) : (
            filtered.map((g) => (
              <article key={g.id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar name={g.author} />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-semibold">{g.author}</h3>
                          <span className="text-sm text-gray-500">{g.handle}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <h4 className="font-medium">{g.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tagClass(g.tag)}`}>{g.tag}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">{g.timeAgo}</div>
                  </div>

                  <p className="mt-4 text-gray-700 leading-relaxed">{g.content}</p>

                  {/* image placeholder */}
                  <div className="mt-4">
                    <div className="w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 h-48 flex items-center justify-center">
                      {/* Replace this block with <img src={g.image} ... /> when you have real images */}
                      <div className="text-gray-400">Image placeholder</div>
                    </div>
                  </div>

                  {/* footer stats */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 border border-gray-100 rounded-md px-4 py-2 text-sm text-gray-600 inline-flex items-center">
                        <FlameIcon />
                        <span>{g.streak} • {g.totalDays} total days</span>
                      </div>
                    </div>

                    {/* actions row: comment, like, view */}
                    <div className="flex items-center gap-3">
                      <button onClick={() => onComment(g.id)} className="flex items-center gap-2 text-sm text-gray-600 px-3 py-1 rounded-md bg-white border border-gray-200">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{g.comments}</span>
                      </button>

                      <button onClick={() => toggleLike(g.id)} className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md border ${g.liked ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-gray-200 text-gray-600'}`}>
                        {g.liked ? (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21s-7-4.35-9-6.5C-1 10 4 6 7 6c2 0 3.5 1.5 5 3 1.5-1.5 3-3 5-3 3 0 8 4 4 8.5C19 16.65 12 21 12 21z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        <span>{g.likes}</span>
                      </button>

                      <button className="text-sm px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">View goal</button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
