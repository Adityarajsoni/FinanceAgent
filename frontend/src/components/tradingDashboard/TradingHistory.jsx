// components/TradingHistory.js
import React from 'react';
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TradingHistory({ history, totalPnL }) {
  if (!history.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Trading History</h4>
        <p className="text-gray-500 text-center py-8">No completed trades yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">Trading History</h4>
        <div className={`px-3 py-1 rounded-lg font-semibold ${
          totalPnL >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          Total P&L: {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString()}
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.slice(0, 10).map((trade) => (
          <div key={trade.trade_id} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {new Date(trade.sell_time).toLocaleDateString()} {new Date(trade.sell_time).toLocaleTimeString()}
              </span>
              <div className={`flex items-center gap-1 font-semibold ${
                trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trade.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toLocaleString()}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Buy:</span>
                <div className="font-medium">₹{trade.buy_price.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Sell:</span>
                <div className="font-medium">₹{trade.sell_price.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Reason:</span>
                <div className="font-medium capitalize">{trade.reason}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}