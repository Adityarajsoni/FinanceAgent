import React from "react";
import { Brain, Clock, IndianRupee } from "lucide-react";

const DetailedAnalysis = ({ parsedData }) => {
  return (
    <div className="space-y-6">
      {/* Reason Section */}
      <div className="bg-white/60 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-800">Market Analysis</h3>
          <div className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <IndianRupee className="w-3 h-3" />
            <span>INR Based</span>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {parsedData.reason || 'Detailed analysis not available'}
        </p>
      </div>

      {/* Holding Period */}
      {parsedData.holdingPeriod && (
        <div className="bg-white/60 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">Suggested Holding Period</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {parsedData.holdingPeriod}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailedAnalysis;