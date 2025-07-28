import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from playwright.sync_api import sync_playwright
import requests
from dotenv import load_dotenv
from datetime import datetime
import google.generativeai as genai  # ✅ Gemini Import
import yfinance as yf
import pandas as pd
import feedparser

load_dotenv()

app = Flask(__name__)
CORS(app)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # ✅ Add to .env
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Store active trades and completed trades
active_trades = {}
completed_trades = []
total_pnl = 0

def get_usd_to_inr_rate():
    """Get current USD to INR exchange rate"""
    try:
        # Using Yahoo Finance for USD/INR rate
        usd_inr = yf.download("USDINR=X", period="1d", interval="1d", auto_adjust=False)
        if not usd_inr.empty:
            if isinstance(usd_inr.columns, pd.MultiIndex):
                usd_inr.columns = usd_inr.columns.droplevel(1)
            
            if "Close" in usd_inr.columns:
                return float(usd_inr["Close"].iloc[-1])
        
        # Fallback to a fixed rate if API fails
        return 83.0  # Approximate rate as fallback
    except Exception as e:
        print(f"Error getting USD/INR rate: {e}")
        return 83.0  # Fallback rate

def convert_usd_to_inr(usd_price, exchange_rate):
    """Convert USD price to INR"""
    return usd_price * exchange_rate

def get_latest_price():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://www.shankarsilvermart.in/", wait_until="networkidle")
        page.wait_for_selector(
            "div#divProduct td.p-h.ph.product-rate div.mn-rate-cover span.bgm.e"
        )
        prices = page.query_selector_all(
            "div#divProduct td.p-h.ph.product-rate div.mn-rate-cover span.bgm.e"
        )
        price_values = [el.inner_text() for el in prices]
        browser.close()

        last_val = price_values[-1] if price_values else "--"
        return {"currVal": int(last_val.replace(",", "")) if last_val != "--" else "--"}

def get_silver_news():
    """Fetch silver-specific news from reliable RSS sources"""
    news_sources = [
        {
            "name": "Money Metals Exchange",
            "url": "https://www.moneymetals.com/news/rss",
            "weight": 0.4
        },
        {
            "name": "Gold Silver",
            "url": "https://goldsilver.com/feed/",
            "weight": 0.3
        },
        {
            "name": "Silver News",
            "url": "https://www.silvernews.com/feed/",
            "weight": 0.3
        }
    ]
    
    all_articles = []
    
    for source in news_sources:
        try:
            # Set timeout and user agent for RSS feeds
            headers = {'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)'}
            response = requests.get(source["url"], headers=headers, timeout=10)
            
            if response.status_code == 200:
                feed = feedparser.parse(response.content)
                
                for entry in feed.entries[:3]:  # Top 3 from each source
                    # Filter silver-related articles
                    title_lower = entry.title.lower() if hasattr(entry, 'title') else ''
                    summary_lower = entry.get('summary', '').lower()
                    
                    if any(keyword in title_lower + summary_lower for keyword in ['silver', 'precious metals', 'commodity', 'bullion', 'gold']):
                        all_articles.append({
                            'title': entry.title if hasattr(entry, 'title') else 'No title',
                            'description': entry.get('summary', 'No description')[:200],  # Limit description length
                            'source': source["name"],
                            'published': entry.get('published', ''),
                            'weight': source["weight"]
                        })
        except Exception as e:
            print(f"Error fetching from {source['name']}: {e}")
            continue
    
    # Sort by publication date and return top 8
    all_articles.sort(key=lambda x: x.get('published', ''), reverse=True)
    return all_articles[:8]

def get_market_indicators():
    """Get additional market indicators affecting silver"""
    try:
        # Get USD Index (affects precious metals)
        dxy = yf.download("DX-Y.NYB", period="5d", interval="1d", auto_adjust=False)
        if not dxy.empty:
            # Handle multi-index columns
            if isinstance(dxy.columns, pd.MultiIndex):
                dxy.columns = dxy.columns.droplevel(1)  # Remove ticker level, keep OHLCV
            
            if "Close" in dxy.columns and len(dxy["Close"]) >= 2:
                usd_change = ((dxy["Close"].iloc[-1] - dxy["Close"].iloc[0]) / dxy["Close"].iloc[0]) * 100
            else:
                usd_change = 0
        else:
            usd_change = 0
        
        # Get Gold prices (correlation indicator)
        gold = yf.download("GC=F", period="5d", interval="1d", auto_adjust=False)
        if not gold.empty:
            # Handle multi-index columns
            if isinstance(gold.columns, pd.MultiIndex):
                gold.columns = gold.columns.droplevel(1)  # Remove ticker level, keep OHLCV
            
            if "Close" in gold.columns and len(gold["Close"]) >= 2:
                gold_change = ((gold["Close"].iloc[-1] - gold["Close"].iloc[0]) / gold["Close"].iloc[0]) * 100
            else:
                gold_change = 0
        else:
            gold_change = 0
            
        return {
            "usd_index_change": round(usd_change, 2),
            "gold_change": round(gold_change, 2)
        }
    except Exception as e:
        print(f"Error getting market indicators: {e}")
        return {"usd_index_change": 0, "gold_change": 0}

def get_technical_indicators(close_prices, exchange_rate):
    """Calculate technical indicators and convert to INR"""
    try:
        # Simple Moving Averages
        sma_5 = close_prices.rolling(window=5).mean().iloc[-1] if len(close_prices) >= 5 else close_prices.mean()
        sma_20 = close_prices.rolling(window=min(20, len(close_prices))).mean().iloc[-1]
        
        # RSI calculation (simplified)
        if len(close_prices) >= 14:
            delta = close_prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs)).iloc[-1] if not rs.empty else 50
        else:
            rsi = 50
        
        # Support and Resistance levels
        high_20 = close_prices.rolling(window=min(20, len(close_prices))).max().iloc[-1]
        low_20 = close_prices.rolling(window=min(20, len(close_prices))).min().iloc[-1]
        
        return {
            "sma_5": round(convert_usd_to_inr(float(sma_5), exchange_rate), 2),
            "sma_20": round(convert_usd_to_inr(float(sma_20), exchange_rate), 2),
            "rsi": round(float(rsi), 2),
            "resistance": round(convert_usd_to_inr(float(high_20), exchange_rate), 2),
            "support": round(convert_usd_to_inr(float(low_20), exchange_rate), 2),
            "trend": "Bullish" if sma_5 > sma_20 else "Bearish"
        }
    except Exception as e:
        print(f"Error calculating technical indicators: {e}")
        return {
            "sma_5": 0,
            "sma_20": 0,
            "rsi": 50,
            "resistance": 0,
            "support": 0,
            "trend": "Neutral"
        }

def get_historical_prices():
    symbol = "SI=F"
    data = yf.download(symbol, period="7d", interval="1d", auto_adjust=False)

    # ✅ Handle multi-index columns properly
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.droplevel(1)  # Remove ticker level, keep OHLCV

    print("\n🔹 Cleaned Data:\n", data)

    if "Close" in data.columns:
        prices = data["Close"].dropna().to_dict()
    else:
        prices = {}
    return prices

@app.route("/ai-analysis", methods=["GET"])
def ai_analysis():
    try:
        # ✅ Get Current Price (in INR)
        price = get_latest_price()
        curr_price = price["currVal"]

        # ✅ Get USD to INR exchange rate
        exchange_rate = get_usd_to_inr_rate()
        print(f"USD/INR Exchange Rate: {exchange_rate}")

        # ✅ Fetch Historical Prices (Extended period for better analysis)
        symbol = "SI=F"
        data = yf.download(symbol, period="30d", interval="1d", auto_adjust=False)

        # ✅ Handle missing or empty data
        if data.empty:
            return jsonify({"error": "No historical data found"}), 500

        # ✅ Safely extract Close prices
        try:
            # Handle both single and multi-index columns
            if isinstance(data.columns, pd.MultiIndex):
                # For multi-index, drop the ticker level
                data.columns = data.columns.droplevel(1)
            
            close_prices = data["Close"].dropna()
        except Exception as e:
            print(f"Error extracting close prices: {e}")
            return jsonify({"error": "Unable to extract price data"}), 500

        if close_prices.empty:
            return jsonify({"error": "No closing price data available"}), 500

        # ✅ Calculate Enhanced Stats (convert to INR)
        price_change_7d = ((close_prices.iloc[-1] - close_prices.iloc[-7]) / close_prices.iloc[-7]) * 100 if len(close_prices) >= 7 else 0
        price_change_30d = ((close_prices.iloc[-1] - close_prices.iloc[0]) / close_prices.iloc[0]) * 100
        high_7d_inr = convert_usd_to_inr(close_prices.tail(7).max(), exchange_rate)
        low_7d_inr = convert_usd_to_inr(close_prices.tail(7).min(), exchange_rate)
        high_30d_inr = convert_usd_to_inr(close_prices.max(), exchange_rate)
        low_30d_inr = convert_usd_to_inr(close_prices.min(), exchange_rate)
        
        # ✅ Get Technical Indicators (converted to INR)
        technical = get_technical_indicators(close_prices, exchange_rate)
        
        # ✅ Get Market Indicators
        market_indicators = get_market_indicators()
        
        # ✅ Fetch Reliable Silver News
        news_articles = get_silver_news()
        
        # Fallback to NewsAPI if RSS feeds fail
        if not news_articles:
            print("RSS feeds failed, falling back to NewsAPI...")
            url = (
                "https://newsapi.org/v2/everything?"
                "q=silver price OR silver market OR silver trading OR silver forecast&"
                "sortBy=publishedAt&language=en&"
                f"apiKey={NEWS_API_KEY}"
            )
            try:
                res = requests.get(url)
                news_data = res.json().get("articles", [])
                news_articles = [
                    {
                        'title': a['title'],
                        'description': a.get('description', ''),
                        'source': a['source']['name'],
                        'published': a.get('publishedAt', ''),
                        'weight': 0.5
                    }
                    for a in news_data[:5]
                ]
            except Exception as e:
                print(f"NewsAPI also failed: {e}")
                news_articles = []
        
        news_texts = [f"[{article['source']}] {article['title']} - {article['description'][:150]}..." 
                     for article in news_articles if article.get('title')]

        # ✅ Enhanced AI Prompt with INR values
        prompt = f"""
        You are an expert silver market analyst with 15+ years of experience in precious metals trading.

        📊 **CURRENT MARKET DATA:**
        • Current Price: ₹{curr_price}
        • 7-Day Change: {price_change_7d:.2f}%
        • 30-Day Change: {price_change_30d:.2f}%
        • 7-Day Range: ₹{low_7d_inr:.2f} - ₹{high_7d_inr:.2f}
        • 30-Day Range: ₹{low_30d_inr:.2f} - ₹{high_30d_inr:.2f}

        📈 **TECHNICAL ANALYSIS:**
        • Trend: {technical.get('trend', 'Neutral')}
        • RSI: {technical.get('rsi', 'N/A')}
        • Support Level: ₹{technical.get('support', 'N/A')}
        • Resistance Level: ₹{technical.get('resistance', 'N/A')}
        • 5-Day SMA: ₹{technical.get('sma_5', 'N/A')}
        • 20-Day SMA: ₹{technical.get('sma_20', 'N/A')}

        🌍 **MARKET CORRELATIONS:**
        • USD Index Change (5d): {market_indicators['usd_index_change']}%
        • Gold Price Change (5d): {market_indicators['gold_change']}%
        • Exchange Rate: 1 USD = ₹{exchange_rate}

        📰 **LATEST SILVER-SPECIFIC NEWS:**
        {chr(10).join(news_texts[:6]) if news_texts else 'No recent silver news available'}

        **ANALYSIS FRAMEWORK:**
        Consider: Industrial demand, investment demand, supply constraints, geopolitical factors, 
        inflation expectations, USD strength, mining production, jewelry demand, and technical patterns.

        **PROVIDE STRUCTURED ANALYSIS (ALL PRICES IN INR):**

        **Recommendation:** [Buy/Hold/Sell]

        **Reason:** [Comprehensive analysis considering technical indicators, fundamental factors, 
        news sentiment, and market correlations. Minimum 150 words covering key driving factors.]

        **Suggested Holding Period (if buying):** [Short-term (1-4 weeks), Medium-term (1-3 months), 
        Long-term (3-12 months)] with specific reasoning.

        **Short-term Target Price:** [Specific price target in INR (₹) with technical justification based on 
        support/resistance levels and trend analysis. Example: ₹75,000 - ₹78,000]

        IMPORTANT: All price targets and levels must be quoted in Indian Rupees (₹) only, not USD.
        Focus on actionable insights backed by the provided data.
        """

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        return jsonify({
            "ai_recommendation": response.text,
            "market_data": {
                "current_price": curr_price,
                "price_change_7d": round(price_change_7d, 2),
                "price_change_30d": round(price_change_30d, 2),
                "technical_indicators": technical,
                "market_correlations": market_indicators,
                "news_count": len(news_articles),
                "exchange_rate": exchange_rate
            }
        })

    except Exception as e:
        print(f"AI Analysis Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/silver-price", methods=["GET"])
def silver_price():
    try:
        price = get_latest_price()
        return jsonify(price)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/buy", methods=["POST"])
def place_buy_order():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        buy_price = data.get("buy_price")
        booked_profit = data.get("booked_profit")
        min_loss = data.get("min_loss")

        if not all([buy_price, booked_profit, min_loss]):
            return jsonify({"error": "Missing required fields"}), 400

        trade_id = f"trade_{len(active_trades) + len(completed_trades) + 1}"
        active_trades[trade_id] = {
            "buy_price": buy_price,
            "booked_profit": booked_profit,
            "min_loss": min_loss,
            "timestamp": datetime.now().isoformat(),
        }

        return jsonify({
            "success": True,
            "message": "Buy order placed successfully",
            "trade_id": trade_id,
            "buy_price": buy_price,
            "target_profit": booked_profit,
            "stop_loss": min_loss
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/sell", methods=["POST"])
def close_position():
    global total_pnl
    try:
        data = request.get_json()
        trade_id = data.get("trade_id")
        sell_price = data.get("sell_price")
        reason = data.get("reason", "manual")

        if not trade_id or trade_id not in active_trades:
            return jsonify({"error": "Trade not found"}), 404

        if not sell_price:
            return jsonify({"error": "Sell price required"}), 400

        trade = active_trades[trade_id]
        buy_price = trade["buy_price"]
        pnl = sell_price - buy_price

        completed_trade = {
            "trade_id": trade_id,
            "buy_price": buy_price,
            "sell_price": sell_price,
            "pnl": pnl,
            "pnl_percentage": (pnl / buy_price) * 100,
            "reason": reason,
            "buy_time": trade["timestamp"],
            "sell_time": datetime.now().isoformat(),
            "target_profit": trade["booked_profit"],
            "stop_loss": trade["min_loss"]
        }

        completed_trades.append(completed_trade)
        del active_trades[trade_id]
        total_pnl += pnl

        return jsonify({
            "success": True,
            "message": "Position closed successfully",
            "trade": completed_trade,
            "total_pnl": total_pnl
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def get_trading_history():
    try:
        return jsonify({
            "completed_trades": completed_trades,
            "total_pnl": total_pnl,
            "total_trades": len(completed_trades),
            "winning_trades": len([t for t in completed_trades if t["pnl"] > 0]),
            "losing_trades": len([t for t in completed_trades if t["pnl"] < 0])
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/portfolio", methods=["GET"])
def get_portfolio():
    try:
        return jsonify({
            "active_trades": active_trades,
            "total_pnl": total_pnl,
            "active_positions": len(active_trades)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/news", methods=["GET"])  
def get_news():
    # Try RSS feeds first
    news_articles = get_silver_news()
    
    # Fallback to NewsAPI if RSS fails
    if not news_articles:
        url = (
            "https://newsapi.org/v2/everything?"
            "q=(silver OR gold OR bullion OR commodities OR trading OR investment OR forex OR metal OR shareMarket)&"
            "sortBy=publishedAt&language=en&"
            f"apiKey={NEWS_API_KEY}"
        )
        try:
            res = requests.get(url)
            data = res.json()

            articles = [
                {
                    "title": a["title"],
                    "url": a["url"],
                    "source": a["source"]["name"],
                    "publishedAt": a["publishedAt"],
                    "description": a.get("description", ""),
                    "image": a.get("urlToImage", None),
                }
                for a in data.get("articles", [])[:10]
                if a.get("urlToImage")
            ]

            return jsonify({"news": articles})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        # Format RSS articles to match NewsAPI structure
        formatted_articles = [
            {
                "title": article["title"],
                "url": "#",  # RSS doesn't always provide URLs
                "source": article["source"],
                "publishedAt": article["published"],
                "description": article["description"],
                "image": None,  # RSS feeds typically don't include images
            }
            for article in news_articles
        ]
        return jsonify({"news": formatted_articles})

if __name__ == "__main__":
    app.run(debug=True)