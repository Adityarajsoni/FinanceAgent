import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from playwright.sync_api import sync_playwright
import requests
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# ✅ Store active trades and completed trades
active_trades = {}
completed_trades = []  # This will store your P&L history
total_pnl = 0  # Running total of profits/losses

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
        return {
            "currVal": int(last_val.replace(",", "")) if last_val != "--" else "--"
        }

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
            "timestamp": datetime.now().isoformat()
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

# ✅ NEW: Close position and record P&L
@app.route("/sell", methods=["POST"])
def close_position():
    global total_pnl
    
    try:
        data = request.get_json()
        trade_id = data.get("trade_id")
        sell_price = data.get("sell_price")
        reason = data.get("reason", "manual")  # "manual", "target", "stop_loss"
        
        if not trade_id or trade_id not in active_trades:
            return jsonify({"error": "Trade not found"}), 404
            
        if not sell_price:
            return jsonify({"error": "Sell price required"}), 400
        
        # Get the original trade
        trade = active_trades[trade_id]
        buy_price = trade["buy_price"]
        pnl = sell_price - buy_price
        
        # Create completed trade record
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
        
        # Move from active to completed
        completed_trades.append(completed_trade)
        del active_trades[trade_id]
        
        # Update total P&L
        total_pnl += pnl
        
        return jsonify({
            "success": True,
            "message": "Position closed successfully",
            "trade": completed_trade,
            "total_pnl": total_pnl
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ NEW: Get trading history
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

# ✅ NEW: Get current portfolio status
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
    url = (
    "https://newsapi.org/v2/everything?"
    "q=(silver OR gold OR bullion OR commodities OR trading OR investment OR forex OR metal OR shareMarket)&"
    "sortBy=publishedAt&"
    "language=en&"
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

if __name__ == "__main__":
    app.run(debug=True)