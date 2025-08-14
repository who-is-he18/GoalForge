// src/pages/ViewGoal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";

/* --- Small helpers & icons (match home page styling) --- */
const Avatar = ({ name, src }) => (
  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-sm text-gray-600">
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : (name?.[0] || "U")}
  </div>
);

const TargetIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
  </svg>
);

/* ---------------- Dummy data (local) ---------------- */
const DUMMY_GOALS = [
  {
    id: 1,
    user_id: 11,
    title: "Write 500 Words Daily",
    description: "Daily short-form writing to build a habit. Focus: short stories and microfiction.",
    category: "Habit",
    frequency: "daily",
    start_date: "2025-07-01",
    end_date: "2025-12-31",
    is_public: true,
    streak_count: 8,
    longest_streak: 31,
    created_at: "2025-07-01T08:30:00Z",
    progress_logs: [
      {
        id: 101,
        goal_id: 1,
        date: "2025-08-01",
        note: "Wrote 500 words on a time-travel story. Experimented with unreliable narrator.",
        media_url: null,
        xp_earned: 10,
        created_at: "2025-08-01T10:00:00Z"
      },
      {
        id: 102,
        goal_id: 1,
        date: "2025-08-02",
        note: "Rewrote opening. Hit 600 words. Felt energized.",
        media_url: null,
        xp_earned: 10,
        created_at: "2025-08-02T09:30:00Z"
      }
    ]
  },
  {
    id: 2,
    user_id: 22,
    title: "30-Day Keto",
    description: "Follow keto meal plan and log meals daily.",
    category: "Health",
    frequency: "daily",
    start_date: "2025-07-15",
    end_date: "2025-08-14",
    is_public: true,
    streak_count: 12,
    longest_streak: 12,
    created_at: "2025-07-15T09:00:00Z",
    progress_logs: [
      {
        id: 201,
        goal_id: 2,
        date: "2025-07-16",
        note: "Meal prep for the week. Feeling good after first day.",
        media_url: null,
        xp_earned: 10,
        created_at: "2025-07-16T08:00:00Z"
      }
    ]
  }
];

/* ---------------- Component ---------------- */
function formatDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

export default function ViewGoal() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Attempt to use state passed from the feed
  const initialFromState = location.state?.goal || null;

  const [goal, setGoal] = useState(initialFromState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // client-side comments for each progress item
  const [commentsByProgress, setCommentsByProgress] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // If no state, load from local dummy data
  useEffect(() => {
    if (!goal) {
      setLoading(true);
      // emulate fetch from local dummy data
      const numericId = Number(id);
      const found = DUMMY_GOALS.find((g) => g.id === numericId);
      if (found) {
        setGoal(found);
      } else {
        setError("Goal not found (dummy data).");
      }
      setLoading(false);
    }
  }, [id, goal]);

  // initialize comments map when goal is available
  useEffect(() => {
    if (goal) {
      const map = {};
      (goal.progress_logs || []).forEach((p) => (map[p.id] = []));
      setCommentsByProgress(map);
    }
  }, [goal]);

  const progressPercent = useMemo(() => {
    if (!goal) return null;
    if (!goal.start_date || !goal.end_date) return null;
    const start = new Date(goal.start_date);
    const end = new Date(goal.end_date);
    const now = new Date();
    const total = end - start;
    const done = Math.min(Math.max(now - start, 0), total);
    if (total <= 0) return 100;
    return Math.round((done / total) * 100);
  }, [goal]);

  function handleCommentInputChange(progressId, value) {
    setCommentInputs((prev) => ({ ...prev, [progressId]: value }));
  }

  function addComment(progressId) {
    const text = (commentInputs[progressId] || "").trim();
    if (!text) return;
    const c = {
      id: Date.now(),
      author: "Current User",
      text,
      likes: 0,
      liked: false,
      created_at: new Date().toISOString()
    };
    setCommentsByProgress((prev) => {
      const next = { ...prev };
      next[progressId] = [...(next[progressId] || []), c];
      return next;
    });
    setCommentInputs((prev) => ({ ...prev, [progressId]: "" }));
  }

  function toggleLikeComment(progressId, commentId) {
    setCommentsByProgress((prev) => {
      const next = { ...prev };
      next[progressId] = (next[progressId] || []).map((c) =>
        c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c
      );
      return next;
    });
  }

  if (loading) return <div className="p-8 text-center text-gray-600">Loading...</div>;
  if (error) return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white border rounded-xl p-6 text-red-600">{error}</div>
      <div className="mt-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Back</button>
      </div>
    </div>
  );

  if (!goal) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6"><TargetIcon /></div>
            <div>
              <h1 className="text-lg font-semibold">Goal Details</h1>
              <div className="text-sm text-gray-500">Progress, logs and notes</div>
            </div>
          </div>
          <div>
            <Link to="/" className="text-sm px-3 py-1 rounded-md bg-white border border-gray-200">Back to feed</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* header card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-600">
                {goal.title?.[0] || "G"}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{goal.title}</h2>
                  <div className="mt-1 text-sm text-gray-500">{goal.category} • {goal.frequency}</div>
                </div>
                <div className="text-sm text-gray-500">{formatDate(goal.created_at)}</div>
              </div>

              <p className="mt-4 text-gray-700">{goal.description || "No description provided."}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-md px-4 py-2 text-sm text-gray-600 inline-flex items-center">
                  <div className="text-xs text-gray-500">Start</div>
                  <div className="ml-3 font-medium">{formatDate(goal.start_date)}</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-md px-4 py-2 text-sm text-gray-600 inline-flex items-center">
                  <div className="text-xs text-gray-500">End</div>
                  <div className="ml-3 font-medium">{goal.end_date ? formatDate(goal.end_date) : "—"}</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-md px-4 py-2 text-sm text-gray-600 inline-flex items-center">
                  <div className="text-xs text-gray-500">Streak</div>
                  <div className="ml-3 font-medium">{goal.streak_count ?? 0} days</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-md px-4 py-2 text-sm text-gray-600 inline-flex items-center">
                  <div className="text-xs text-gray-500">Longest</div>
                  <div className="ml-3 font-medium">{goal.longest_streak ?? 0} days</div>
                </div>
              </div>

              {/* progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <div>Progress</div>
                  <div>{progressPercent === null ? "N/A" : `${progressPercent}%`}</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${progressPercent || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* progress logs */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Progress logs</h3>

          {(goal.progress_logs && goal.progress_logs.length > 0) ? (
            goal.progress_logs.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar name={String(p.id)} />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-sm font-semibold">Update — {formatDate(p.date)}</div>
                        <div className="text-xs text-gray-500">XP: {p.xp_earned ?? 0} • {formatDate(p.created_at)}</div>
                      </div>
                      <div className="text-sm text-gray-500">{p.media_url ? "📷" : ""}</div>
                    </div>

                    <div className="mt-3 text-gray-700">{p.note || "No note provided."}</div>

                    {p.media_url && (
                      <div className="mt-3">
                        <img src={p.media_url} alt="progress media" className="w-full rounded-md border border-gray-200" />
                      </div>
                    )}

                    {/* comments for this progress (client-side) */}
                    <div className="mt-4 border-t pt-3">
                      <div className="flex gap-3 items-start">
                        <Avatar name="You" />
                        <div className="flex-1">
                          <textarea
                            rows={2}
                            value={commentInputs[p.id] || ""}
                            onChange={(e) => handleCommentInputChange(p.id, e.target.value)}
                            className="w-full border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            placeholder="Add a comment..."
                          />
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <button onClick={() => setCommentInputs((c) => ({ ...c, [p.id]: "" }))} className="text-sm text-gray-500 px-3 py-1">Cancel</button>
                            <button onClick={() => addComment(p.id)} className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white">Comment</button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {(commentsByProgress[p.id] || []).length === 0 ? (
                          <div className="text-sm text-gray-500">No comments yet</div>
                        ) : (
                          (commentsByProgress[p.id] || []).map((c) => (
                            <div key={c.id} className="flex items-start gap-3">
                              <Avatar name={c.author} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-sm font-semibold">{c.author}</div>
                                    <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <button onClick={() => toggleLikeComment(p.id, c.id)} className={`text-sm px-2 py-1 rounded-md ${c.liked ? "text-red-600" : "text-gray-600"}`}>
                                      {c.liked ? "♥" : "♡"} {c.likes}
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-1 text-gray-700">{c.text}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-500">No progress logs yet.</div>
          )}
        </div>
      </main>
    </div>
  );
}
