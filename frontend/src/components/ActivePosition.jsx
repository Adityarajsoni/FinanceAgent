// components/ActivePosition.js - Fixed with Dynamic P&L and Current Price Display
import React from 'react';
import { Activity, TrendingUp, TrendingDown, X, Zap } from "lucide-react";

export default function ActivePosition({ 
  buyPrice, 
  currentPrice,  // ✅ NEW: Added current price prop
  currentPnL, 
  bookedProfit, 
  minLoss, 
  onClose 
}) {
  const pnlColor = currentPnL > 0 ? 'text-emerald-600' : 
                   currentPnL < 0 ? 'text-red-600' : 'text-gray-600';
  
  const pnlIcon = currentPnL > 0 ? <TrendingUp className="w-5 h-5" /> : 
                  currentPnL < 0 ? <TrendingDown className="w-5 h-5" /> : 
                  <Activity className="w-5 h-5" />;

  const progressPercentage = Math.min(100, Math.abs(currentPnL) / Math.max(bookedProfit, minLoss) * 100);

  // ✅ NEW: Calculate percentage change
  const percentageChange = buyPrice ? ((currentPnL / buyPrice) * 100).toFixed(2) : 0;

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-2xl border border-blue-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glowing orb effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Active Position</h4>
              <p className="text-sm text-gray-500">Live P&L tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">LIVE</span>
          </div>
        </div>
        
        {/* ✅ UPDATED: Enhanced grid with current price */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white transition-all duration-300">
            <div className="text-sm font-medium text-gray-600 mb-1">Buy Price</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{buyPrice?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">Entry point</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white transition-all duration-300">
            <div className="text-sm font-medium text-gray-600 mb-1">Current Price</div>
            <div className="text-2xl font-bold text-blue-600">
              ₹{currentPrice?.toLocaleString() || '--'}
            </div>
            <div className="text-xs text-blue-500 mt-1">Live market</div>
          </div>
        </div>

        {/* ✅ UPDATED: Enhanced P&L section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white transition-all duration-300 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Current P&L</div>
            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
              currentPnL >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange}%
            </div>
          </div>
          <div className={`text-3xl font-black flex items-center gap-3 ${pnlColor}`}>
            {pnlIcon}
            <span>
              {currentPnL >= 0 ? '+' : ''}₹{Math.abs(currentPnL).toLocaleString()}
            </span>
          </div>
          <div className={`text-sm mt-1 font-medium ${pnlColor}`}>
            {currentPnL >= 0 ? '🎯 In Profit' : '⚠️ In Loss'} • Live Update
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Progress to Target</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                currentPnL >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Stop: -₹{minLoss.toLocaleString()}</span>
            <span>Target: +₹{bookedProfit.toLocaleString()}</span>
          </div>
        </div>

        {/* ✅ NEW: Live Trade Summary */}
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-4 border border-blue-100 mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Live Trade Summary
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Difference:</span>
              <div className={`font-bold ${currentPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                ₹{Math.abs(currentPnL).toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-gray-500">To Target:</span>
              <div className="font-bold text-emerald-600">
                ₹{Math.max(0, bookedProfit - currentPnL).toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-gray-500">From Stop:</span>
              <div className="font-bold text-red-600">
                ₹{Math.max(0, currentPnL + minLoss).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-red-500/25 flex items-center justify-center gap-3 group/btn"
        >
          <X className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
          Close Position
          <Zap className="w-4 h-4 opacity-70" />
        </button>
      </div>
    </div>
  );
}