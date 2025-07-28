import React from "react";
import { Brain } from "lucide-react";

const MarketAnalysisHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
          AI Market Intelligence
        </h1>
      </div>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Harness the power of artificial intelligence to discover lucrative market opportunities and make data-driven trading decisions
      </p>
    </div>
  );
};

export default MarketAnalysisHeader;