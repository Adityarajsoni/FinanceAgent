import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AIStatusCard from '../components/dashboard/AIStatusCard';
import ArbitrageOpportunities from '../components/dashboard/ArbitrageOpportunities';
import GlobalPriceMonitor from '../components/dashboard/GlobalPriceMonitor';
import ProfitAnalytics from '../components/dashboard/ProfitAnalytics';
import CallAlertSystem from '../components/dashboard/CallAlertSystem';
import TradeMonitoring from '../components/dashboard/TradeMonitoring';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [callAlerts, setCallAlerts] = useState([]);
  const [aiStats, setAiStats] = useState({
    isActive: true,
    opportunitiesFound: 12,
    totalProfit: 4250,
    accuracy: 94.2
  });

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCallAlert = (alertData) => {
    const newAlert = {
      id: Date.now(),
      ...alertData,
      timestamp: new Date().toLocaleString(),
      status: 'calling'
    };
    
    setCallAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    
    // Simulate call completion
    setTimeout(() => {
      setCallAlerts(prev => prev.map(alert => 
        alert.id === newAlert.id 
          ? { ...alert, status: 'completed', duration: '42s' }
          : alert
      ));
    }, 4000);
  };

  // Simulate real-time AI updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAiStats(prev => ({
        ...prev,
        opportunitiesFound: Math.max(8, prev.opportunitiesFound + Math.floor((Math.random() - 0.5) * 3)),
        totalProfit: Math.max(3000, prev.totalProfit + Math.floor((Math.random() - 0.3) * 200)),
        accuracy: Math.max(90, Math.min(98, prev.accuracy + (Math.random() - 0.5) * 0.5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'
    }`}>
      <Navbar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
      
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className={`text-5xl font-bold bg-gradient-to-r ${
            isDarkMode 
              ? 'from-slate-200 via-indigo-300 to-purple-300' 
              : 'from-slate-800 via-indigo-800 to-purple-800'
          } bg-clip-text text-transparent mb-4`}>
            AI Bullion Arbitrage
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Advanced AI agent continuously monitors global bullion markets to identify and execute profitable arbitrage opportunities
          </p>
        </div>

        {/* Top Row - AI Status and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <AIStatusCard 
              isActive={aiStats.isActive}
              opportunitiesFound={aiStats.opportunitiesFound}
              totalProfit={aiStats.totalProfit}
              accuracy={aiStats.accuracy}
              isDarkMode={isDarkMode}
            />
          </div>
          <div className="lg:col-span-2">
            <ArbitrageOpportunities isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Second Row - Trade Monitoring and Call Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TradeMonitoring isDarkMode={isDarkMode} onCallAlert={handleCallAlert} />
          <CallAlertSystem isDarkMode={isDarkMode} />
        </div>

        {/* Third Row - Global Price Monitor */}
        <div className="mb-8">
          <GlobalPriceMonitor isDarkMode={isDarkMode} />
        </div>

        {/* Bottom Row - Profit Analytics */}
        <div className="mb-8">
          <ProfitAnalytics isDarkMode={isDarkMode} />
        </div>

        {/* Footer Status */}
        <div className="text-center py-8">
          <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full border backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-slate-800/60 border-slate-700/60' 
              : 'bg-white/60 border-slate-200/60'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>AI Agent Active</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Monitoring 25+ Global Markets</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Auto-Call System Active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}