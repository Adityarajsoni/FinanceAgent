import yfinance as yf
import pandas as pd
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

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
    """Calculate technical indicators and convert to INR per kg"""
    try:
        # ✅ Multiply by 32.15 for per-kg calculations
        adjusted_prices = close_prices * 32.15  

        sma_5 = adjusted_prices.rolling(window=5).mean().iloc[-1] if len(adjusted_prices) >= 5 else adjusted_prices.mean()
        sma_20 = adjusted_prices.rolling(window=min(20, len(adjusted_prices))).mean().iloc[-1]

        if len(adjusted_prices) >= 14:
            delta = adjusted_prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs)).iloc[-1] if not rs.empty else 50
        else:
            rsi = 50

        high_20 = adjusted_prices.rolling(window=min(20, len(adjusted_prices))).max().iloc[-1]
        low_20 = adjusted_prices.rolling(window=min(20, len(adjusted_prices))).min().iloc[-1]

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

def get_historical_prices(period="7d"):
    """Fetch historical silver prices from Yahoo Finance"""
    symbol = "SI=F"
    data = yf.download(symbol, period=period, interval="1d", auto_adjust=False)

    # ✅ Handle multi-index columns properly
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.droplevel(1)  # Remove ticker level, keep OHLCV

    print(f"\n🔹 Cleaned Data for {symbol}:\n", data.head())

    if "Close" in data.columns:
        prices = data["Close"].dropna().to_dict()
    else:
        prices = {}
    return data, prices

def calculate_price_stats(close_prices, exchange_rate):
    """Calculate price statistics and convert to INR"""
    try:
        if close_prices.empty:
            return {}
        
        # Calculate price changes
        price_change_7d = ((close_prices.iloc[-1] - close_prices.iloc[-7]) / close_prices.iloc[-7]) * 100 if len(close_prices) >= 7 else 0
        price_change_30d = ((close_prices.iloc[-1] - close_prices.iloc[0]) / close_prices.iloc[0]) * 100 if len(close_prices) > 1 else 0
        
        # Calculate ranges and convert to INR
        high_7d_usd = close_prices.tail(7).max() if len(close_prices) >= 7 else close_prices.max()
        low_7d_usd = close_prices.tail(7).min() if len(close_prices) >= 7 else close_prices.min()
        high_30d_usd = close_prices.max()
        low_30d_usd = close_prices.min()
        
        # Convert to INR (per ounce, then multiply by 32.15 for per kg)
        high_7d_inr = convert_usd_to_inr(high_7d_usd * 32.15, exchange_rate)
        low_7d_inr = convert_usd_to_inr(low_7d_usd * 32.15, exchange_rate)
        high_30d_inr = convert_usd_to_inr(high_30d_usd * 32.15, exchange_rate)
        low_30d_inr = convert_usd_to_inr(low_30d_usd * 32.15, exchange_rate)
        
        return {
            "price_change_7d": round(price_change_7d, 2),
            "price_change_30d": round(price_change_30d, 2),
            "high_7d_inr": round(high_7d_inr, 2),
            "low_7d_inr": round(low_7d_inr, 2),
            "high_30d_inr": round(high_30d_inr, 2),
            "low_30d_inr": round(low_30d_inr, 2)
        }
    except Exception as e:
        print(f"Error calculating price stats: {e}")
        return {}

def calculate_premium_analysis(retail_price, spot_price_usd, exchange_rate):
    """Calculate premium difference between retail and spot prices"""
    try:
        # Convert spot price to INR per kg
        spot_price_inr_per_kg = spot_price_usd * 32.15 * exchange_rate
        
        # Calculate premium
        premium_diff = retail_price - spot_price_inr_per_kg
        premium_percent = (premium_diff / spot_price_inr_per_kg) * 100 if spot_price_inr_per_kg else 0
        
        return {
            "spot_price_inr": round(spot_price_inr_per_kg, 2),
            "premium_diff": round(premium_diff, 2),
            "premium_percent": round(premium_percent, 2)
        }
    except Exception as e:
        print(f"Error calculating premium analysis: {e}")
        return {
            "spot_price_inr": 0,
            "premium_diff": 0,
            "premium_percent": 0
        }

def generate_ai_analysis(market_data, news_articles, exchange_rate):
    """Generate AI-powered market analysis using Gemini"""
    try:
        # Prepare news texts
        news_texts = [f"[{article['source']}] {article['title']} - {article['description'][:150]}..." 
                     for article in news_articles if article.get('title')]

        # Enhanced AI Prompt
        prompt = f"""
        You are an expert silver market analyst with 15+ years of experience in precious metals trading.

        📊 **CURRENT MARKET DATA:**
        • Current Price: ₹{market_data.get('current_price', 'N/A')}
        • Spot Price: ₹{market_data.get('spot_price', 'N/A')}
        • Premium: ₹{market_data.get('premium_diff', 'N/A')} ({market_data.get('premium_percent', 'N/A')}%)
        • 7-Day Change: {market_data.get('price_change_7d', 'N/A')}%
        • 30-Day Change: {market_data.get('price_change_30d', 'N/A')}%
        • 7-Day Range: ₹{market_data.get('low_7d_inr', 'N/A')} - ₹{market_data.get('high_7d_inr', 'N/A')}
        • 30-Day Range: ₹{market_data.get('low_30d_inr', 'N/A')} - ₹{market_data.get('high_30d_inr', 'N/A')}

        📈 **TECHNICAL ANALYSIS:**
        • Trend: {market_data.get('technical_indicators', {}).get('trend', 'Neutral')}
        • RSI: {market_data.get('technical_indicators', {}).get('rsi', 'N/A')}
        • Support Level: ₹{market_data.get('technical_indicators', {}).get('support', 'N/A')}
        • Resistance Level: ₹{market_data.get('technical_indicators', {}).get('resistance', 'N/A')}
        • 5-Day SMA: ₹{market_data.get('technical_indicators', {}).get('sma_5', 'N/A')}
        • 20-Day SMA: ₹{market_data.get('technical_indicators', {}).get('sma_20', 'N/A')}

        🌍 **MARKET CORRELATIONS:**
        • USD Index Change (5d): {market_data.get('market_correlations', {}).get('usd_index_change', 'N/A')}%
        • Gold Price Change (5d): {market_data.get('market_correlations', {}).get('gold_change', 'N/A')}%
        • Exchange Rate: 1 USD = ₹{exchange_rate}

        📰 **LATEST SILVER-SPECIFIC NEWS:**
        {chr(10).join(news_texts[:6]) if news_texts else 'No recent silver news available'}

        **ANALYSIS FRAMEWORK:**
        Consider: Premium sustainability vs spot prices, industrial demand, investment demand, 
        supply constraints, geopolitical factors, inflation expectations, USD strength, 
        mining production, jewelry demand, and technical patterns.

        **PROVIDE STRUCTURED ANALYSIS (ALL PRICES IN INR):**

        **Recommendation:** [Buy/Hold/Sell]

        **Reason:** [Comprehensive analysis considering premium levels, technical indicators, 
        fundamental factors, news sentiment, and market correlations. Minimum 150 words covering key driving factors.]

        **Suggested Holding Period (if buying):** [Short-term (1-4 weeks), Medium-term (1-3 months), 
        Long-term (3-12 months)] with specific reasoning.

        **Target Price Range:** [Specific price targets in INR per kg based on technical levels. 
        Example: ₹108,000 - ₹118,000. Justify based on support/resistance levels and premium analysis.]

        IMPORTANT: All price targets and levels must be quoted in Indian Rupees (₹) only, not USD.
        Focus on actionable insights considering both technical analysis and premium dynamics.
        """

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        print(f"Error generating AI analysis: {e}")
        return f"AI analysis temporarily unavailable: {str(e)}"

def get_complete_market_analysis(retail_price, news_articles):
    """Get complete technical and fundamental analysis"""
    try:
        # Get exchange rate
        exchange_rate = get_usd_to_inr_rate()
        
        # Get historical data
        data, historical_prices = get_historical_prices(period="30d")
        
        if data.empty:
            return {"error": "No historical data available"}
        
        close_prices = data["Close"].dropna()
        
        if close_prices.empty:
            return {"error": "No price data available"}
        
        # Calculate price statistics
        price_stats = calculate_price_stats(close_prices, exchange_rate)
        
        # Get technical indicators
        technical_indicators = get_technical_indicators(close_prices, exchange_rate)
        
        # Get market indicators
        market_indicators = get_market_indicators()
        
        # Calculate premium analysis
        current_spot_price = close_prices.iloc[-1]
        premium_analysis = calculate_premium_analysis(retail_price, current_spot_price, exchange_rate)
        
        # Combine all market data
        market_data = {
            "current_price": retail_price,
            "exchange_rate": exchange_rate,
            "technical_indicators": technical_indicators,
            "market_correlations": market_indicators,
            **price_stats,
            **premium_analysis
        }
        
        # Generate AI analysis
        ai_recommendation = generate_ai_analysis(market_data, news_articles, exchange_rate)
        
        return {
            "ai_recommendation": ai_recommendation,
            "market_data": market_data,
            "news_count": len(news_articles)
        }
        
    except Exception as e:
        print(f"Error in complete market analysis: {e}")
        return {"error": str(e)}