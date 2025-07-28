import { Bot, Activity, Zap, TrendingUp } from 'lucide-react';

export default function AIStatusCard({ 
  isActive = true, 
  opportunitiesFound = 12, 
  totalProfit = 4250, 
  accuracy = 94.2,
  isDarkMode = false 
}) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl shadow-xl border transition-all duration-500 hover:-translate-y-1 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/60 hover:shadow-2xl' 
        : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/60 hover:shadow-2xl'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <Activity className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <h2 className={`text-xl font-bold mb-2 ${
          isDarkMode ? 'text-slate-200' : 'text-slate-800'
        }`}>
          AI Agent Status
        </h2>
        <p className={`text-sm mb-6 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Continuously monitoring global bullion markets for arbitrage opportunities
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-2 mx-auto ${
              isDarkMode ? 'bg-slate-700' : 'bg-indigo-100'
            }`}>
              <Zap className={`w-6 h-6 ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {opportunitiesFound}
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Opportunities
            </p>
          </div>
          
          <div className="text-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-2 mx-auto ${
              isDarkMode ? 'bg-slate-700' : 'bg-green-100'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              ₹{totalProfit.toLocaleString()}
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Profit Today
            </p>
          </div>
          
          <div className="text-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-2 mx-auto ${
              isDarkMode ? 'bg-slate-700' : 'bg-purple-100'
            }`}>
              <Activity className={`w-6 h-6 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {accuracy}%
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Accuracy
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Performance Score
            </span>
            <span className={`text-sm font-bold ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Excellent
            </span>
          </div>
          <div className={`flex-1 rounded-full h-2 overflow-hidden ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}