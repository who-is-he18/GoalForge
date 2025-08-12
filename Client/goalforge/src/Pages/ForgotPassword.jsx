import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    // Normally you’d send a password reset request to the backend here
    console.log("Password reset link sent to:", email);

    setMessage(
      "If this email is registered, you will receive a password reset link shortly."
    );
  };

  const onBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">GoalForge</h1>
        <h2 className="text-xl mb-4 text-center">Forgot Password?</h2>
        <p className="mb-6 text-gray-400 text-center">
          Enter your email to receive a password reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition duration-200"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-300">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-400">
          Remember your password?{" "}
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-black underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
