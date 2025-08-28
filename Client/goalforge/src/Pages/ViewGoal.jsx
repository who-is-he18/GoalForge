// src/pages/ViewGoal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api"; // your api.js with interceptor

/* ------------------ Small helpers ------------------ */
function formatDateTime(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
function formatDate(d) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
}
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
const Avatar = ({ src, name, size = 40 }) => (
  <div
    className="rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-600"
    style={{ width: size, height: size }}
    title={name}
  >
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : (name?.[0] || "U")}
  </div>
);

/* ------------------ Page ------------------ */
export default function ViewGoal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const me = useMemo(() => getCurrentUser(), []);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // commentsByProgress[progressId] = [comment,...]
  const [commentsByProgress, setCommentsByProgress] = useState({});
  // cheersByProgress[progressId] = [cheerObj,...]
  const [cheersByProgress, setCheersByProgress] = useState({});
  // my cheers map
  const [myCheersMap, setMyCheersMap] = useState({});
  // followers list (raw follower records)
  const [followers, setFollowers] = useState([]);
  // usersMap: { userId: userObj }
  const [usersMap, setUsersMap] = useState({});
  // comment inputs
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        // 1) goal
        const gRes = await api.get(`/goals/${id}`);
        if (cancelled) return;
        const g = gRes.data;
        setGoal(g);

        // 2) comments for goal
        const cRes = await api.get(`/comments`, { params: { goal_id: id } });
        if (cancelled) return;
        const comments = cRes.data || [];
        const cbp = {};
        comments.forEach((c) => {
          const gp = c.goal_progress_id;
          if (!cbp[gp]) cbp[gp] = [];
          cbp[gp].push(c);
        });
        setCommentsByProgress(cbp);

        // 3) cheers for goal
        const chRes = await api.get(`/cheers`, { params: { goal_id: id } });
        if (cancelled) return;
        const cheers = chRes.data || [];
        const cheersMap = {};
        const mine = {};
        cheers.forEach((ch) => {
          const gp = ch.goal_progress_id;
          if (!cheersMap[gp]) cheersMap[gp] = [];
          cheersMap[gp].push(ch);
          if (me && ((ch.user && ch.user.id === me.id) || ch.user_id === me.id)) {
            mine[gp] = ch.id;
          }
        });
        setCheersByProgress(cheersMap);
        setMyCheersMap(mine);

        // 4) followers + users together
        await reloadFollowersAndUsers(cancelled);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load goal data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, me]);

  // reload followers and users (used after follow/unfollow)
  async function reloadFollowersAndUsers(cancelledFlag = false) {
    try {
      const fRes = await api.get("/followers");
      if (cancelledFlag) return;
      const fetchedFollowers = fRes.data || [];
      // keep only followers of this goal
      const goalFollowers = fetchedFollowers.filter((f) => f.followed_goal_id === Number(id));
      setFollowers(goalFollowers);

      // fetch all users and build map (backend returns all users at /api/users)
      // NOTE: If your app has many users, better add backend filter: /api/users?ids=1,2,3
      const uRes = await api.get("/users");
      if (cancelledFlag) return;
      const users = uRes.data || [];
      const map = {};
      users.forEach((u) => {
        map[u.id] = u;
      });
      setUsersMap(map);
    } catch (err) {
      console.error("Failed to reload followers/users", err);
      // best-effort: keep existing followers/usersMap if available
    }
  }

  // helper: compute progress percent (same as before)
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

  /* ------------------ Actions ------------------ */

  async function toggleCheerForProgress(progressId) {
    if (!me) {
      alert("Please log in to cheer.");
      return;
    }

    const existingCheerId = myCheersMap[progressId];

    if (existingCheerId) {
      setMyCheersMap((m) => {
        const next = { ...m };
        delete next[progressId];
        return next;
      });
      setCheersByProgress((m) => ({ ...m, [progressId]: (m[progressId] || []).filter((c) => c.id !== existingCheerId) }));
      try {
        await api.delete(`/cheers/${existingCheerId}`);
      } catch (err) {
        console.error("Failed to remove cheer", err);
        await reloadCheers();
      }
    } else {
      const tempId = `temp-${Date.now()}`;
      const tempCheer = { id: tempId, user: { id: me.id, username: me.username, profile_pic: me.profile_pic }, goal_progress_id: progressId };
      setMyCheersMap((m) => ({ ...m, [progressId]: tempId }));
      setCheersByProgress((m) => ({ ...m, [progressId]: [...(m[progressId] || []), tempCheer] }));
      try {
        const res = await api.post("/cheers", { goal_progress_id: progressId });
        const created = res.data;
        setCheersByProgress((m) => {
          const arr = (m[progressId] || []).map((c) => (c.id === tempId ? created : c));
          return { ...m, [progressId]: arr };
        });
        setMyCheersMap((m) => ({ ...m, [progressId]: created.id }));
      } catch (err) {
        console.error("Failed to add cheer", err);
        await reloadCheers();
      }
    }
  }

  async function reloadCheers() {
    try {
      const chRes = await api.get("/cheers", { params: { goal_id: id } });
      const cheers = chRes.data || [];
      const cheersMap = {};
      const mine = {};
      cheers.forEach((ch) => {
        const gp = ch.goal_progress_id;
        if (!cheersMap[gp]) cheersMap[gp] = [];
        cheersMap[gp].push(ch);
        if (me && ((ch.user && ch.user.id === me.id) || ch.user_id === me.id)) mine[gp] = ch.id;
      });
      setCheersByProgress(cheersMap);
      setMyCheersMap(mine);
    } catch (err) {
      console.error("reloadCheers failed", err);
    }
  }

  async function addComment(progressId) {
    if (!me) return alert("Please log in to comment.");
    const text = (commentInputs[progressId] || "").trim();
    if (!text) return;
    const temp = {
      id: `temp-${Date.now()}`,
      content: text,
      user: { id: me.id, username: me.username, profile_pic: me.profile_pic },
      created_at: new Date().toISOString(),
      goal_progress_id: progressId,
    };
    setCommentsByProgress((m) => ({ ...m, [progressId]: [...(m[progressId] || []), temp] }));
    setCommentInputs((s) => ({ ...s, [progressId]: "" }));
    try {
      const res = await api.post("/comments", { goal_progress_id: progressId, content: text });
      const created = res.data;
      setCommentsByProgress((m) => {
        const arr = (m[progressId] || []).map((c) => (c.id === temp.id ? created : c));
        return { ...m, [progressId]: arr };
      });
    } catch (err) {
      console.error("Failed to add comment", err);
      await reloadComments();
    }
  }

  async function reloadComments() {
    try {
      const cRes = await api.get("/comments", { params: { goal_id: id } });
      const comments = cRes.data || [];
      const cbp = {};
      comments.forEach((c) => {
        const gp = c.goal_progress_id;
        if (!cbp[gp]) cbp[gp] = [];
        cbp[gp].push(c);
      });
      setCommentsByProgress(cbp);
    } catch (err) {
      console.error("reloadComments failed", err);
    }
  }



  /* ------------------ Render ------------------ */
  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  }
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg border text-red-600">{error}</div>
        <div className="mt-4">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-indigo-600 text-white">Back</button>
        </div>
      </div>
    );
  }
  if (!goal) {
    return null;
  }

  // is current user following this goal?
  const isFollowing = me && followers.some((f) => f.follower_id === me.id && f.followed_goal_id === Number(id));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Goal Details</h1>
            <div className="text-sm text-gray-500">Progress feed, comments and cheers</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-semibold text-gray-600">
                  {goal.title?.[0] || "G"}
                </div>


                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{goal.title}</h2>
                  <div className="text-sm text-gray-500 mt-1">{goal.category} • {goal.frequency}</div>
                </div>
              </div>

              <p className="mt-4 text-gray-700 text-sm">{goal.description || "No description provided."}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Current</div>
                  <div className="mt-1 font-semibold text-indigo-600">{goal.streak_count ?? 0}</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Longest</div>
                  <div className="mt-1 font-semibold text-yellow-600">{goal.longest_streak ?? 0}</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <div><span className="text-gray-500">Started:</span> <span className="font-medium">{formatDate(goal.start_date)}</span></div>
                <div><span className="text-gray-500">Target End:</span> <span className="font-medium">{formatDate(goal.end_date)}</span></div>
                <div><span className="text-gray-500">Followers:</span> <span className="font-medium">{followers.length}</span></div>
              </div>

            </div>

            {/* followers quick list */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Followers</h3>
                <div className="text-xs text-gray-500">{followers.length}</div>
              </div>
              <div className="mt-4 space-y-3">
                {followers.length === 0 && <div className="text-sm text-gray-500">No followers yet</div>}
                {followers.slice(0, 6).map((f) => {
                  const user = usersMap[f.follower_id];
                  return (
                    <div key={f.id} className="flex items-center gap-3">
                      <Avatar src={user?.profile_pic} name={user?.username || `User ${f.follower_id}`} size={40} />
                      <div>
                        <div className="text-sm font-medium">{user ? user.username : `User ${f.follower_id}`}</div>
                        <div className="text-xs text-gray-500">{user ? user.email : `ID ${f.follower_id}`}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Feed */}
          <section className="col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">Progress Logs</button>
                <button className="px-3 py-1 rounded-full text-sm text-gray-600 hover:bg-gray-50">Activity Feed</button>
              </div>
              <div className="text-sm text-gray-500">Recent updates</div>
            </div>
                            {/* Hero Image */}
{goal.image_url && (
  <div className="w-full h-56 sm:h-80 bg-gray-100 overflow-hidden rounded-b-lg">
    <img src={goal.image_url} alt={goal.title} className="w-full h-full object-cover" />
  </div>
)}

            {/* Progress logs */}
            <div className="space-y-4">
              {(goal.progress_logs && goal.progress_logs.length > 0) ? (
                goal.progress_logs.map((p) => {
                  const comments = commentsByProgress[p.id] || [];
                  const cheers = cheersByProgress[p.id] || [];
                  const myCheerId = myCheersMap[p.id] || null;
                  return (
                    <article key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Avatar name={`P${p.id}`} size={44} />
                            <div>
                              <div className="text-sm font-semibold">{goal.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{formatDate(p.date)} • +{p.xp_earned ?? 0} XP</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">•••</div>
                        </div>
                      </div>

                      {p.media_url && (
                        <div className="w-full h-44 bg-gray-100">
                          <img src={p.media_url} alt="progress media" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="p-4">
                        <p className="text-gray-700">{p.note}</p>

                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <button onClick={() => toggleCheerForProgress(p.id)} className={`inline-flex items-center gap-2 ${myCheerId ? "text-red-600" : "text-gray-600"}`}>
                              <span className="text-lg">{myCheerId ? "♥" : "♡"}</span>
                              <span>{(cheers || []).length}</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                              <span>{comments.length}</span>
                            </div>
                          </div>

                          <div className="text-xs text-gray-400">Posted {formatDateTime(p.created_at)}</div>
                        </div>

                        {/* comments */}
                        <div className="mt-4 border-t pt-4">
                          <div className="flex items-start gap-3">
                            <Avatar name={me?.username || "You"} size={40} />
                            <div className="flex-1">
                              <textarea
                                rows={2}
                                value={commentInputs[p.id] || ""}
                                onChange={(e) => setCommentInputs((s) => ({ ...s, [p.id]: e.target.value }))}
                                className="w-full border border-gray-200 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
                                placeholder="Add a comment..."
                              />
                              <div className="mt-2 flex items-center justify-end gap-2">
                                <button onClick={() => setCommentInputs((s) => ({ ...s, [p.id]: "" }))} className="text-sm text-gray-500 px-3 py-1">Cancel</button>
                                <button onClick={() => addComment(p.id)} className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white">Comment</button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            {comments.length === 0 ? (
                              <div className="text-sm text-gray-500">No comments yet</div>
                            ) : (
                              comments.map((c) => (
                                <div key={c.id} className="flex items-start gap-3">
                                  <Avatar src={c.user?.profile_pic} name={c.user?.username || `U${c.user_id}`} size={36} />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-semibold">{c.user?.username || `User ${c.user_id}`}</div>
                                        <div className="text-xs text-gray-400">{formatDateTime(c.created_at)}</div>
                                      </div>
                                    </div>
                                    <div className="mt-1 text-gray-700">{c.content}</div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-500">No progress logs yet.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
