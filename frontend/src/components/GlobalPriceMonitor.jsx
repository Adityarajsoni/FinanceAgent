import { Globe, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export default function GlobalPriceMonitor({ isDarkMode = false }) {
  const dealers = [
    {
      name: "APMEX",
      country: "USA",
      flag: "🇺🇸",
      buyPrice: 24.85,
      sellPrice: 26.20,
      spread: 1.35,
      change: +0.23,
      changePercent: +0.93,
      lastUpdate: "2s ago",
      volume: "High"
    },
    {
      name: "BullionVault",
      country: "UK",
      flag: "🇬🇧",
      buyPrice: 25.10,
      sellPrice: 26.45,
      spread: 1.35,
      change: -0.15,
      changePercent: -0.59,
      lastUpdate: "5s ago",
      volume: "Medium"
    },
    {
      name: "SilverGoldBull",
      country: "Canada", 
      flag: "🇨🇦",
      buyPrice: 24.92,
      sellPrice: 26.15,
      spread: 1.23,
      change: +0.08,
      changePercent: +0.32,
      lastUpdate: "3s ago",
      volume: "High"
    },
    {
      name: "European Mint",
      country: "Germany",
      flag: "🇩🇪",
      buyPrice: 25.20,
      sellPrice: 26.50,
      spread: 1.30,
      change: +0.35,
      changePercent: +1.41,
      lastUpdate: "1s ago",
      volume: "Low"
    },
    {
      name: "CoinInvest",
      country: "Singapore",
      flag: "🇸🇬",
      buyPrice: 24.95,
      sellPrice: 26.30,
      spread: 1.35,
      change: -0.05,
      changePercent: -0.20,
      lastUpdate: "4s ago",
      volume: "Medium"
    },
    {
      name: "JM Bullion",
      country: "USA",
      flag: "🇺🇸",
      buyPrice: 25.05,
      sellPrice: 26.25,
      spread: 1.20,
      change: +0.18,
      changePercent: +0.72,
      lastUpdate: "6s ago",
      volume: "High"
    }
  ];

  const getVolumeColor = (volume) => {
    switch(volume) {
      case 'High': return isDarkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100';
      case 'Medium': return isDarkMode ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-600 bg-yellow-100';
      case 'Low': return isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100';
      default: return isDarkMode ? 'text-slate-400 bg-slate-700' : 'text-slate-600 bg-slate-100';
    }
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
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Global Price Monitor
              </h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Real-time silver prices from major dealers worldwide
              </p>
            </div>
          </div>
          
          <button className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
            isDarkMode 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}>
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-4">
            {dealers.map((dealer, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50' 
                    : 'bg-white/80 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{dealer.flag}</span>
                        <div>
                          <h3 className={`font-semibold ${
                            isDarkMode ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {dealer.name}
                          </h3>
                          <p className={`text-xs ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {dealer.country}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getVolumeColor(dealer.volume)}`}>
                        {dealer.volume} Vol
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className={`text-xs font-medium mb-1 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Buy
                        </p>
                        <p className={`text-lg font-bold ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          ${dealer.buyPrice}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className={`text-xs font-medium mb-1 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Sell
                        </p>
                        <p className={`text-lg font-bold ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          ${dealer.sellPrice}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className={`text-xs font-medium mb-1 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Spread
                        </p>
                        <p className={`text-lg font-bold ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          ${dealer.spread}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`flex items-center space-x-1 ${
                          dealer.change >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {dealer.change >= 0 ? 
                            <TrendingUp className="w-4 h-4" /> : 
                            <TrendingDown className="w-4 h-4" />
                          }
                          <span className="text-sm font-semibold">
                            {dealer.changePercent > 0 ? '+' : ''}{dealer.changePercent}%
                          </span>
                        </div>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {dealer.lastUpdate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/20">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                  Best Buy Price: $24.85 (APMEX)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                  Best Sell Price: $26.50 (European Mint)
                </span>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full ${
              isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
            }`}>
              <span className="text-xs font-semibold">
                Max Arbitrage: $1.65 (6.64%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}