import { Stock, HistoricalPrice, TechnicalIndicators, User, Watchlist, SavedScreen, AlertRule, BacktestResult, PortfolioPosition, StockNewsItem } from '../types';

// Helper to generate realistic historical OHLCV series
export function generateHistoricalPrices(symbol: string, basePrice: number, days: number = 365): HistoricalPrice[] {
  const prices: HistoricalPrice[] = [];
  let currentClose = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const volatility = 0.018; // 1.8% daily volatility
    const changePercent = (Math.random() - 0.48) * volatility; // slight upward bias
    const open = currentClose * (1 + (Math.random() - 0.5) * 0.005);
    const close = Math.max(1, open * (1 + changePercent));
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(Math.random() * 15000000 + 2000000);

    prices.push({
      symbol,
      date: d.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });

    currentClose = close;
  }

  return prices;
}

// Generate 300 realistic stock symbols across 11 sectors
const SECTORS = [
  'Technology', 'Financial Services', 'Healthcare', 'Consumer Cyclical',
  'Communication Services', 'Industrials', 'Consumer Defensive', 'Energy',
  'Real Estate', 'Basic Materials', 'Utilities'
];

const RAW_STOCKS_DATA = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', price: 124.50, cap: 3050000000000, pe: 72.4, eps: 1.71, revGrowth: 122.4, margin: 55.2, roe: 68.4, de: 0.42 },
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 224.23, cap: 3430000000000, pe: 34.2, eps: 6.56, revGrowth: 4.8, margin: 26.4, roe: 147.2, de: 1.80 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', price: 432.10, cap: 3210000000000, pe: 36.8, eps: 11.74, revGrowth: 17.0, margin: 36.1, roe: 38.5, de: 0.48 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', price: 186.40, cap: 1940000000000, pe: 42.1, eps: 4.43, revGrowth: 12.5, margin: 6.4, roe: 21.8, de: 0.62 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services', price: 178.90, cap: 2220000000000, pe: 26.5, eps: 6.75, revGrowth: 15.4, margin: 24.1, roe: 30.2, de: 0.11 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', price: 512.30, cap: 1300000000000, pe: 27.4, eps: 18.70, revGrowth: 22.1, margin: 34.0, roe: 33.6, de: 0.22 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical', price: 235.60, cap: 750000000000, pe: 64.2, eps: 3.67, revGrowth: -2.4, margin: 12.1, roe: 24.5, de: 0.14 },
  { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', price: 168.40, cap: 780000000000, pe: 48.6, eps: 3.46, revGrowth: 43.0, margin: 31.8, roe: 45.2, de: 1.45 },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology', price: 156.20, cap: 252000000000, pe: 112.5, eps: 1.39, revGrowth: 8.9, margin: 8.5, roe: 4.1, de: 0.06 },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', price: 21.40, cap: 91000000000, pe: 88.0, eps: 0.24, revGrowth: -0.9, margin: 1.2, roe: 0.9, de: 0.44 },
  { symbol: 'QCOM', name: 'QUALCOMM Incorporated', sector: 'Technology', price: 168.90, cap: 188000000000, pe: 22.4, eps: 7.54, revGrowth: 11.1, margin: 25.6, roe: 37.8, de: 0.68 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', price: 208.50, cap: 595000000000, pe: 12.1, eps: 17.23, revGrowth: 9.4, margin: 32.5, roe: 17.4, de: 1.25 },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services', price: 39.80, cap: 310000000000, pe: 13.8, eps: 2.88, revGrowth: 3.2, margin: 24.2, roe: 9.8, de: 1.12 },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', sector: 'Financial Services', price: 448.90, cap: 975000000000, pe: 21.4, eps: 20.98, revGrowth: 7.6, margin: 18.2, roe: 14.1, de: 0.21 },
  { symbol: 'LLY', name: 'Eli Lilly and Company', sector: 'Healthcare', price: 924.50, cap: 878000000000, pe: 118.2, eps: 7.82, revGrowth: 36.0, margin: 16.4, roe: 48.2, de: 1.95 },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', price: 28.70, cap: 162000000000, pe: 15.2, eps: 1.89, revGrowth: -19.4, margin: 8.9, roe: 4.5, de: 0.72 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 164.20, cap: 395000000000, pe: 24.1, eps: 6.81, revGrowth: 2.3, margin: 21.5, roe: 25.4, de: 0.48 },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', price: 582.40, cap: 535000000000, pe: 28.9, eps: 20.15, revGrowth: 8.6, margin: 5.8, roe: 26.8, de: 0.75 },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', price: 116.80, cap: 462000000000, pe: 14.2, eps: 8.23, revGrowth: 1.5, margin: 10.4, roe: 18.2, de: 0.18 },
  { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', price: 144.20, cap: 265000000000, pe: 13.9, eps: 10.37, revGrowth: -1.8, margin: 9.8, roe: 13.5, de: 0.14 },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive', price: 78.90, cap: 635000000000, pe: 36.5, eps: 2.16, revGrowth: 4.8, margin: 2.4, roe: 19.8, de: 0.65 },
  { symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer Defensive', price: 890.40, cap: 395000000000, pe: 54.2, eps: 16.42, revGrowth: 9.1, margin: 2.8, roe: 29.4, de: 0.28 },
  { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Cyclical', price: 385.20, cap: 382000000000, pe: 25.4, eps: 15.16, revGrowth: 0.6, margin: 9.8, roe: 820.0, de: 25.0 },
  { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials', price: 358.40, cap: 175000000000, pe: 16.8, eps: 21.33, revGrowth: 0.4, margin: 15.6, roe: 56.4, de: 1.85 },
  { symbol: 'GE', name: 'GE Aerospace', sector: 'Industrials', price: 178.60, cap: 195000000000, pe: 38.4, eps: 4.65, revGrowth: 18.2, margin: 14.2, roe: 22.1, de: 0.62 },
  { symbol: 'PLTR', name: 'Palantir Technologies Inc.', sector: 'Technology', price: 34.50, cap: 78000000000, pe: 98.4, eps: 0.35, revGrowth: 27.2, margin: 19.8, roe: 14.5, de: 0.02 },
  { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 258.90, cap: 248000000000, pe: 44.5, eps: 5.82, revGrowth: 10.7, margin: 17.5, roe: 9.8, de: 0.16 },
  { symbol: 'NET', name: 'Cloudflare Inc.', sector: 'Technology', price: 82.40, cap: 28000000000, pe: 145.0, eps: 0.57, revGrowth: 30.1, margin: 4.8, roe: 6.2, de: 1.15 },
  { symbol: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', price: 118.60, cap: 39000000000, pe: 92.0, eps: 0.95, revGrowth: 28.9, margin: -32.0, roe: -24.0, de: 0.05 },
  { symbol: 'ARM', name: 'Arm Holdings plc', sector: 'Technology', price: 138.40, cap: 144000000000, pe: 94.2, eps: 1.47, revGrowth: 39.1, margin: 28.4, roe: 15.2, de: 0.01 }
];

// Generate additional fill stocks up to 100+
export function createSeedDataset() {
  const stocks: Stock[] = [];
  const historicalMap: Record<string, HistoricalPrice[]> = {};
  const technicalsMap: Record<string, TechnicalIndicators> = {};

  // Expand base list to 100 items by generating realistic variants
  let index = 0;
  for (const raw of RAW_STOCKS_DATA) {
    stocks.push(buildStockObject(raw.symbol, raw.name, raw.sector, raw.price, raw.cap, raw.pe, raw.eps, raw.revGrowth, raw.margin, raw.roe, raw.de));
    index++;
  }

  // Generate synthetic tickers to bring total to 100
  const prefixes = ['NEX', 'VORT', 'QUANT', 'APEX', 'ZEN', 'CYBER', 'HYPER', 'OMNI', 'SOLAR', 'BIO', 'GEN', 'FIN', 'STRAT', 'CORE'];
  const suffixes = ['AI', 'SYS', 'CORP', 'TECH', 'NET', 'HOLD', 'SOL', 'PHARMA', 'ENERGY', 'PROP'];

  for (let i = index; i < 110; i++) {
    const pref = prefixes[i % prefixes.length];
    const suff = suffixes[(i * 3) % suffixes.length];
    const sym = `${pref}${suff.substring(0, 2)}${i}`.toUpperCase().substring(0, 5);
    const sector = SECTORS[i % SECTORS.length];
    const price = Number((Math.random() * 250 + 15).toFixed(2));
    const cap = Math.floor(Math.random() * 500000000000 + 2000000000);
    const pe = Number((Math.random() * 60 + 8).toFixed(1));
    const eps = Number((price / pe).toFixed(2));
    const revGrowth = Number(((Math.random() - 0.2) * 45).toFixed(1));
    const margin = Number(((Math.random() * 30 + 2)).toFixed(1));
    const roe = Number(((Math.random() * 35 + 4)).toFixed(1));
    const de = Number((Math.random() * 1.5).toFixed(2));

    stocks.push(buildStockObject(sym, `${pref} ${suff} Systems Inc.`, sector, price, cap, pe, eps, revGrowth, margin, roe, de));
  }

  // Populate history and technicals for each stock
  for (const stock of stocks) {
    const history = generateHistoricalPrices(stock.symbol, stock.currentPrice, 365);
    historicalMap[stock.symbol] = history;

    // Calculate indicators from history
    const closes = history.map(h => h.close);
    const lastClose = closes[closes.length - 1];

    technicalsMap[stock.symbol] = {
      symbol: stock.symbol,
      sma20: Number(calcSMA(closes, 20).toFixed(2)),
      sma50: Number(calcSMA(closes, 50).toFixed(2)),
      sma200: Number(calcSMA(closes, 200).toFixed(2)),
      ema20: Number(calcEMA(closes, 20).toFixed(2)),
      rsi14: Number(calcRSI(closes, 14).toFixed(1)),
      macd: Number((lastClose * 0.015 - Math.random() * 0.5).toFixed(2)),
      macdSignal: Number((lastClose * 0.012).toFixed(2)),
      macdHist: Number((Math.random() * 0.4 - 0.2).toFixed(2)),
      bbUpper: Number((lastClose * 1.08).toFixed(2)),
      bbLower: Number((lastClose * 0.92).toFixed(2)),
      atr14: Number((lastClose * 0.025).toFixed(2))
    };
  }

  return { stocks, historicalMap, technicalsMap };
}

function buildStockObject(
  symbol: string, name: string, sector: string, price: number,
  cap: number, pe: number, eps: number, revGrowth: number,
  margin: number, roe: number, de: number
): Stock {
  const changePercent = Number(((Math.random() - 0.45) * 4.5).toFixed(2));
  const change = Number((price * (changePercent / 100)).toFixed(2));
  return {
    id: `stock_${symbol.toLowerCase()}`,
    symbol,
    companyName: name,
    sector,
    industry: `${sector} Solutions`,
    exchange: 'NASDAQ',
    marketCap: cap,
    peRatio: pe,
    eps,
    revenueGrowth: revGrowth,
    profitMargin: margin,
    roe,
    debtToEquity: de,
    high52w: Number((price * 1.25).toFixed(2)),
    low52w: Number((price * 0.75).toFixed(2)),
    avgVolume: Math.floor(Math.random() * 20000000 + 1000000),
    currentPrice: price,
    priceChange: change,
    priceChangePercent: changePercent,
    volume: Math.floor(Math.random() * 15000000 + 2000000),
    updatedAt: new Date().toISOString()
  };
}

function calcSMA(data: number[], period: number): number {
  if (data.length < period) return data[data.length - 1] || 100;
  const slice = data.slice(data.length - period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function calcEMA(data: number[], period: number): number {
  if (data.length === 0) return 100;
  const k = 2 / (period + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return ema;
}

function calcRSI(data: number[], period: number = 14): number {
  if (data.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = data.length - period; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = (gains / period) / (losses / period);
  return 100 - (100 / (1 + rs));
}

// Seed Users
export const SEED_USERS: User[] = [
  {
    id: 'user_regular',
    email: 'user@marketpulse.com',
    name: 'Alex Rivera',
    role: 'USER',
    passwordHash: '$2a$10$wT5H8p49Z3w00.y11jYq8O8rJ4GqV0V7/7iL4kF7j0u.X3R2hO.4u', // password123
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_admin',
    email: 'admin@marketpulse.com',
    name: 'Sarah Connor (Admin)',
    role: 'ADMIN',
    passwordHash: '$2a$10$wT5H8p49Z3w00.y11jYq8O8rJ4GqV0V7/7iL4kF7j0u.X3R2hO.4u', // password123
    createdAt: new Date().toISOString()
  }
];

// Seed Watchlists
export const SEED_WATCHLISTS: Watchlist[] = [
  {
    id: 'wl_tech_leaders',
    userId: 'user_regular',
    name: 'Tech Titans',
    isDefault: true,
    symbols: ['NVDA', 'AAPL', 'MSFT', 'AVGO', 'AMD'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'wl_breakouts',
    userId: 'user_regular',
    name: 'Momentum Breakouts',
    isDefault: false,
    symbols: ['PLTR', 'META', 'ARM', 'NET', 'TSLA'],
    createdAt: new Date().toISOString()
  }
];

// Seed Saved Screens
export const SEED_SAVED_SCREENS: SavedScreen[] = [
  {
    id: 'screen_hyper_growth',
    userId: 'user_regular',
    name: 'Hyper-Growth Tech Leaders',
    description: 'Tech stocks with >20% Revenue Growth, RSI > 55, and Price above 50-day SMA',
    queryDsl: {
      logic: 'AND',
      conditions: [
        { field: 'sector', operator: '==', value: 'Technology' },
        { field: 'revenueGrowth', operator: '>', value: 20 },
        { field: 'rsi14', operator: '>', value: 55 },
        { field: 'price_gt_sma50', operator: '==', value: 1 }
      ]
    },
    isPublic: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'screen_value_moats',
    userId: 'user_regular',
    name: 'High-ROE Quality Moats',
    description: 'Low debt, high profit margin companies trading at reasonable P/E',
    queryDsl: {
      logic: 'AND',
      conditions: [
        { field: 'roe', operator: '>', value: 20 },
        { field: 'profitMargin', operator: '>', value: 15 },
        { field: 'peRatio', operator: '<', value: 35 }
      ]
    },
    isPublic: true,
    createdAt: new Date().toISOString()
  }
];

// Seed Alerts
export const SEED_ALERTS: AlertRule[] = [
  {
    id: 'alert_nvda_breakout',
    userId: 'user_regular',
    symbol: 'NVDA',
    metric: 'currentPrice',
    operator: '>',
    threshold: 130,
    isActive: true,
    triggeredCount: 2,
    lastTriggeredAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'alert_amd_oversold',
    userId: 'user_regular',
    symbol: 'AMD',
    metric: 'rsi14',
    operator: '<',
    threshold: 35,
    isActive: true,
    triggeredCount: 0,
    createdAt: new Date().toISOString()
  }
];

// Seed Portfolio Positions
export const SEED_PORTFOLIO: PortfolioPosition[] = [
  { id: 'pos_1', userId: 'user_regular', symbol: 'NVDA', shares: 150, avgCostBasis: 110.20, currentPrice: 124.50, totalValue: 18675, unrealizedPnL: 2145, unrealizedPnLPercent: 12.98, sector: 'Technology' },
  { id: 'pos_2', userId: 'user_regular', symbol: 'MSFT', shares: 50, avgCostBasis: 415.00, currentPrice: 432.10, totalValue: 21605, unrealizedPnL: 855, unrealizedPnLPercent: 4.12, sector: 'Technology' },
  { id: 'pos_3', userId: 'user_regular', symbol: 'JPM', shares: 100, avgCostBasis: 195.40, currentPrice: 208.50, totalValue: 20850, unrealizedPnL: 1310, unrealizedPnLPercent: 6.70, sector: 'Financial Services' },
  { id: 'pos_4', userId: 'user_regular', symbol: 'LLY', shares: 20, avgCostBasis: 850.00, currentPrice: 924.50, totalValue: 18490, unrealizedPnL: 1490, unrealizedPnLPercent: 8.76, sector: 'Healthcare' }
];

// Seed News Feed
export const SEED_NEWS: StockNewsItem[] = [
  { id: 'news_1', symbol: 'NVDA', headline: 'NVIDIA Announces Next-Gen Blackwell Ultra Architecture Demand Exceeds Supply', source: 'MarketPulse Intelligence', timestamp: '10m ago', summary: 'Major cloud providers accelerate datacenter AI node deployments, boosting forward revenue guidance.', sentiment: 'POSITIVE', url: '#' },
  { id: 'news_2', symbol: 'AAPL', headline: 'Apple Expands On-Device Generative AI Models for iOS 18 Suite', source: 'Financial Wire', timestamp: '45m ago', summary: 'Integration of custom silicon Neural Engine capabilities expected to drive iPhone upgrade cycle.', sentiment: 'POSITIVE', url: '#' },
  { id: 'news_3', symbol: 'MSFT', headline: 'Microsoft Azure AI Revenue Surges 31% YoY in Latest Quarter', source: 'Tech Market Pulse', timestamp: '2h ago', summary: 'Enterprise Copilot adoption expands across Fortune 500 accounts.', sentiment: 'POSITIVE', url: '#' },
  { id: 'news_4', symbol: 'TSLA', headline: 'Tesla Demonstrates Full Self-Driving Supercomputer Upgrade', source: 'Autonomy Daily', timestamp: '4h ago', summary: 'New training cluster comes online to train end-to-end vision neural networks.', sentiment: 'NEUTRAL', url: '#' }
];
