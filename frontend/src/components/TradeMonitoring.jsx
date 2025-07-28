import React, { useState, useEffect } from 'react';
import {
  Activity,
  Target,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function TradeMonitoring({ isDarkMode = false, onCallAlert }) {
  const defaultTrades = [
    {
      id: 1,
      pair: 'APMEX → BullionVault',
      metal: 'Silver 1oz',
      entryPrice: 24.85,
      currentPrice: 25.95,
      quantity: 500,
      profitTarget: 1.5,
      stopLoss: -0.5,
      currentProfit: 1.1,
      profitPercent: 4.43,
      status: 'active',
      timeElapsed: '15m 32s',
      callTriggered: false,
      route: 'US → UK'
    },
    {
      id: 2,
      pair: 'SilverGoldBull → JM Bullion',
      metal: 'Silver 10oz Bar',
      entryPrice: 248.5,
      currentPrice: 251.2,
      quantity: 200,
      profitTarget: 5.0,
      stopLoss: -3.0,
      currentProfit: 2.7,
      profitPercent: 1.09,
      status: 'active',
      timeElapsed: '8m 45s',
      callTriggered: false,
      route: 'CA → US'
    },
    {
      id: 3,
      pair: 'European Mint → CoinInvest',
      metal: 'Silver Coin',
      entryPrice: 27.9,
      currentPrice: 26.85,
      quantity: 1000,
      profitTarget: 2.0,
      stopLoss: -1.5,
      currentProfit: -1.05,
      profitPercent: -3.76,
      status: 'warning',
      timeElapsed: '22m 18s',
      callTriggered: true,
      route: 'DE → SG'
    }
  ];

  const [trades, setTrades] = useState(defaultTrades);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrades(prevTrades =>
        prevTrades.map(trade => {
          const priceFluctuation = (Math.random() - 0.5) * 0.2;
          const newCurrentPrice = Math.max(0, trade.currentPrice + priceFluctuation);
          const newProfit = newCurrentPrice - trade.entryPrice;
          const newProfitPercent = (newProfit / trade.entryPrice) * 100;

          let newStatus = 'active';
          let shouldTriggerCall = false;

          if (newProfit >= trade.profitTarget && !trade.callTriggered) {
            newStatus = 'profit_reached';
            shouldTriggerCall = true;
          } else if (newProfit <= trade.stopLoss && !trade.callTriggered) {
            newStatus = 'stop_loss';
            shouldTriggerCall = true;
          } else if (newProfit <= trade.stopLoss * 0.8) {
            newStatus = 'warning';
          }

          if (shouldTriggerCall && onCallAlert) {
            onCallAlert({
              type: newProfit >= 0 ? 'profit' : 'loss',
              trade: trade,
              amount: newProfit * trade.quantity,
              message:
                newProfit >= 0
                  ? `Profit target reached for ${trade.pair}. Profit: ₹${(
                      newProfit * trade.quantity
                    ).toLocaleString()}`
                  : `Stop loss triggered for ${trade.pair}. Loss: ₹${Math.abs(
                      newProfit * trade.quantity
                    ).toLocaleString()}`
            });
          }

          return {
            ...trade,
            currentPrice: Math.round(newCurrentPrice * 100) / 100,
            currentProfit: Math.round(newProfit * 100) / 100,
            profitPercent: Math.round(newProfitPercent * 100) / 100,
            status: newStatus,
            callTriggered: shouldTriggerCall || trade.callTriggered
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [onCallAlert]);

  const getStatusColor = status => {
    switch (status) {
      case 'profit_reached':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'stop_loss':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return isDarkMode
          ? 'text-blue-400 bg-blue-900/30 border-blue-700'
          : 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'profit_reached':
        return <CheckCircle className="w-4 h-4" />;
      case 'stop_loss':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const closePosition = tradeId => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId));
  };

  return (
    <div
      className={`rounded-3xl shadow-xl border transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/60'
          : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/60'
      }`}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className={`text-xl font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                Active Trade Monitoring
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Real-time monitoring with automated call alerts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
              <Phone className="w-3 h-3" />
              <span className="text-xs font-semibold">Auto-Call Enabled</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {trades.map(trade => (
            <div
              key={trade.id}
              className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                trade.status === 'profit_reached' || trade.status === 'stop_loss'
                  ? 'animate-pulse ring-2 ring-opacity-50'
                  : 'hover:-translate-y-1'
              } ${
                isDarkMode
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                  : 'bg-white/80 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-xl border ${getStatusColor(trade.status)}`}>
                    {getStatusIcon(trade.status)}
                  </div>

                  <div>
                    <h3
                      className={`font-bold text-lg ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {trade.pair}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        {trade.metal}
                      </span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                        {trade.quantity} units
                      </span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                        {trade.route}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${
                      trade.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {trade.currentProfit >= 0 ? '+' : ''}₹
                    {(trade.currentProfit * trade.quantity).toLocaleString()}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      trade.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {trade.profitPercent >= 0 ? '+' : ''}
                    {trade.profitPercent}%
                  </div>
                </div>
              </div>

              {/* ✅ Fixed Complete Trade Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Time Elapsed
                  </p>
                  <p
                    className={`font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {trade.timeElapsed}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Entry Price
                  </p>
                  <p
                    className={`font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    ${trade.entryPrice}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Current Price
                  </p>
                  <p
                    className={`font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    ${trade.currentPrice}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Profit Target
                  </p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <p className="font-semibold text-green-600">${trade.profitTarget}</p>
                  </div>
                </div>

                <div>
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Stop Loss
                  </p>
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3 text-red-500" />
                    <p className="font-semibold text-red-600">${trade.stopLoss}</p>
                  </div>
                </div>
              </div>

              {/* 🔽 Rest of Progress Bars, Buttons, and Summary remain SAME */}
              {/* Keep your existing Progress Bars + Close Position button + Footer Summary */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
