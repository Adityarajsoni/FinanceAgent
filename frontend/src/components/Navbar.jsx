import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ IMPORT ROUTER
import {
  Bot,
  BarChart3,
  Globe,
  TrendingUp,
  Settings,
  Sun,
  Moon,
  User,
  ChevronDown,
  Zap,
  MapPin,
} from "lucide-react";

export default function Navbar({ isDarkMode = false, onThemeToggle }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation(); // ✅ To highlight active link

  // ✅ ROUTER PATHS
  const navLinks = [
    { name: "Dashboard", icon: BarChart3, href: "/" },
    { name: "Tracker", icon: MapPin, href: "/trading" },
    { name: "News", icon: Globe, href: "/news" },
    { name: "Opportunities", icon: TrendingUp, href: "/opportunities" },
    { name: "Agent Settings", icon: Settings, href: "/settings" },
  ];

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <nav
      className={`${
        isDarkMode
          ? "bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900"
          : "bg-gradient-to-r from-slate-50 via-indigo-50 to-slate-50 border-b border-slate-200"
      } px-8 py-4 backdrop-blur-lg border-b ${
        isDarkMode ? "border-indigo-500/20" : "border-slate-200"
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* ✅ LOGO */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1
              className={`text-2xl font-bold bg-gradient-to-r ${
                isDarkMode
                  ? "from-indigo-400 to-purple-400"
                  : "from-indigo-600 to-purple-600"
              } bg-clip-text text-transparent`}
            >
              BullionBot AI
            </h1>
            <span
              className={`text-xs font-medium ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Arbitrage Trading Agent
            </span>
          </div>
        </div>

        {/* ✅ NAV LINKS */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.name}
                to={link.href} // ✅ Routing Enabled
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? isDarkMode
                      ? "bg-white/20 text-white shadow-lg"
                      : "bg-indigo-100 text-indigo-700 shadow-md"
                    : isDarkMode
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* ✅ RIGHT SECTION (AI Status + Theme + Profile) */}
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full backdrop-blur-sm ${
              isDarkMode ? "bg-white/10" : "bg-slate-100/80"
            }`}
          >
            <Zap className="w-3 h-3 text-green-400" />
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span
              className={`text-xs font-medium ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              AI Active
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 text-yellow-400"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className={`flex items-center space-x-2 p-2 rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl border backdrop-blur-lg z-50 ${
                  isDarkMode
                    ? "bg-slate-800/95 border-slate-700 text-white"
                    : "bg-white/95 border-slate-200 text-slate-700"
                }`}
              >
                <div className="p-3 border-b border-slate-200/20">
                  <p className="font-semibold">Trading Account</p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Premium AI Agent
                  </p>
                </div>
                <div className="py-2">
                  <a href="#portfolio" className="block px-4 py-2 text-sm">
                    Portfolio Overview
                  </a>
                  <a href="#performance" className="block px-4 py-2 text-sm">
                    AI Performance
                  </a>
                  <a href="#preferences" className="block px-4 py-2 text-sm">
                    Trading Preferences
                  </a>
                  <hr
                    className={`my-2 ${
                      isDarkMode ? "border-slate-700" : "border-slate-200"
                    }`}
                  />
                  <a
                    href="#logout"
                    className="block px-4 py-2 text-sm text-red-500"
                  >
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ MOBILE NAV LINKS */}
      <div className="md:hidden mt-4 pt-4 border-t border-slate-200/20">
        <div className="flex justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? isDarkMode
                      ? "text-indigo-400"
                      : "text-indigo-600"
                    : isDarkMode
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
