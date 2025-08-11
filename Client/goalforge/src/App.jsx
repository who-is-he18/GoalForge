import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoalForgeHome from "./Pages/HomePage";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Logout from "./Pages/Logout";
import MyGoals from "./Pages/MyGoals";
import CreateGoalPage from "./Pages/CreateGoal";


function App() {
     const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login"); 

  const handleLogin = (email) => {
    setCurrentUser(email);
    setView("logout");
  };

  const handleSignup = (username) => {
    setCurrentUser(username);
    setView("logout");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
  };

  return (
    

    <Router>
      <Routes>
        <Route path="/home" element={<GoalForgeHome />} />
        <Route path="/" element={<Login onLogin={handleLogin} onSwitchToSignup={() => setView("signup")} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} onSwitchToLogin={() => setView("login")} />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        <Route path="/my-goals" element={<MyGoals currentUser={currentUser} />} />
        <Route path="/create-goal" element={<CreateGoalPage />} />
      </Routes>
    </Router>
  )
}

export default App;


 

