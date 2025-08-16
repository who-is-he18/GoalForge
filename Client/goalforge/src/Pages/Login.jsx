import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", {
      email: email.trim(),
      password,
    });

    const data = res.data;
    console.log("Login success:", data);

    // store JWT token if returned
    const token = data.access_token || data.token;
    if (token) {
      localStorage.setItem("token", token);
    }

    if (typeof onLogin === "function") {
      onLogin(data.user, token);
    }

    navigate("/home"); // redirect after login
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed. Please check your credentials.");
  }
};


  const onSwitchToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">GoalForge</h1>
        <h2 className="text-xl mt-2 text-center text-gray-600">Welcome back</h2>
        <p className="text-center text-gray-500 mt-1">
          Sign in to your account to continue tracking your goals
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-sm text-black hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-black transition duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-black">
          <a href="/forgot-password" className="hover:underline">
            Forgot password?
          </a>
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="hover:underline"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
