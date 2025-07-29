"""
Test script for technical_analysis.py
This will run the analysis and print detailed output to verify correctness
Windows compatible version
"""

# Import the functions from your technical_analysis.py
# Make sure technical_analysis.py is in the same directory
try:
    from technical_analysis import (
        get_usd_to_inr_rate,
        get_historical_prices,
        get_technical_indicators,
        get_market_indicators,
        calculate_price_stats,
        calculate_premium_analysis,
        get_complete_market_analysis
    )
    print("✅ Successfully imported all functions from technical_analysis.py")
except ImportError as e:
    print(f"❌ Error importing functions: {e}")
    print("Make sure technical_analysis.py is in the same directory and all dependencies are installed")
    exit(1)

def test_individual_functions():
    """Test each function individually"""
    print("\n" + "="*60)
    print("TESTING INDIVIDUAL FUNCTIONS")
    print("="*60)
    
    # Test 1: Exchange Rate
    print("\n🔹 Testing USD to INR rate...")
    try:
        exchange_rate = get_usd_to_inr_rate()
        print(f"Exchange Rate: 1 USD = ₹{exchange_rate}")
        if 75 <= exchange_rate <= 90:
            print("✅ Exchange rate seems reasonable")
        else:
            print("⚠️  Exchange rate seems unusual")
    except Exception as e:
        print(f"❌ Error getting exchange rate: {e}")
    
    # Test 2: Historical Prices
    print("\n🔹 Testing historical price data...")
    try:
        data, historical_prices = get_historical_prices(period="7d")
        print(f"Data shape: {data.shape}")
        print(f"Columns: {list(data.columns)}")
        print(f"Historical prices count: {len(historical_prices)}")
        
        if not data.empty and 'Close' in data.columns:
            latest_price = data['Close'].iloc[-1]
            print(f"Latest silver price (USD/oz): ${latest_price:.2f}")
            print("✅ Historical data retrieved successfully")
            
            # Show last 3 days of data
            print("\nLast 3 days of close prices:")
            for date, price in list(historical_prices.items())[-3:]:
                print(f"  {date.strftime('%Y-%m-%d')}: ${price:.2f}")
        else:
            print("❌ No historical data retrieved")
            return None, None
            
    except Exception as e:
        print(f"❌ Error getting historical prices: {e}")
        return None, None
    
    # Test 3: Technical Indicators
    print("\n🔹 Testing technical indicators...")
    try:
        close_prices = data['Close'].dropna()
        technical_indicators = get_technical_indicators(close_prices, exchange_rate)
        print("Technical Indicators (INR per kg):")
        for key, value in technical_indicators.items():
            print(f"  {key}: {value}")
        print("✅ Technical indicators calculated")
    except Exception as e:
        print(f"❌ Error calculating technical indicators: {e}")
    
    # Test 4: Market Indicators
    print("\n🔹 Testing market indicators...")
    try:
        market_indicators = get_market_indicators()
        print("Market Indicators:")
        for key, value in market_indicators.items():
            print(f"  {key}: {value}%")
        print("✅ Market indicators retrieved")
    except Exception as e:
        print(f"❌ Error getting market indicators: {e}")
    
    # Test 5: Price Statistics
    print("\n🔹 Testing price statistics...")
    try:
        price_stats = calculate_price_stats(close_prices, exchange_rate)
        print("Price Statistics:")
        for key, value in price_stats.items():
            if 'inr' in key.lower():
                print(f"  {key}: ₹{value:,.2f}")
            else:
                print(f"  {key}: {value}%")
        print("✅ Price statistics calculated")
    except Exception as e:
        print(f"❌ Error calculating price statistics: {e}")
    
    # Test 6: Premium Analysis
    print("\n🔹 Testing premium analysis...")
    try:
        # Use a sample retail price (typical Indian silver price per kg)
        sample_retail_price = 110000  # ₹110,000 per kg
        current_spot_price = close_prices.iloc[-1]
        
        premium_analysis = calculate_premium_analysis(sample_retail_price, current_spot_price, exchange_rate)
        print(f"Sample retail price: ₹{sample_retail_price:,.2f} per kg")
        print("Premium Analysis:")
        for key, value in premium_analysis.items():
            if 'inr' in key.lower() or 'diff' in key.lower():
                print(f"  {key}: ₹{value:,.2f}")
            else:
                print(f"  {key}: {value}%")
        print("✅ Premium analysis calculated")
    except Exception as e:
        print(f"❌ Error calculating premium analysis: {e}")
    
    return data, exchange_rate

def test_complete_analysis():
    """Test the complete analysis function"""
    print("\n" + "="*60)
    print("TESTING COMPLETE MARKET ANALYSIS")
    print("="*60)
    
    # Sample data
    sample_retail_price = 110000  # ₹110,000 per kg
    sample_news = [
        {
            'title': 'Silver prices rise on industrial demand',
            'description': 'Silver futures gained as industrial demand continues to support prices',
            'source': 'Sample News'
        },
        {
            'title': 'Dollar weakness supports precious metals',
            'description': 'Weaker dollar index provides tailwind for silver and gold prices',
            'source': 'Market News'
        }
    ]
    
    print(f"Testing with retail price: ₹{sample_retail_price:,.2f} per kg")
    print(f"Sample news articles: {len(sample_news)}")
    
    try:
        result = get_complete_market_analysis(sample_retail_price, sample_news)
        
        if 'error' in result:
            print(f"❌ Analysis failed: {result['error']}")
            return
        
        print("\n✅ Complete analysis successful!")
        print(f"News articles processed: {result.get('news_count', 0)}")
        
        # Print market data
        if 'market_data' in result:
            market_data = result['market_data']
            print("\n📊 MARKET DATA SUMMARY:")
            print(f"  Current Price: ₹{market_data.get('current_price', 'N/A'):,.2f}")
            print(f"  Exchange Rate: ₹{market_data.get('exchange_rate', 'N/A'):.2f}")
            print(f"  Spot Price (INR): ₹{market_data.get('spot_price_inr', 'N/A'):,.2f}")
            print(f"  Premium: ₹{market_data.get('premium_diff', 'N/A'):,.2f} ({market_data.get('premium_percent', 'N/A'):.2f}%)")
            print(f"  7-Day Change: {market_data.get('price_change_7d', 'N/A'):.2f}%")
            print(f"  30-Day Change: {market_data.get('price_change_30d', 'N/A'):.2f}%")
            
            if 'technical_indicators' in market_data:
                tech = market_data['technical_indicators']
                print(f"\n📈 TECHNICAL INDICATORS:")
                print(f"  Trend: {tech.get('trend', 'N/A')}")
                print(f"  RSI: {tech.get('rsi', 'N/A')}")
                print(f"  Support: ₹{tech.get('support', 'N/A'):,.2f}")
                print(f"  Resistance: ₹{tech.get('resistance', 'N/A'):,.2f}")
        
        # Print AI recommendation (first 500 characters)
        if 'ai_recommendation' in result:
            ai_text = result['ai_recommendation']
            print(f"\n🤖 AI RECOMMENDATION (first 500 chars):")
            print(f"{ai_text[:500]}...")
            
            # Check if recommendation contains key elements
            if 'Buy' in ai_text or 'Sell' in ai_text or 'Hold' in ai_text:
                print("✅ AI recommendation contains trading advice")
            else:
                print("⚠️  AI recommendation may be incomplete")
                
    except Exception as e:
        print(f"❌ Error in complete analysis: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Main test function"""
    print("SILVER TECHNICAL ANALYSIS - TEST SCRIPT")
    print("="*60)
    print("This script will test all functions in technical_analysis.py")
    print("Please check the output for any errors or unexpected values")
    
    # Test individual functions first
    data, exchange_rate = test_individual_functions()
    
    if data is not None:
        # Test complete analysis
        test_complete_analysis()
    else:
        print("\n❌ Skipping complete analysis test due to data retrieval issues")
    
    print("\n" + "="*60)
    print("TEST COMPLETED")
    print("="*60)
    print("\nPlease review the output above and report any issues you notice.")
    print("Key things to check:")
    print("- Exchange rates should be between ₹75-90")
    print("- Silver prices should be reasonable (around $25-35 per ounce)")
    print("- Technical indicators should have proper values")
    print("- Premium analysis should show reasonable premiums")
    print("- AI recommendation should contain actionable advice")

if __name__ == "__main__":
    main()