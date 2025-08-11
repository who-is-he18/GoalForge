import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoalForgeHome from "./Pages/HomePage";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Logout from "./Pages/Logout";


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
    <div>
      {view === "login" && (
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => setView("signup")}
        />
      )}

      {view === "signup" && (
        <Signup
          onSignup={handleSignup}
          onSwitchToLogin={() => setView("login")}
        />
      )}

      {view === "logout" && <Logout onLogout={handleLogout} />}
    </div>
  );

    <Router>
      <Routes>
        <Route path="/home" element={<GoalForgeHome />} />
      </Routes>
    </Router>

}

export default App;


 

