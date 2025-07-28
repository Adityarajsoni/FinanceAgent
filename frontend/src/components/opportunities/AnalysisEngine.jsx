import React from "react";
import { BarChart3, TrendingUp, Brain, Target, Sparkles } from "lucide-react";

const AnalysisEngine = ({ loading, onAnalyze }) => {
  const features = [
    {
      icon: BarChart3,
      title: "Technical Analysis",
      description: "Price patterns, support & resistance levels",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: TrendingUp,
      title: "Trend Detection",
      description: "Market momentum & trend strength",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: Brain,
      title: "Sentiment Analysis",
      description: "News & social media sentiment",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: Target,
      title: "Price Targets",
      description: "Entry, exit & stop-loss levels in ₹",
      gradient: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-400"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 mb-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Market Analysis Engine</h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Our AI analyzes real-time market data, news sentiment, technical indicators, and historical patterns to generate actionable trading insights with all prices in Indian Rupees (₹)
        </p>
      </div>

      {/* Analysis Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="relative z-10 flex items-center gap-3">
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-lg">Analyzing Market...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span className="text-lg">Generate AI Analysis</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-4">
            <div className={`inline-flex p-3 bg-gradient-to-r ${feature.gradient} rounded-xl mb-3`}>
              <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
            </div>
            <h3 className="text-gray-800 font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisEngine;