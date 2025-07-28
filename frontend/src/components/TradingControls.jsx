// components/TradingControls.js
import React from 'react';
import { DollarSign, Target, Shield, Zap, TrendingUp } from "lucide-react";

export default function TradingControls({ 
  bookedProfit, 
  setBookedProfit, 
  minLoss, 
  setMinLoss, 
  onPlaceOrder, 
  isTrading, 
  price 
}) {
  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glowing orb effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">Quick Trade</h4>
            <p className="text-sm text-gray-500">Set your targets & execute</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Target className="w-3 h-3 text-emerald-600" />
              </div>
              Target Profit (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                value={bookedProfit}
                onChange={(e) => setBookedProfit(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                placeholder="Enter target..."
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-3 h-3 text-red-600" />
              </div>
              Stop Loss (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                value={minLoss}
                onChange={(e) => setMinLoss(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                placeholder="Enter stop loss..."
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600">
                <Shield className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onPlaceOrder}
          disabled={isTrading || !price}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 group/btn"
        >
          <Zap className="w-5 h-5 group-hover/btn:animate-pulse" />
          {isTrading ? 'Position Active' : 'Place Buy Order'}
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        </button>

        {price && (
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl border border-gray-100">
            <div className="text-sm text-gray-600 mb-2 font-medium">Trade Setup Summary</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                <strong className="text-gray-900">Buy:</strong> ₹{price.toLocaleString()}
              </span>
              <span className="text-emerald-600">
                <strong>Target:</strong> +₹{bookedProfit.toLocaleString()}
              </span>
              <span className="text-red-600">
                <strong>Stop:</strong> -₹{minLoss.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-400 rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}