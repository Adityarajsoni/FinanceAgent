import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Menu,
  X,
} from "lucide-react";

export default function Navbar({ isDarkMode = false, onThemeToggle }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", icon: BarChart3, href: "/" },
    { name: "Tracker", icon: MapPin, href: "/trading" },
    { name: "News", icon: Globe, href: "/news" },
    { name: "Opportunities", icon: TrendingUp, href: "/opportunities" },
    { name: "Agent Settings", icon: Settings, href: "/settings" },
  ];

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`${
        isDarkMode
          ? "bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900"
          : "bg-gradient-to-r from-slate-50 via-indigo-50 to-slate-50"
      } px-4 sm:px-6 lg:px-8 py-3 sm:py-4 backdrop-blur-lg border-b ${
        isDarkMode ? "border-indigo-500/20" : "border-slate-200"
      } transition-all duration-300 relative z-50`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1
              className={`text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r ${
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
              } hidden sm:block`}
            >
              Arbitrage Trading Agent
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-xl transition-all duration-200 ${
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

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* AI Status - Hidden on small screens */}
          <div
            className={`hidden sm:flex items-center space-x-2 px-2 lg:px-3 py-1 rounded-full backdrop-blur-sm ${
              isDarkMode ? "bg-white/10" : "bg-slate-100/80"
            }`}
          >
            <Zap className="w-3 h-3 text-green-400" />
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span
              className={`text-xs font-medium ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              } hidden lg:block`}
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
            {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Profile - Hidden on mobile, replaced with hamburger */}
          <div className="relative hidden sm:block">
            <button
              onClick={toggleProfile}
              className={`flex items-center space-x-2 p-2 rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                } hidden md:block`}
              />
            </button>

            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-xl shadow-xl border backdrop-blur-lg z-[60] ${
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
                  <a href="#portfolio" className="block px-4 py-2 text-sm hover:bg-slate-100/10 rounded transition-colors">
                    Portfolio Overview
                  </a>
                  <a href="#performance" className="block px-4 py-2 text-sm hover:bg-slate-100/10 rounded transition-colors">
                    AI Performance
                  </a>
                  <a href="#preferences" className="block px-4 py-2 text-sm hover:bg-slate-100/10 rounded transition-colors">
                    Trading Preferences
                  </a>
                  <hr
                    className={`my-2 ${
                      isDarkMode ? "border-slate-700" : "border-slate-200"
                    }`}
                  />
                  <a
                    href="#logout"
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50/10 rounded transition-colors"
                  >
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`sm:hidden p-2 rounded-xl transition-all duration-200 ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={`sm:hidden fixed top-full left-0 right-0 z-[9999] ${
            isDarkMode ? "bg-slate-900/98" : "bg-white/98"
          } backdrop-blur-xl border-b ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          } shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto`}
        >
          {/* Mobile Navigation Links */}
          <div className="px-4 py-6 space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 text-base font-medium ${
                    isActive
                      ? isDarkMode
                        ? "bg-white/20 text-white shadow-lg"
                        : "bg-indigo-100 text-indigo-700 shadow-md"
                      : isDarkMode
                      ? "text-slate-200 hover:text-white hover:bg-white/10"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile AI Status */}
          <div className="px-4 py-4 border-t border-slate-200/20">
            <div
              className={`flex items-center justify-between p-4 rounded-xl ${
                isDarkMode ? "bg-white/10" : "bg-slate-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span
                  className={`text-base font-medium ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  AI Agent Active
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Profile Section */}
          <div className="px-4 pb-6 border-t border-slate-200/20">
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-4 px-4 py-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`font-semibold text-base ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Trading Account
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Premium AI Agent
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="#portfolio" 
                  className={`block px-4 py-3 text-base rounded-lg transition-colors ${
                    isDarkMode ? "text-slate-200 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Portfolio Overview
                </a>
                <a 
                  href="#performance" 
                  className={`block px-4 py-3 text-base rounded-lg transition-colors ${
                    isDarkMode ? "text-slate-200 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  AI Performance
                </a>
                <a 
                  href="#preferences" 
                  className={`block px-4 py-3 text-base rounded-lg transition-colors ${
                    isDarkMode ? "text-slate-200 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Trading Preferences
                </a>
                <a
                  href="#logout"
                  className="block px-4 py-3 text-base text-red-500 hover:bg-red-50/10 rounded-lg transition-colors"
                >
                  Sign Out
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tablet Navigation (md breakpoint) */}
      <div className="hidden sm:flex lg:hidden mt-4 pt-4 border-t border-slate-200/20">
        <div className="flex justify-around w-full">
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