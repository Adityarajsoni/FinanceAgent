import { TrendingUp, MapPin, Clock, DollarSign, Zap } from 'lucide-react';

export default function ArbitrageOpportunities({ opportunities = [], isDarkMode = false }) {
  const defaultOpportunities = [
    {
      id: 1,
      buyFrom: "APMEX (USA)",
      sellTo: "BullionVault (UK)",
      metal: "Silver 1oz",
      buyPrice: 24.85,
      sellPrice: 26.20,
      profit: 1.35,
      profitPercent: 5.43,
      confidence: 95,
      timeLeft: "2m 30s",
      volume: "500oz",
      country: "US → UK"
    },
    {
      id: 2,
      buyFrom: "SilverGoldBull (Canada)",
      sellTo: "JM Bullion (USA)",
      metal: "Silver 10oz Bar",
      buyPrice: 248.50,
      sellPrice: 252.80,
      profit: 4.30,
      profitPercent: 1.73,
      confidence: 88,
      timeLeft: "5m 15s",
      volume: "200oz",
      country: "CA → US"
    },
    {
      id: 3,
      buyFrom: "European Mint (Germany)",
      sellTo: "CoinInvest (Singapore)",
      metal: "Silver Coin",
      buyPrice: 27.90,
      sellPrice: 29.45,
      profit: 1.55,
      profitPercent: 5.56,
      confidence: 92,
      timeLeft: "1m 45s",
      volume: "1000oz",
      country: "DE → SG"
    }
  ];

  const displayOpportunities = opportunities.length > 0 ? opportunities : defaultOpportunities;

  const getProfitColor = (profitPercent) => {
    if (profitPercent >= 5) return 'text-green-600 bg-green-100';
    if (profitPercent >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className={`rounded-3xl shadow-xl border transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/60' 
        : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/60'
    }`}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Live Arbitrage Opportunities
              </h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                AI-detected profitable trades across global markets
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold">Live</span>
          </div>
        </div>

        <div className="space-y-4">
          {displayOpportunities.map((opportunity) => (
            <div 
              key={opportunity.id}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50' 
                  : 'bg-white/80 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      opportunity.confidence >= 90 ? 'bg-green-500' :
                      opportunity.confidence >= 80 ? 'bg-yellow-500' : 'bg-orange-500'
                    } animate-pulse`}></div>
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {opportunity.metal}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opportunity.volume}
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getProfitColor(opportunity.profitPercent)}`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">+{opportunity.profitPercent}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className={`w-4 h-4 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Buy From
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {opportunity.buyFrom}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ${opportunity.buyPrice}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className={`w-4 h-4 ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Sell To
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {opportunity.sellTo}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      ${opportunity.sellPrice}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className={`w-4 h-4 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Profit
                      </span>
                    </div>
                    <p className={`text-sm font-bold ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ${opportunity.profit}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      per unit
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className={`w-4 h-4 ${
                        isDarkMode ? 'text-orange-400' : 'text-orange-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Time Left
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${
                      isDarkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      {opportunity.timeLeft}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {opportunity.confidence}% confidence
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Route: {opportunity.country}
                    </span>
                  </div>
                  
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200">
                    Execute Trade
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}