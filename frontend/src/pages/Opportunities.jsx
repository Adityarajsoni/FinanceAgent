import React, { useState } from "react";
import MarketAnalysisHeader from "../components/opportunities/MarketAnalysisHeader";
import AnalysisEngine from "../components/opportunities/AnalysisEngine";
import RecommendationDisplay from "../components/opportunities/RecommendationDisplay";

export default function Opportunities() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [marketData, setMarketData] = useState(null);

  const analyzeMarket = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ai-analysis`);
      const data = await res.json();
      
      if (data.error) {
        console.error("API Error:", data.error);
        return;
      }
      
      setRecommendation(data.ai_recommendation);
      setMarketData(data.market_data);
    } catch (err) {
      console.error("Network Error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <MarketAnalysisHeader />

        {/* Market Data Summary */}
        {marketData && (
          <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Current Price</p>
                <p className="text-xl font-bold text-green-600">₹{marketData.current_price?.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">7-Day Change</p>
                <p className={`text-xl font-bold ${marketData.price_change_7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.price_change_7d >= 0 ? '+' : ''}{marketData.price_change_7d}%
                </p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">USD/INR Rate</p>
                <p className="text-xl font-bold text-blue-600">₹{marketData.exchange_rate}</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">RSI</p>
                <p className={`text-xl font-bold ${
                  marketData.technical_indicators?.rsi > 70 ? 'text-red-600' : 
                  marketData.technical_indicators?.rsi < 30 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {marketData.technical_indicators?.rsi}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Analysis Section */}
        <AnalysisEngine loading={loading} onAnalyze={analyzeMarket} />

        {/* Technical Indicators Display */}
        {marketData?.technical_indicators && (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 mb-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Technical Indicators (INR)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-600 mb-2">Support Level</p>
                <p className="text-2xl font-bold text-blue-800">₹{marketData.technical_indicators.support?.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-600 mb-2">Current Trend</p>
                <p className={`text-2xl font-bold ${marketData.technical_indicators.trend === 'Bullish' ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.technical_indicators.trend}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-600 mb-2">Resistance Level</p>
                <p className="text-2xl font-bold text-orange-800">₹{marketData.technical_indicators.resistance?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation Display */}
        {recommendation && (
          <RecommendationDisplay 
            recommendation={recommendation} 
            onRefreshAnalysis={analyzeMarket} 
          />
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Powered by advanced machine learning algorithms and real-time market data
          </p>
          <p className="text-xs mt-2 text-gray-400">
            All prices and targets displayed in Indian Rupees (₹) | Exchange rates updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
}