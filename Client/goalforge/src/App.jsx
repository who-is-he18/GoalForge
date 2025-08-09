import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoalForgeHome from "./Pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<GoalForgeHome />} />
      </Routes>
    </Router>
  );
}

export default App;
