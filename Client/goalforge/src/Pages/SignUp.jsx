import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // axios instance (Vite / import.meta.env)

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Basic client-side password strength check (optional)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Prepare payload matching your backend RegisterResource expectations
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password,
        confirm_password: confirmPassword,
      };

      // NOTE: current backend route expects JSON fields.
      // change the backend to accept multipart/form-data and use FormData here.
      // Example (DO NOT use unless backend supports it):
      // const formData = new FormData();
      // formData.append("username", username);
      // formData.append("email", email);
      // formData.append("password", password);
      // formData.append("confirm_password", confirmPassword);
      // if (profileImage) formData.append("profile_image", profileImage);
      // await api.post("/users/register", formData, { headers: { "Content-Type": "multipart/form-data" } });

      const res = await api.post("/users/register", payload);
      const data = res.data;

      // backend returns { message, access_token, user: {...} }
      const accessToken = data.access_token || data.token || null;
      const user = data.user || null;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }

      // call parent's onSignup callback if provided: pass user and token
      if (typeof onSignup === "function") {
        try {
          onSignup(user, accessToken);
        } catch (err) {
          // parent callback error shouldn't block flow
          console.warn("onSignup callback error:", err);
        }
      }

      // navigate to a post-signup page — change as you wish
      // I pick "/dashboard" as a reasonable default; change or remove if your app differs.
      navigate("/home");
    } catch (err) {
      console.error("Signup failed:", err);
      // axios error shape handling
      if (err.response && err.response.data) {
        const msg =
          err.response.data.message ||
          err.response.data.error ||
          JSON.stringify(err.response.data);
        setError(msg);
      } else {
        setError("Failed to register. Please check your network and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSwitchToLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-black">GoalForge</h1>
        <h2 className="text-xl mt-2 text-center text-gray-800">
          Create your account
        </h2>
        <p className="text-center text-gray-600 mt-1">
          Join GoalForge to start tracking and achieving your goals
        </p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          {/* Profile Picture */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Profile Picture (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-gray-700"
            />
            {profileImage && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {profileImage.name}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <div className="flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="ml-2 text-sm text-black hover:underline"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-black font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
