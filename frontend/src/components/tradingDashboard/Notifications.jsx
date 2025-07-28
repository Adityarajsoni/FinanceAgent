// components/Notifications.js
import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Notifications({ notifications }) {
  if (!notifications.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl backdrop-blur-md border transform transition-all duration-500 animate-slide-in-right max-w-sm ${
            notification.type === 'success' 
              ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200/50 shadow-emerald-500/20' 
              : notification.type === 'error'
              ? 'bg-red-50/90 text-red-800 border-red-200/50 shadow-red-500/20'
              : 'bg-blue-50/90 text-blue-800 border-blue-200/50 shadow-blue-500/20'
          }`}
          style={{
            animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1), fadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) 3.6s forwards'
          }}
        >
          <div className={`flex-shrink-0 ${
            notification.type === 'success' ? 'text-emerald-600' :
            notification.type === 'error' ? 'text-red-600' : 'text-blue-600'
          }`}>
            {getIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-relaxed">
              {notification.message}
            </p>
          </div>
          
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            notification.type === 'success' ? 'bg-emerald-500' :
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`} />
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}