import React from "react";

export default function Logout({ onLogout }) {
  return (
    <div>
      <h1>GoalForge</h1>
      <h2>You are logged in</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
