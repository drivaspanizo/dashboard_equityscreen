# Let's create a solution to classify S&P 500 stocks into Value and Growth categories
import pandas as pd
import numpy as np
import yfinance as yf

# Since we can't fetch all 500 companies at once due to API limits,
# let's use a small sample for demonstration
sp500_sample = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'BRK-B', 'NVDA', 'JPM', 'V', 'JNJ',
                'PG', 'XOM', 'CVX', 'WMT', 'KO', 'PEP', 'BAC', 'HD', 'MRK', 'DIS',
                'PFE', 'CSCO', 'VZ', 'T', 'INTC', 'CMCSA']

# Get stock information
def get_stock_info(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Extract key metrics for classification
        key_metrics = {
            'symbol': ticker,
            'name': info.get('shortName', 'N/A'),
            'sector': info.get('sector', 'N/A'),
            'industry': info.get('industry', 'N/A'),
            'marketCap': info.get('marketCap', 0) or 0,
            'pe': info.get('trailingPE', 0) or 0,
            'pb': info.get('priceToBook', 0) or 0,
            'ps': info.get('priceToSalesTrailing12Months', 0) or 0,
            'eps_growth': info.get('earningsQuarterlyGrowth', 0) or 0,
            'revenue_growth': info.get('revenueGrowth', 0) or 0,
            'ebit': info.get('ebitda', 0) or 0,
            'ev': info.get('enterpriseValue', 0) or 0,
            'fcf': info.get('freeCashflow', 0) or 0,
            'roic': info.get('returnOnEquity', 0) or 0,  # Using ROE as proxy for ROIC
            'current_price': info.get('currentPrice', 0) or 0
        }
        return key_metrics
    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        # Return default values in case of error
        return {
            'symbol': ticker,
            'name': ticker,
            'sector': 'Unknown',
            'industry': 'Unknown',
            'marketCap': 0,
            'pe': 0,
            'pb': 0,
            'ps': 0,
            'eps_growth': 0,
            'revenue_growth': 0,
            'ebit': 0,
            'ev': 0,
            'fcf': 0,
            'roic': 0,
            'current_price': 0
        }

# Collect data for sample stocks
print("Collecting data for sample stocks...")
data = []
for ticker in sp500_sample:
    stock_info = get_stock_info(ticker)
    data.append(stock_info)
    print(f"Processed {ticker}")

# Create DataFrame
df = pd.DataFrame(data)

# Calculate additional metrics
print("\nCalculating additional metrics...")
df['ev_ebit'] = np.where(df['ebit'] != 0, df['ev'] / df['ebit'], 0)
df['fcf_yield'] = np.where(df['marketCap'] != 0, df['fcf'] / df['marketCap'] * 100, 0)

# Filter out any rows with invalid data
df = df[df['marketCap'] > 0]

# Define thresholds for Value stocks (bottom 30% of PE, PB, EV/EBIT)
pe_threshold = df['pe'].quantile(0.3)
pb_threshold = df['pb'].quantile(0.3)
ev_ebit_threshold = df['ev_ebit'].quantile(0.3)

# Define thresholds for Growth stocks (top 30% of EPS growth, Revenue growth, PS)
eps_growth_threshold = df['eps_growth'].quantile(0.7)
revenue_growth_threshold = df['revenue_growth'].quantile(0.7)
ps_threshold = df['ps'].quantile(0.7)

print(f"Value thresholds - PE: {pe_threshold:.2f}, PB: {pb_threshold:.2f}, EV/EBIT: {ev_ebit_threshold:.2f}")
print(f"Growth thresholds - EPS Growth: {eps_growth_threshold:.2f}, Revenue Growth: {revenue_growth_threshold:.2f}, P/S: {ps_threshold:.2f}")

# Classify stocks using Fama-French methodology
def classify_stock(row):
    value_points = 0
    growth_points = 0
    
    # Value criteria - low multiples (bottom 30%)
    if row['pe'] > 0 and row['pe'] < pe_threshold: 
        value_points += 1
    if row['pb'] > 0 and row['pb'] < pb_threshold: 
        value_points += 1
    if row['ev_ebit'] > 0 and row['ev_ebit'] < ev_ebit_threshold: 
        value_points += 1
    
    # Growth criteria - high growth (top 30%)
    if row['eps_growth'] > eps_growth_threshold: 
        growth_points += 1
    if row['revenue_growth'] > revenue_growth_threshold: 
        growth_points += 1
    if row['ps'] > ps_threshold: 
        growth_points += 1
    
    # Classification - need at least 2 criteria met
    if value_points >= 2:
        return 'Value'
    elif growth_points >= 2:
        return 'Growth'
    else:
        return 'Blend'

df['classification'] = df.apply(classify_stock, axis=1)

# Calculate simple fair value based on P/E ratio
def calculate_fair_value(row):
    try:
        # Using sector average P/E as benchmark
        sector = row['sector']
        sector_avg_pe = df[df['sector'] == sector]['pe'].mean()
        
        # If PE is negative or zero, use a default value
        if sector_avg_pe <= 0:
            sector_avg_pe = 15  # Default PE
            
        # Calculate fair value based on earnings and sector average PE
        eps = row['current_price'] / row['pe'] if row['pe'] > 0 else 0
        fair_value = eps * sector_avg_pe
        
        return fair_value
    except:
        return 0

df['fair_value'] = df.apply(calculate_fair_value, axis=1)

# Calculate DCF Value Gap (%)
df['dcf_value_gap'] = np.where(
    df['current_price'] > 0,
    ((df['fair_value'] - df['current_price']) / df['current_price'] * 100).round(2),
    0
)

# Assign valuation tags to Value stocks
def value_tag(row):
    if row['classification'] != 'Value':
        return 'N/A'
    
    value_gap = row['dcf_value_gap']
    
    if value_gap > 10:
        return 'VALUE – Undervalued'
    elif value_gap > -10:
        return 'VALUE – Fairly Valued'
    else:
        return 'VALUE – Overvalued'

df['valuation_tag'] = df.apply(value_tag, axis=1)

# Assign growth tags to Growth stocks
def growth_tag(row):
    if row['classification'] != 'Growth':
        return 'N/A'
    
    eps_growth = row['eps_growth']
    rev_growth = row['revenue_growth']
    
    if eps_growth > 0.15 and rev_growth > 0.10:
        return 'GROWTH – Momentum'
    else:
        return 'GROWTH – Watchlist'

df['growth_tag'] = df.apply(growth_tag, axis=1)

# Combine tags
df['final_tag'] = np.where(df['classification'] == 'Value', df['valuation_tag'], 
                          np.where(df['classification'] == 'Growth', df['growth_tag'], 'Blend'))

# Display results
print("\nStock Classification Results:")
print(df[['symbol', 'name', 'sector', 'classification', 'final_tag', 'dcf_value_gap', 'fair_value', 'current_price']].head(10))

# Count by classification
classification_counts = df['classification'].value_counts()
print("\nDistribution of classifications:")
print(classification_counts)

# Prepare sector distribution
sector_distribution = df.groupby(['sector', 'classification']).size().unstack(fill_value=0)
print("\nSector distribution by classification:")
print(sector_distribution)

# Save to CSV
df.to_csv('sp500_dashboard_data.csv', index=False)
print("\nData saved to sp500_dashboard_data.csv")

# Return a summary of the data
value_count = len(df[df['classification'] == 'Value'])
growth_count = len(df[df['classification'] == 'Growth'])
blend_count = len(df[df['classification'] == 'Blend'])
total_count = len(df)

print(f"\nSummary: Processed {total_count} stocks")
print(f"Value: {value_count} ({value_count/total_count*100:.1f}%)")
print(f"Growth: {growth_count} ({growth_count/total_count*100:.1f}%)")
print(f"Blend: {blend_count} ({blend_count/total_count*100:.1f}%)")