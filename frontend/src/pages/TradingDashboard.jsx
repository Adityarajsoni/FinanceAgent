// TradingDashboard.js - Main component with Fixed Dynamic P&L
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Activity } from "lucide-react";

// Import components from components folder
import PriceCard from '../components/tradingDashboard/PriceCard';
import TradingControls from '../components/tradingDashboard/TradingControls';
import ActivePosition from '../components/tradingDashboard/ActivePosition';
import TradingHistory from '../components/tradingDashboard/TradingHistory';
import Notifications from '../components/tradingDashboard/Notifications';

export default function TradingDashboard() {
  // Price and market data
  const [price, setPrice] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Trading parameters
  const [bookedProfit, setBookedProfit] = useState(500);
  const [minLoss, setMinLoss] = useState(300);
  const [buyPrice, setBuyPrice] = useState(null);
  const [currentPnL, setCurrentPnL] = useState(0);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeId, setTradeId] = useState(null);
  
  // UI states
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [tradingHistory, setTradingHistory] = useState([]);
  const [totalPnL, setTotalPnL] = useState(0);
  
  const intervalRef = useRef(null);
  const notificationIdRef = useRef(0);

  // Notification system
  const addNotification = (message, type = "info") => {
    const id = notificationIdRef.current++;
    const notification = { id, message, type, timestamp: Date.now() };
    setNotifications(prev => [notification, ...prev.slice(0, 2)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Calculate P&L dynamically whenever price or buyPrice changes
  useEffect(() => {
    if (isTrading && buyPrice && price) {
      const pnl = price - buyPrice;
      setCurrentPnL(pnl);
      
      // Check for profit/loss targets automatically
      if (pnl >= bookedProfit) {
        closeTrade(price, "target");
        addNotification("🎯 Target Profit Reached!", "success");
      } else if (pnl <= -minLoss) {
        closeTrade(price, "stop_loss");
        addNotification("🛡️ Stop Loss Triggered!", "error");
      }
    }
  }, [price, buyPrice, isTrading, bookedProfit, minLoss]);

  // Calculate P&L dynamically whenever price or buyPrice changes
  useEffect(() => {
    if (isTrading && buyPrice && price) {
      const pnl = price - buyPrice;
      setCurrentPnL(pnl);
      
      // Check for profit/loss targets automatically
      if (pnl >= bookedProfit) {
        closeTrade(price, "target");
        addNotification("🎯 Target Profit Reached!", "success");
      } else if (pnl <= -minLoss) {
        closeTrade(price, "stop_loss");
        addNotification("🛡️ Stop Loss Triggered!", "error");
      }
    }
  }, [price, buyPrice, isTrading, bookedProfit, minLoss]);

  // Fetch current silver price
  const fetchPrice = async () => {
    setIsRefreshing(true);
    
    try {
      const res = await fetch("http://127.0.0.1:5000/silver-price");
      const data = await res.json();

      if (data.currVal && data.currVal !== "--") {
        const newPrice = parseFloat(data.currVal);
        setLastPrice(price);
        setPrice(newPrice);
        setIsConnected(true);
        
        // P&L calculation is now handled by useEffect above
        // No need to duplicate logic here
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setIsConnected(false);
      addNotification("Connection failed", "error");
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  // Place buy order
  const placeOrder = async () => {
    if (!price) {
      addNotification("No valid price available!", "error");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buy_price: price,
          booked_profit: bookedProfit,
          min_loss: minLoss,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        addNotification(`Order failed: ${res.status} ${res.statusText}`, "error");
        return;
      }

      const result = await res.json();
      setBuyPrice(price);
      setCurrentPnL(0); // Start with 0, will be calculated by useEffect
      setIsTrading(true);
      setTradeId(result.trade_id);
      addNotification(`📈 Buy order placed at ₹${price.toLocaleString()}`, "success");
      
    } catch (err) {
      addNotification(`Order failed: ${err.message}`, "error");
    }
  };

  // Close trade (automatic or manual)
  const closeTrade = async (sellPrice, reason = "manual") => {
    if (!tradeId) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trade_id: tradeId,
          sell_price: sellPrice,
          reason: reason
        }),
      });

      if (!res.ok) {
        if (reason === "manual") {
          addNotification("Failed to close position", "error");
        }
        return;
      }

      const result = await res.json();
      
      // Reset trading state
      setIsTrading(false);
      setBuyPrice(null);
      setCurrentPnL(0);
      setTradeId(null);
      
      // Update totals
      setTotalPnL(result.total_pnl);
      fetchTradingHistory();
      
      // Show notification for manual closes
      if (reason === "manual") {
        const pnl = result.trade.pnl;
        const pnlText = pnl >= 0 ? `+₹${pnl.toLocaleString()}` : `-₹${Math.abs(pnl).toLocaleString()}`;
        addNotification(`⏹️ Position closed: ${pnlText}`, pnl >= 0 ? "success" : "error");
      }
      
    } catch (err) {
      if (reason === "manual") {
        addNotification("Failed to close position", "error");
      }
    }
  };

  // Manual stop trading
  const stopTrading = () => {
    if (price) {
      closeTrade(price, "manual");
    }
  };

  // Fetch trading history
  const fetchTradingHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/history");
      if (res.ok) {
        const data = await res.json();
        setTradingHistory(data.completed_trades || []);
        setTotalPnL(data.total_pnl || 0);
      }
    } catch (err) {
      console.error("Failed to fetch trading history:", err);
    }
  };

  // Initialize and setup auto-refresh
  useEffect(() => {
    fetchPrice();
    fetchTradingHistory();
    
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchPrice, 10000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Notifications */}
      <Notifications notifications={notifications} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-6">
            <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">Live Trading Platform</span>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Trading Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real-time commodity trading with advanced analytics and automated risk management
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-6 rounded-full" />
        </div>

        {/* Auto Refresh Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border ${
              autoRefresh
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25 border-emerald-400' 
                : 'bg-white/80 text-gray-700 hover:bg-white border-gray-200 shadow-gray-200/50'
            }`}
          >
            {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>Auto Refresh {autoRefresh ? 'On' : 'Off'}</span>
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Price Card */}
          <PriceCard 
            price={price}
            lastPrice={lastPrice}
            isConnected={isConnected}
            isRefreshing={isRefreshing}
            onRefresh={fetchPrice}
          />

          {/* Trading Controls or Active Position */}
          {isTrading ? (
            <ActivePosition
              buyPrice={buyPrice}
              currentPrice={price}  
              currentPnL={currentPnL}
              bookedProfit={bookedProfit}
              minLoss={minLoss}
              onClose={stopTrading}
            />
          ) : (
            <TradingControls
              bookedProfit={bookedProfit}
              setBookedProfit={setBookedProfit}
              minLoss={minLoss}
              setMinLoss={setMinLoss}
              onPlaceOrder={placeOrder}
              isTrading={isTrading}
              price={price}
            />
          )}
        </div>

        {/* Trading History */}
        <TradingHistory history={tradingHistory} totalPnL={totalPnL} />

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              Live market data • Updated: {new Date().toLocaleTimeString()}
            </span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}