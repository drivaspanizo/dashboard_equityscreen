# Let's first explore what data we can get from Yahoo Finance API
import pandas as pd
import numpy as np
import yfinance as yf
import matplotlib.pyplot as plt

# Example S&P 500 tickers (just a few to test with)
sp500_sample = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'BRK-B', 'NVDA', 'JPM', 'V', 'JNJ']

# Let's test getting stock data
def get_stock_info(ticker):
    stock = yf.Ticker(ticker)
    info = stock.info
    # Extract just a few key metrics
    key_metrics = {
        'symbol': ticker,
        'name': info.get('shortName', 'N/A'),
        'sector': info.get('sector', 'N/A'),
        'industry': info.get('industry', 'N/A'),
        'marketCap': info.get('marketCap', 0),
        'pe': info.get('trailingPE', 0),
        'pb': info.get('priceToBook', 0),
        'ps': info.get('priceToSalesTrailing12Months', 0),
        'eps_growth': info.get('earningsQuarterlyGrowth', 0),
        'revenue_growth': info.get('revenueGrowth', 0),
        'ebit': info.get('ebitda', 0) or 0,
        'ev': info.get('enterpriseValue', 0) or 0,
        'fcf': info.get('freeCashflow', 0) or 0
    }
    return key_metrics

# Test with Apple
apple_info = get_stock_info('AAPL')
print(apple_info)

# Now let's test with a few more stocks to create a sample dataframe
data = []
for ticker in sp500_sample:
    try:
        stock_info = get_stock_info(ticker)
        data.append(stock_info)
        print(f"Successfully fetched data for {ticker}")
    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")

# Create a DataFrame from the collected data
df = pd.DataFrame(data)
print("\nSample DataFrame of S&P 500 stocks:")
print(df.head())

# Let's add some additional calculated metrics
df['ev_ebit'] = np.where(df['ebit'] != 0, df['ev'] / df['ebit'], 0)
df['fcf_yield'] = np.where(df['marketCap'] != 0, df['fcf'] / df['marketCap'] * 100, 0)

# Display the updated DataFrame
print("\nSample DataFrame with calculated metrics:")
print(df[['symbol', 'name', 'sector', 'pe', 'pb', 'ps', 'ev_ebit', 'fcf_yield']].head())

# Now let's apply the Fama-French classification
# Define thresholds for Value stocks (bottom 30% of PE, PB, EV/EBIT)
pe_threshold = df['pe'].quantile(0.3)
pb_threshold = df['pb'].quantile(0.3)
ev_ebit_threshold = df['ev_ebit'].quantile(0.3)

# Define thresholds for Growth stocks (top 30% of EPS growth, Revenue growth, PS)
eps_growth_threshold = df['eps_growth'].quantile(0.7)
revenue_growth_threshold = df['revenue_growth'].quantile(0.7)
ps_threshold = df['ps'].quantile(0.7)

# Classify stocks
def classify_stock(row):
    value_points = 0
    growth_points = 0
    
    # Value criteria
    if row['pe'] > 0 and row['pe'] < pe_threshold: 
        value_points += 1
    if row['pb'] > 0 and row['pb'] < pb_threshold: 
        value_points += 1
    if row['ev_ebit'] > 0 and row['ev_ebit'] < ev_ebit_threshold: 
        value_points += 1
    
    # Growth criteria
    if row['eps_growth'] > eps_growth_threshold: 
        growth_points += 1
    if row['revenue_growth'] > revenue_growth_threshold: 
        growth_points += 1
    if row['ps'] > ps_threshold: 
        growth_points += 1
    
    # Classification
    if value_points >= 2:
        return 'Value'
    elif growth_points >= 2:
        return 'Growth'
    else:
        return 'Blend'

df['classification'] = df.apply(classify_stock, axis=1)

# Further categorize Value stocks as Undervalued, Fairly Valued, or Overvalued
# For this example, we'll use a simple approach based on PE ratio
def value_tag(row):
    if row['classification'] != 'Value':
        return 'N/A'
    
    pe = row['pe']
    sector_avg_pe = df[df['sector'] == row['sector']]['pe'].mean()
    
    if pd.isna(pe) or pd.isna(sector_avg_pe) or sector_avg_pe == 0:
        return 'N/A'
    
    pe_ratio = pe / sector_avg_pe
    
    if pe_ratio < 0.8:
        return 'VALUE - Undervalued'
    elif pe_ratio < 1.2:
        return 'VALUE - Fairly Valued'
    else:
        return 'VALUE - Overvalued'

df['valuation_tag'] = df.apply(value_tag, axis=1)

# Further categorize Growth stocks
def growth_tag(row):
    if row['classification'] != 'Growth':
        return 'N/A'
    
    eps_growth = row['eps_growth']
    rev_growth = row['revenue_growth']
    
    if eps_growth > 0.15 and rev_growth > 0.10:
        return 'GROWTH - Momentum'
    else:
        return 'GROWTH - Watchlist'

df['growth_tag'] = df.apply(growth_tag, axis=1)

# Combine tags
df['final_tag'] = np.where(df['classification'] == 'Value', df['valuation_tag'], 
                          np.where(df['classification'] == 'Growth', df['growth_tag'], 'Blend'))

print("\nStocks with classifications:")
print(df[['symbol', 'name', 'sector', 'pe', 'pb', 'classification', 'final_tag']].head(10))

# Calculate fair value based on a simple DCF model (very simplified example)
def calculate_fair_value(row):
    try:
        # Extremely simplified DCF calculation for demonstration
        if row['fcf'] <= 0:
            return 0
        
        # Assume 3% perpetual growth and 10% discount rate
        fair_value = row['fcf'] * (1 + 0.03) / (0.10 - 0.03)
        
        # DCF Value Gap (%)
        market_cap = row['marketCap']
        if market_cap > 0:
            value_gap = (fair_value - market_cap) / market_cap * 100
            return round(value_gap, 2)
        return 0
    except:
        return 0

df['dcf_value_gap'] = df.apply(calculate_fair_value, axis=1)

print("\nStocks with DCF Value Gap:")
print(df[['symbol', 'name', 'sector', 'classification', 'final_tag', 'dcf_value_gap']].head(10))

# Show distribution of classifications
classification_counts = df['classification'].value_counts()
print("\nDistribution of classifications:")
print(classification_counts)

# Show sector distribution
sector_counts = df['sector'].value_counts()
print("\nSector distribution:")
print(sector_counts)

# Display market cap weighted average PE, PB, and EV/EBIT by classification
def weighted_avg(group, value_col, weight_col):
    return np.average(group[value_col], weights=group[weight_col])

value_stocks = df[df['classification'] == 'Value']
growth_stocks = df[df['classification'] == 'Growth']

print("\nMarket cap weighted average metrics:")
print("Value stocks:")
print(f"PE: {weighted_avg(value_stocks, 'pe', 'marketCap'):.2f}")
print(f"PB: {weighted_avg(value_stocks, 'pb', 'marketCap'):.2f}")
print(f"EV/EBIT: {weighted_avg(value_stocks, 'ev_ebit', 'marketCap'):.2f}")

print("\nGrowth stocks:")
print(f"PE: {weighted_avg(growth_stocks, 'pe', 'marketCap'):.2f}")
print(f"PB: {weighted_avg(growth_stocks, 'pb', 'marketCap'):.2f}")
print(f"EV/EBIT: {weighted_avg(growth_stocks, 'ev_ebit', 'marketCap'):.2f}")