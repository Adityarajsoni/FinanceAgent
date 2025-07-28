import React from "react";
import { Target } from "lucide-react";
import { parseRecommendation } from "./RecommendationParser";
import RecommendationCards from "./RecommendationCards";
import DetailedAnalysis from "./DetailedAnalysis";
import ActionButtons from "./ActionButtons";

const RecommendationDisplay = ({ recommendation, onRefreshAnalysis }) => {
  const parsed = parseRecommendation(recommendation);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-500 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">AI Market Analysis</h2>
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-600 text-sm font-medium">Live Analysis (INR)</span>
        </div>
      </div>

      {/* Recommendation Cards */}
      <RecommendationCards parsedData={parsed} />

      {/* Detailed Analysis */}
      <DetailedAnalysis parsedData={parsed} />

      {/* Action Buttons */}
      <ActionButtons onRefreshAnalysis={onRefreshAnalysis} />
    </div>
  );
};

export default RecommendationDisplay;