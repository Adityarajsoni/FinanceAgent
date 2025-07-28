// components/PriceCard.js
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Activity,
  Zap
} from "lucide-react";

export default function PriceCard({ 
  price, 
  lastPrice, 
  isConnected, 
  isRefreshing, 
  onRefresh 
}) {
  const priceChange = lastPrice && price ? 
    (price > lastPrice ? 'up' : price < lastPrice ? 'down' : null) : null;
  
  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glowing orb effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Silver Price</h3>
              <p className="text-sm text-gray-500">Live Market Data</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
              isConnected 
                ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200 shadow-emerald-100 shadow-md' 
                : 'bg-red-50/80 text-red-700 border-red-200 shadow-red-100 shadow-md'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
              }`} />
              {isConnected ? 'Live' : 'Offline'}
            </div>
            
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-lg rounded-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="relative">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                ₹{price?.toLocaleString() || '--'}
              </span>
              {priceChange && (
                <div className={`absolute -top-2 -right-12 flex items-center animate-bounce ${
                  priceChange === 'up' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {priceChange === 'up' ? 
                    <TrendingUp className="w-6 h-6" /> : 
                    <TrendingDown className="w-6 h-6" />
                  }
                </div>
              )}
            </div>
          </div>
          
          {lastPrice && price && price !== lastPrice && (
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
              price > lastPrice 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {price > lastPrice ? '▲' : '▼'}
              {Math.abs(price - lastPrice).toLocaleString()} 
              ({((price - lastPrice) / lastPrice * 100).toFixed(2)}%)
            </div>
          )}
        </div>

        {/* Modern price bars visualization */}
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-500 ${
                isConnected ? 'bg-gradient-to-t from-blue-400 to-blue-600' : 'bg-gray-300'
              }`}
              style={{ 
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Zap className="w-3 h-3" />
          <span>Real-time updates</span>
        </div>
      </div>
    </div>
  );
}