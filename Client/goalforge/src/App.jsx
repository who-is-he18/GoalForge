// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoalForgeHome from "./Pages/HomePage";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Logout from "./Pages/Logout";
import MyGoals from "./Pages/MyGoals";
import CreateGoalPage from "./Pages/CreateGoal";
import ViewGoal from "./Pages/ViewGoal";
import Profile from "./Pages/Profile";
import LogProgress from "./Pages/LogProgress";
import ForgotPassword from "./Pages/ForgotPassword";
import ProtectedRoute from "./Components/ProtectedRoute";
import api from "./api";

function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export default function App() {
  // restore user object from localStorage if present
  const [currentUser, setCurrentUser] = useState(() => {
    return safeParseJSON(localStorage.getItem("currentUser"));
  });

  // flag that indicates we've checked server session / token validity
  const [authChecked, setAuthChecked] = useState(false);

  // On mount validate token (if present) by calling /me
  useEffect(() => {
    let mounted = true;

    async function restore() {
      const token = localStorage.getItem("token");
      if (!token) {
        // nothing to validate; complete check
        if (mounted) setAuthChecked(true);
        return;
      }

      try {
        // api will attach Authorization header from interceptor
        const res = await api.get("/me");
        if (!mounted) return;

        if (res?.data) {
          setCurrentUser(res.data);
          // keep local copy up to date
          localStorage.setItem("currentUser", JSON.stringify(res.data));
        } else {
          // backend didn't return user, clear
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("token");
        }
      } catch (err) {
        // token invalid or network error: clear stored auth
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
      } finally {
        if (mounted) setAuthChecked(true);
      }
    }

    restore();
    return () => {
      mounted = false;
    };
  }, []);

  // called by Login component: onLogin(user, token)
  const handleLogin = (user, token) => {
    if (token) localStorage.setItem("token", token);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  };

  // called by Signup component: onSignup(user, token)
  const handleSignup = (user, token) => {
    if (token) localStorage.setItem("token", token);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  };

  const handleLogout = async () => {
    try {
      // attempt server logout (optional)
      await api.post("/auth/logout").catch(() => {});
    } catch (err) {
      // ignore
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    }
  };

  // Wait until we've checked auth to avoid flashes/redirects
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* simple spinner / loading UI */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <GoalForgeHome currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Logout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-goals"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <MyGoals currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-goal"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <CreateGoalPage currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goal/:id"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <ViewGoal currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Profile currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/log-progress/:id"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <LogProgress currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
