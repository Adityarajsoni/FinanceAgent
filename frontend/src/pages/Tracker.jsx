import React, { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Activity,
  DollarSign,
  Target,
  Shield,
  Play,
  Pause,
  X
} from "lucide-react";

// Price Display Component
function PriceCard({ price, lastPrice, isConnected, isRefreshing, onRefresh }) {
  const priceChange = lastPrice && price ? (price > lastPrice ? 'up' : price < lastPrice ? 'down' : null) : null;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Silver Price</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
          
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            ₹{price?.toLocaleString() || '--'}
          </span>
          {priceChange && (
            <div className={`flex items-center ${
              priceChange === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {priceChange === 'up' ? 
                <TrendingUp className="w-5 h-5" /> : 
                <TrendingDown className="w-5 h-5" />
              }
            </div>
          )}
        </div>
        
        {lastPrice && price && price !== lastPrice && (
          <div className={`text-sm ${price > lastPrice ? 'text-green-600' : 'text-red-600'}`}>
            {price > lastPrice ? '+' : ''}
            {(price - lastPrice).toLocaleString()} 
            ({((price - lastPrice) / lastPrice * 100).toFixed(2)}%)
          </div>
        )}
      </div>
    </div>
  );
}

// Trading Controls Component
function TradingControls({ 
  bookedProfit, 
  setBookedProfit, 
  minLoss, 
  setMinLoss, 
  onPlaceOrder, 
  isTrading, 
  price 
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-blue-600" />
        Quick Trade
      </h4>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="inline w-4 h-4 mr-1 text-green-600" />
            Target Profit (₹)
          </label>
          <input
            type="number"
            value={bookedProfit}
            onChange={(e) => setBookedProfit(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="inline w-4 h-4 mr-1 text-red-600" />
            Stop Loss (₹)
          </label>
          <input
            type="number"
            value={minLoss}
            onChange={(e) => setMinLoss(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={isTrading || !price}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isTrading ? 'Position Active' : 'Place Buy Order'}
      </button>

      {price && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Setup:</strong> Buy ₹{price.toLocaleString()} • 
          Target +₹{bookedProfit.toLocaleString()} • 
          Stop -₹{minLoss.toLocaleString()}
        </div>
      )}
    </div>
  );
}

// Active Position Component
function ActivePosition({ buyPrice, currentPnL, bookedProfit, minLoss, onClose }) {
  const pnlColor = currentPnL > 0 ? 'text-green-600' : currentPnL < 0 ? 'text-red-600' : 'text-gray-600';
  const pnlIcon = currentPnL > 0 ? <TrendingUp className="w-4 h-4" /> : 
                   currentPnL < 0 ? <TrendingDown className="w-4 h-4" /> : 
                   <Activity className="w-4 h-4" />;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Active Position
        </h4>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3">
          <div className="text-sm text-gray-600">Buy Price</div>
          <div className="text-lg font-semibold text-gray-900">
            ₹{buyPrice?.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3">
          <div className="text-sm text-gray-600">Current P&L</div>
          <div className={`text-lg font-semibold flex items-center gap-1 ${pnlColor}`}>
            {pnlIcon}
            ₹{Math.abs(currentPnL).toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            currentPnL >= 0 ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ 
            width: `${Math.min(100, Math.abs(currentPnL) / Math.max(bookedProfit, minLoss) * 100)}%` 
          }}
        />
      </div>
      
      <button
        onClick={onClose}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
      >
        <X className="w-4 h-4" />
        Close Position
      </button>
    </div>
  );
}

// Main Trading Dashboard
export default function TradingDashboard() {
  const [price, setPrice] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const [bookedProfit, setBookedProfit] = useState(500);
  const [minLoss, setMinLoss] = useState(300);
  const [buyPrice, setBuyPrice] = useState(null);
  const [currentPnL, setCurrentPnL] = useState(0);
  const [isTrading, setIsTrading] = useState(false);
  
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  const intervalRef = useRef(null);
  const notificationIdRef = useRef(0);

  const addNotification = (message, type = "info") => {
    const id = notificationIdRef.current++;
    const notification = { id, message, type, timestamp: Date.now() };
    setNotifications(prev => [notification, ...prev.slice(0, 2)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

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
        
        // Calculate P&L if trading
        if (isTrading && buyPrice) {
          const pnl = newPrice - buyPrice;
          setCurrentPnL(pnl);
          
          // Check targets
          if (pnl >= bookedProfit) {
            addNotification("🎯 Target Profit Reached!", "success");
            setIsTrading(false);
            setBuyPrice(null);
          } else if (pnl <= -minLoss) {
            addNotification("🛡️ Stop Loss Triggered!", "error");
            setIsTrading(false);
            setBuyPrice(null);
          }
        }
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

      setBuyPrice(price);
      setCurrentPnL(0);
      setIsTrading(true);
      addNotification(`📈 Buy order placed at ₹${price.toLocaleString()}`, "success");
      
    } catch (err) {
      console.error("Order Error:", err);
      addNotification("Order failed", "error");
    }
  };

  const stopTrading = () => {
    setIsTrading(false);
    setBuyPrice(null);
    setCurrentPnL(0);
    addNotification("⏹️ Position closed", "info");
  };

  useEffect(() => {
    fetchPrice();
    
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchPrice, 10000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium transform transition-all duration-300 ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : notification.type === 'error'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trading Dashboard</h1>
          <p className="text-gray-600">Real-time commodity trading platform</p>
        </div>

        {/* Auto Refresh Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            Auto Refresh {autoRefresh ? 'On' : 'Off'}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
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

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Live market data • Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}