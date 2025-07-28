import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function SentimentCard({ sentiment, confidence }) {
  const getSentimentColor = (sentiment) => {
    if (sentiment.toLowerCase().includes('bullish') || sentiment.toLowerCase().includes('positive')) {
      return {
        bg: 'from-green-500 to-emerald-500',
        text: 'text-green-700',
        bgLight: 'bg-green-50',
        icon: TrendingUp
      };
    } else if (sentiment.toLowerCase().includes('bearish') || sentiment.toLowerCase().includes('negative')) {
      return {
        bg: 'from-red-500 to-rose-500',
        text: 'text-red-700',
        bgLight: 'bg-red-50',
        icon: TrendingDown
      };
    }
    return {
      bg: 'from-yellow-500 to-amber-500',
      text: 'text-yellow-700',
      bgLight: 'bg-yellow-50',
      icon: Activity
    };
  };

  const colors = getSentimentColor(sentiment);
  const IconComponent = colors.icon;

  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl shadow-xl border border-slate-200/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-slate-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${colors.bg} rounded-2xl shadow-lg`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <div className={`px-4 py-2 ${colors.bgLight} rounded-full`}>
            <span className={`text-sm font-semibold ${colors.text}`}>
              {confidence}% Confidence
            </span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 mb-3">Market Sentiment</h2>
        <p className="text-slate-600 leading-relaxed mb-4">{sentiment}</p>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${colors.bg} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-slate-500">Accuracy</span>
        </div>
      </div>
    </div>
  );
}