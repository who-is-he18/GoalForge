import React from "react";
import { useNavigate } from "react-router-dom";


export default function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Logout</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to log out?
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}