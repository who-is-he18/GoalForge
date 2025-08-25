import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginStyled({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const data = res.data;
      const token = data.access_token || data.token;
      if (token) {
        localStorage.setItem("token", token);
      }


      if (typeof onLogin === "function") {
        onLogin(data.user, token);
      }
  toast.success("Signed in successfully");
   setTimeout(() => {
     navigate("/home");
   }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      const msg = err.response && err.response.data && (err.response.data.message || err.response.data.error)
        ? (err.response.data.message || err.response.data.error)
        : "Login failed. Please check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onSwitchToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-200 shadow-md p-8">
        <div className="flex flex-col items-center">
          {/* Target logo */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200 mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#0f172a" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="5" stroke="#0f172a" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="2" fill="#0f172a" />
            </svg>
          </div>

          <h1 className="text-lg font-semibold text-gray-800">GoalForge</h1>
          <h2 className="text-sm text-gray-500 mt-2">Welcome back</h2>
          <p className="text-center text-xs text-gray-400 mt-2 px-6">
            Sign in to your account to continue tracking your goals
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-sm px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-sm px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.112-5.936M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-black text-white text-sm font-medium shadow-sm hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-sm">
          <a href="/forgot-password" className="text-xs text-gray-600 hover:underline">
            Forgot password?
          </a>

          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-xs text-gray-600 hover:underline"
          >
            Create account
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
