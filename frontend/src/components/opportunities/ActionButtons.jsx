import React from "react";
import { DollarSign, Clock, BarChart3, Sparkles, IndianRupee } from "lucide-react";

const ActionButtons = ({ onRefreshAnalysis }) => {
  const buttons = [
    {
      label: "Place Order",
      icon: IndianRupee,
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => console.log("Place order clicked")
    },
    {
      label: "Set Alert",
      icon: Clock,
      color: "bg-slate-600 hover:bg-slate-700",
      onClick: () => console.log("Set alert clicked")
    },
    {
      label: "View Details",
      icon: BarChart3,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => console.log("View details clicked")
    },
    {
      label: "Refresh Analysis",
      icon: Sparkles,
      color: "bg-purple-600 hover:bg-purple-700",
      onClick: onRefreshAnalysis
    }
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`flex items-center gap-2 px-6 py-3 ${button.color} text-white rounded-xl font-medium transition-colors`}
        >
          <button.icon className="w-4 h-4" />
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;