import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TradingDashboard from "./pages/TradingDashboard";
import News from "./pages/News";
import Opportunities from "./pages/Opportunities"; // ✅ Import new page

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/trading"
          element={
            <>
              <Navbar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
              <TradingDashboard isDarkMode={isDarkMode} />
            </>
          }
        />

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

        {/* ✅ New AI Opportunities page */}
        <Route
          path="/opportunities"
          element={
            <>
              <Navbar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
              <div className="p-6">
                <Opportunities />
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
