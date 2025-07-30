import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from playwright.sync_api import sync_playwright
import requests
from dotenv import load_dotenv
from datetime import datetime
import feedparser

# Import technical analysis functions
from technical_analysis import (
    get_usd_to_inr_rate, 
    convert_usd_to_inr, 
    get_complete_market_analysis,
    calculate_premium_analysis
)

load_dotenv()

app = Flask(__name__)
CORS(app)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# ✅ Store active trades and completed trades
active_trades = {}
completed_trades = []
total_pnl = 0


def get_latest_price():
    """Scrape current silver price from shankarsilvermart.in with fallback methods"""
    try:
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
            if last_val != "--":
                return {"currVal": int(last_val.replace(",", ""))}
    except Exception as e:
        print(f"Error scraping shankarsilvermart.in: {e}")
    
    # Fallback: Calculate approximate retail price based on spot + premium
    try:
        print("Using fallback method for price calculation...")
        import yfinance as yf
        
        exchange_rate = get_usd_to_inr_rate()
        silver_data = yf.download("SI=F", period="1d", interval="1d", auto_adjust=False)
        
        if not silver_data.empty:
            if hasattr(silver_data.columns, 'levels'):  # MultiIndex check
                silver_data.columns = silver_data.columns.droplevel(1)
            
            if "Close" in silver_data.columns:
                spot_usd_per_ounce = float(silver_data["Close"].iloc[-1])
                spot_inr_per_kg = spot_usd_per_ounce * 32.15 * exchange_rate
                
                # Add typical retail premium (6-8%)
                retail_price = int(spot_inr_per_kg * 1.0851)  # 7% premium
                print(f"Calculated retail price: ₹{retail_price:,}/kg")
                return {"currVal": retail_price}
    except Exception as e:
        print(f"Fallback method failed: {e}")
    
    # Last resort fallback
    return {"currVal": 116000}



def get_prices_with_premium():
    """Get retail and spot prices with premium calculation"""
    try:
        # Retail Price (from bullion site)
        retail_data = get_latest_price()
        retail_price = retail_data.get("currVal", 0)

        # COMEX Spot Price (from Yahoo Finance)
        exchange_rate = get_usd_to_inr_rate()
        
        import yfinance as yf
        data = yf.download("SI=F", period="1d", interval="1d", auto_adjust=False)

        if hasattr(data.columns, 'levels'):  # MultiIndex check
            data.columns = data.columns.droplevel(1)

        if "Close" not in data.columns or data.empty:
            return {"error": "Unable to fetch spot price"}

        comex_price_inr = float(data["Close"].iloc[-1]) * 32.15 * exchange_rate

        # Premium Difference
        premium_diff = retail_price - comex_price_inr
        premium_percent = (premium_diff / comex_price_inr) * 100 if comex_price_inr else 0

        return {
            "retail_price": round(retail_price, 2),
            "spot_price": round(comex_price_inr, 2),
            "premium_diff": round(premium_diff, 2),
            "premium_percent": round(premium_percent, 2)
        }

    except Exception as e:
        return {"error": str(e)}

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

def get_fallback_news():
    """Fallback to NewsAPI if RSS feeds fail"""
    if not NEWS_API_KEY:
        return []
        
    url = (
        "https://newsapi.org/v2/everything?"
        "q=silver price OR silver market OR silver trading OR silver forecast&"
        "sortBy=publishedAt&language=en&"
        f"apiKey={NEWS_API_KEY}"
    )
    try:
        res = requests.get(url)
        news_data = res.json().get("articles", [])
        return [
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
        return []

# ===== FLASK ROUTES =====

@app.route("/prices", methods=["GET"])
def get_prices():
    """Get retail and spot prices with premium analysis"""
    prices = get_prices_with_premium()
    return jsonify(prices)

@app.route("/silver-price", methods=["GET"])
def silver_price():
    """Get current silver price"""
    try:
        price = get_latest_price()
        return jsonify(price)
    except Exception as e:
        return jsonify({"error": str(e), "currVal": 116000}), 200

@app.route("/ai-analysis", methods=["GET"])
def ai_analysis():
    """Get comprehensive AI-powered market analysis"""
    try:
        # Get current retail price
        price_data = get_latest_price()
        retail_price = price_data["currVal"]
        
        # Get news articles
        news_articles = get_silver_news()
        
        # Fallback to NewsAPI if RSS feeds fail
        if not news_articles:
            print("RSS feeds failed, falling back to NewsAPI...")
            news_articles = get_fallback_news()
        
        # Get complete market analysis from technical_analysis module
        analysis_result = get_complete_market_analysis(retail_price, news_articles)
        
        if "error" in analysis_result:
            return jsonify(analysis_result), 500
        
        return jsonify(analysis_result)

    except Exception as e:
        print(f"AI Analysis Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/news", methods=["GET"])  
def get_news():
    """Get latest silver-related news"""
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

# ===== TRADING ROUTES =====

@app.route("/buy", methods=["POST"])
def place_buy_order():
    """Place a buy order"""
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
    """Close a trading position"""
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
    """Get trading history"""
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
    """Get current portfolio status"""
    try:
        return jsonify({
            "active_trades": active_trades,
            "total_pnl": total_pnl,
            "active_positions": len(active_trades)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    from flask_cors import CORS
    CORS(app)  # Allow frontend requests
    app.run(host="0.0.0.0", port=5000)
