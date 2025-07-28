import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Activity, Target } from 'lucide-react';

export default function ProfitAnalytics({ isDarkMode = false }) {
  const profitData = [
    { time: '09:00', profit: 1200, trades: 3 },
    { time: '10:00', profit: 2350, trades: 5 },
    { time: '11:00', profit: 1800, trades: 4 },
    { time: '12:00', profit: 3200, trades: 7 },
    { time: '13:00', profit: 2900, trades: 6 },
    { time: '14:00', profit: 4100, trades: 8 },
    { time: '15:00', profit: 3750, trades: 7 },
    { time: '16:00', profit: 4250, trades: 9 },
  ];

  const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
  const totalTrades = profitData.reduce((sum, item) => sum + item.trades, 0);
  const avgProfitPerTrade = Math.round(totalProfit / totalTrades);

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
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Profit Analytics
              </h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                AI trading performance and profit tracking
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white/80 border-slate-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <DollarSign className={`w-5 h-5 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Total Profit
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  ₹{totalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white/80 border-slate-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <Activity className={`w-5 h-5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <p className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Total Trades
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {totalTrades}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-800/50 border-slate-700' 
              : 'bg-white/80 border-slate-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
              }`}>
                <Target className={`w-5 h-5 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
              <div>
                <p className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Avg/Trade
                </p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  ₹{avgProfitPerTrade}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profit Chart */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Hourly Profit Trend
          </h3>
          <div className="relative">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={profitData}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  className={`text-xs ${isDarkMode ? 'fill-slate-400' : 'fill-slate-500'}`}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className={`text-xs ${isDarkMode ? 'fill-slate-400' : 'fill-slate-500'}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: isDarkMode ? 'white' : 'black',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  labelFormatter={(value) => `Time: ${value}`}
                  formatter={(value, name) => [
                    name === 'profit' ? `₹${value.toLocaleString()}` : value,
                    name === 'profit' ? 'Profit' : 'Trades'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#profitGradient)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trades Bar Chart */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Trading Activity
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={profitData}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                className={`text-xs ${isDarkMode ? 'fill-slate-400' : 'fill-slate-500'}`}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className={`text-xs ${isDarkMode ? 'fill-slate-400' : 'fill-slate-500'}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  color: isDarkMode ? 'white' : 'black',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              />
              <Bar 
                dataKey="trades" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 pt-4 border-t border-slate-200/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Success Rate
                </p>
                <p className={`text-lg font-bold text-green-500`}>
                  94.2%
                </p>
              </div>
              <div className="text-center">
                <p className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Best Trade
                </p>
                <p className={`text-lg font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  ₹1,285
                </p>
              </div>
              <div className="text-center">
                <p className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  ROI Today
                </p>
                <p className={`text-lg font-bold text-green-500`}>
                  +12.4%
                </p>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-xl ${
              isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
            }`}>
              <span className="text-sm font-semibold">
                🎯 AI Performance: Excellent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}