import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, AlertTriangle, TrendingUp, TrendingDown, Settings, Volume2, VolumeX } from 'lucide-react';

export default function CallAlertSystem({ isDarkMode = false }) {
  const [isCallEnabled, setIsCallEnabled] = useState(true);
  const [callHistory, setCallHistory] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    profitTarget: 5000,
    lossLimit: 2000,
    phoneNumber: '+1 (555) 123-4567',
    callOnProfit: true,
    callOnLoss: true
  });

  // Simulate call history
  const defaultCallHistory = [
    {
      id: 1,
      type: 'profit',
      amount: 5250,
      target: 5000,
      timestamp: '2024-01-15 14:23:15',
      duration: '45s',
      status: 'completed',
      message: 'Profit target of ₹5,000 reached. Current profit: ₹5,250'
    },
    {
      id: 2,
      type: 'loss',
      amount: -1850,
      target: -2000,
      timestamp: '2024-01-15 11:45:32',
      duration: '32s',
      status: 'completed',
      message: 'Approaching loss limit. Current loss: ₹1,850'
    },
    {
      id: 3,
      type: 'profit',
      amount: 3200,
      target: 3000,
      timestamp: '2024-01-15 09:15:22',
      duration: '1m 12s',
      status: 'completed',
      message: 'Profit milestone reached. Current profit: ₹3,200'
    }
  ];

  const [currentCalls, setCurrentCalls] = useState(defaultCallHistory);

  // Simulate incoming call alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCallEnabled && Math.random() > 0.95) { // 5% chance every 3 seconds
        const isProfit = Math.random() > 0.3;
        const amount = isProfit ? 
          Math.floor(Math.random() * 3000) + alertSettings.profitTarget :
          -(Math.floor(Math.random() * 1000) + alertSettings.lossLimit);
        
        const newCall = {
          id: Date.now(),
          type: isProfit ? 'profit' : 'loss',
          amount: amount,
          target: isProfit ? alertSettings.profitTarget : -alertSettings.lossLimit,
          timestamp: new Date().toLocaleString(),
          duration: 'calling...',
          status: 'calling',
          message: isProfit ? 
            `Profit target reached! Current profit: ₹${amount.toLocaleString()}` :
            `Loss limit exceeded! Current loss: ₹${Math.abs(amount).toLocaleString()}`
        };

        setCurrentCalls(prev => [newCall, ...prev.slice(0, 9)]);

        // Simulate call completion after 3 seconds
        setTimeout(() => {
          setCurrentCalls(prev => prev.map(call => 
            call.id === newCall.id 
              ? { ...call, status: 'completed', duration: '38s' }
              : call
          ));
        }, 3000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isCallEnabled, alertSettings]);

  const makeTestCall = (type) => {
    const amount = type === 'profit' ? 4500 : -1800;
    const newCall = {
      id: Date.now(),
      type: type,
      amount: amount,
      target: type === 'profit' ? alertSettings.profitTarget : -alertSettings.lossLimit,
      timestamp: new Date().toLocaleString(),
      duration: 'calling...',
      status: 'calling',
      message: type === 'profit' ? 
        `TEST: Profit alert - Current profit: ₹${amount.toLocaleString()}` :
        `TEST: Loss alert - Current loss: ₹${Math.abs(amount).toLocaleString()}`
    };

    setCurrentCalls(prev => [newCall, ...prev.slice(0, 9)]);

    setTimeout(() => {
      setCurrentCalls(prev => prev.map(call => 
        call.id === newCall.id 
          ? { ...call, status: 'completed', duration: '42s' }
          : call
      ));
    }, 4000);
  };

  return (
    <div className={`rounded-3xl shadow-xl border transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/60' 
        : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/60'
    }`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                AI Call Alert System
              </h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Automated phone alerts for profit/loss thresholds
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCallEnabled(!isCallEnabled)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isCallEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {isCallEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-sm font-semibold">
                {isCallEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          </div>
        </div>

        {/* Alert Settings */}
        <div className={`p-6 rounded-2xl border mb-6 ${
          isDarkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-white/80 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <Settings className={`w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Alert Configuration
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Profit Target (₹)
              </label>
              <div className="relative">
                <TrendingUp className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <input
                  type="number"
                  value={alertSettings.profitTarget}
                  onChange={(e) => setAlertSettings(prev => ({...prev, profitTarget: parseInt(e.target.value)}))}
                  className={`pl-10 pr-4 py-2 w-full rounded-xl border text-sm ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-200' 
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Loss Limit (₹)
              </label>
              <div className="relative">
                <TrendingDown className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`} />
                <input
                  type="number"
                  value={alertSettings.lossLimit}
                  onChange={(e) => setAlertSettings(prev => ({...prev, lossLimit: parseInt(e.target.value)}))}
                  className={`pl-10 pr-4 py-2 w-full rounded-xl border text-sm ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-200' 
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <input
                  type="tel"
                  value={alertSettings.phoneNumber}
                  onChange={(e) => setAlertSettings(prev => ({...prev, phoneNumber: e.target.value}))}
                  className={`pl-10 pr-4 py-2 w-full rounded-xl border text-sm ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-200' 
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Test Calls
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => makeTestCall('profit')}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-all duration-200"
                >
                  Test Profit
                </button>
                <button
                  onClick={() => makeTestCall('loss')}
                  className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-all duration-200"
                >
                  Test Loss
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Calls */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Recent Call History
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {currentCalls.map((call) => (
              <div 
                key={call.id}
                className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
                  call.status === 'calling' 
                    ? 'animate-pulse ring-2 ring-orange-500/50' 
                    : 'hover:shadow-lg'
                } ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50' 
                    : 'bg-white/80 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-xl ${
                      call.type === 'profit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {call.status === 'calling' ? (
                        <PhoneCall className="w-5 h-5 animate-bounce" />
                      ) : call.type === 'profit' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-semibold ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {call.type === 'profit' ? 'Profit Alert' : 'Loss Alert'}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          call.status === 'calling'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {call.status === 'calling' ? 'Calling...' : 'Completed'}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {call.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                          {call.timestamp}
                        </span>
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                          Duration: {call.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-right ${
                    call.type === 'profit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <p className="text-lg font-bold">
                      {call.type === 'profit' ? '+' : ''}₹{Math.abs(call.amount).toLocaleString()}
                    </p>
                    <p className="text-xs opacity-75">
                      Target: ₹{Math.abs(call.target).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200/20">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isCallEnabled ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                  Call System: {isCallEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className={`w-3 h-3 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                  Target: {alertSettings.phoneNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}