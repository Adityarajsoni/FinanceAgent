import React, { useEffect, useState } from "react";
import { Clock, ExternalLink, TrendingUp, Globe, Newspaper } from "lucide-react";

export default function News({ isDarkMode = false }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.news) {
          setNews(data.news);
        } else {
          setNews([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("News Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDarkMode 
              ? "bg-gradient-to-r from-blue-500 to-purple-600" 
              : "bg-gradient-to-r from-blue-500 to-purple-600"
          } shadow-lg`}>
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>
            Bullion Market News
          </h1>
        </div>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Latest updates and trends in precious metals market
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-purple-500 rounded-full animate-spin" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
            </div>
          </div>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Fetching latest market news...
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}>
                <Globe className={`w-8 h-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              </div>
              <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                No news available at the moment
              </p>
            </div>
          ) : (
            news.map((item, idx) => (
              <div
                key={idx}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl"
                    : "bg-white border border-gray-200 shadow-lg hover:shadow-2xl"
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>
                
                {/* Image with overlay */}
                {item.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt="News"
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Trending indicator */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        isDarkMode 
                          ? "bg-blue-600/80 text-white" 
                          : "bg-blue-500/90 text-white"
                      } backdrop-blur-sm`}>
                        <TrendingUp className="w-3 h-3" />
                        <span>Live</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 relative">
                  <h2 className={`text-lg font-semibold mb-3 line-clamp-2 leading-snug ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } group-hover:text-blue-600 transition-colors duration-300`}>
                    {item.title}
                  </h2>
                  
                  <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {item.description || "Stay updated with the latest market trends and analysis."}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}>
                        <Globe className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {item.source || "Market News"}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">Just now</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group/link flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        isDarkMode
                          ? "text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                          : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <span>Read More</span>
                      <ExternalLink className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur -z-10`}></div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom indicator */}
      {news.length > 0 && (
        <div className="text-center mt-8">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
            isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
          } shadow-sm border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Showing {news.length} latest articles</span>
          </div>
        </div>
      )}

      {/* Custom styles for line clamping */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}