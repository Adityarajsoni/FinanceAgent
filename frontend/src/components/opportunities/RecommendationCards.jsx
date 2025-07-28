import React from "react";
import { Target, IndianRupee } from "lucide-react";
import { getRecommendationIcon, getRecommendationColor } from "./RecommendationParser";

const RecommendationCards = ({ parsedData }) => {
  const formatINRPrice = (priceText) => {
    if (!priceText) return 'Analysis in progress...';
    
    // If the text already contains ₹ symbol, return as is
    if (priceText.includes('₹')) {
      return priceText;
    }
    
    // If it contains numbers but no ₹, add the symbol
    const numberMatch = priceText.match(/[\d,]+/);
    if (numberMatch) {
      return `₹${numberMatch[0]} range`;
    }
    
    return priceText;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Recommendation Card */}
      <div className={`p-6 rounded-2xl border-2 ${getRecommendationColor(parsedData.recommendation)}`}>
        <div className="flex items-center gap-3 mb-4">
          {getRecommendationIcon(parsedData.recommendation)}
          <h3 className="text-lg font-bold text-gray-800">Recommendation</h3>
        </div>
        <p className="text-2xl font-bold text-gray-800 mb-2">
          {parsedData.recommendation || 'Hold'}
        </p>
      </div>

      {/* Target Price Card */}
      <div className="p-6 rounded-2xl border-2 border-purple-200 bg-purple-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-purple-500" />
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Price Target (INR)</h3>
        </div>
        <p className="text-gray-700 font-medium">
          {formatINRPrice(parsedData.targetPrice)}
        </p>
        <p className="text-sm text-purple-600 mt-2">
          All targets calculated in Indian Rupees
        </p>
      </div>
    </div>
  );
};

export default RecommendationCards;