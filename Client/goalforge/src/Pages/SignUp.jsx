import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupStyled({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // const handleImageSelect = (e) => {
  //   const file = e.target.files && e.target.files[0];
  //   if (file) {
  //     setProfileImage(Object.assign(file, { preview: URL.createObjectURL(file) }));
  //   }
  // };

  const openFilePicker = () => {
    fileInputRef.current?.click();
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

// Inside handleLogin success case:
toast.success("Account created successfully");
setTimeout(() => {
  navigate("/home");
}, 1000); // Short delay to allow toast to render
    } catch (err) {
      console.error(err);
      let msg = "Signup failed. Check your network and try again.";
      if (err.response && err.response.data) {
        msg = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onSwitchToLogin = () => {
    navigate("/");
  };
  const switchToLogin = () => navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-200 shadow-md p-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200 mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#0f172a" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="5" stroke="#0f172a" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="2" fill="#0f172a" />
            </svg>
          </div>

          <h1 className="text-lg font-semibold text-gray-800">GoalForge</h1>
          <h2 className="text-sm text-gray-500 mt-2">Create your account</h2>
          <p className="text-center text-xs text-gray-400 mt-2 px-6">Join GoalForge to start tracking and achieving your goals</p>
        </div>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div className="text-sm">
            {/* <label className="block font-medium text-gray-700">Profile Picture (Optional)</label>
            <div className="flex flex-col items-center mt-3">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-white">
                {profileImage ? (
                  <img src={profileImage.preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />

              <button type="button" onClick={openFilePicker} className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm bg-white hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v4h10v-4M12 12v8M16 8l-4-4-4 4" />
                </svg>
                Choose Image
              </button>
              {profileImage && <p className="text-xs text-gray-500 mt-2">{profileImage.name}</p>}
            </div> */}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full text-sm px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0"
            />
          </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-sm px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                aria-label="toggle password"
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

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full text-sm px-4 py-2 rounded-lg bg-gray-100 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                aria-label="toggle confirm password"
              >
                {showConfirmPassword ? (
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

          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-black text-white text-sm font-medium shadow-sm hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{' '}
          <button onClick={switchToLogin} className="text-black font-medium hover:underline" type="button">Sign in</button>
        </p>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
