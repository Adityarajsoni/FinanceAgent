import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TradingDashboard from "./pages/TradingDashboard"; // ✅ Updated import
import News from "./pages/News";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const handleThemeToggle = () => setIsDarkMode(!isDarkMode);
  
  return (
    <Router>
      <Routes>
        {/* ✅ Dashboard includes Navbar internally */}
        <Route path="/" element={<Dashboard />} />
        
        {/* ✅ Trading Dashboard page (formerly Tracker) */}
        <Route
          path="/trading"
          element={
            <>
              <Navbar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
              <TradingDashboard isDarkMode={isDarkMode} />
            </>
          }
        />
        
        {/* ✅ News page */}
        <Route
          path="/news"
          element={
            <>
              <Navbar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
              <div className="p-6">
                <News isDarkMode={isDarkMode} />
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;