export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
}

export interface Stock {
  id: string;
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  exchange: string;
  marketCap: number; // in USD
  peRatio: number;
  eps: number;
  revenueGrowth: number; // percentage
  profitMargin: number; // percentage
  roe: number; // percentage
  debtToEquity: number;
  high52w: number;
  low52w: number;
  avgVolume: number;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  updatedAt: string;
}

export interface HistoricalPrice {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  symbol: string;
  sma20: number;
  sma50: number;
  sma200: number;
  ema20: number;
  rsi14: number;
  macd: number;
  macdSignal: number;
  macdHist: number;
  bbUpper: number;
  bbLower: number;
  atr14: number;
}

export interface ScreenerCondition {
  field: string;
  operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
  value: number | string;
}

export interface ScreenerDSL {
  logic: 'AND' | 'OR';
  conditions: ScreenerCondition[];
}

export interface SavedScreen {
  id: string;
  userId: string;
  name: string;
  description: string;
  queryDsl: ScreenerDSL;
  isPublic: boolean;
  createdAt: string;
}

export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  symbols: string[];
  createdAt: string;
}

export interface AlertRule {
  id: string;
  userId: string;
  symbol: string;
  metric: string;
  operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
  threshold: number;
  isActive: boolean;
  triggeredCount: number;
  lastTriggeredAt?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ALERT' | 'SYSTEM' | 'AI';
  read: boolean;
  createdAt: string;
}

export interface BacktestConfig {
  strategyName: string;
  symbols: string[];
  startDate: string;
  endDate: string;
  initialCapital: number;
  positionSizePercent: number;
  transactionCostPercent: number;
  dsl: ScreenerDSL;
}

export interface BacktestTrade {
  id: string;
  symbol: string;
  entryDate: string;
  entryPrice: number;
  exitDate: string;
  exitPrice: number;
  returnPercent: number;
  profitDollars: number;
  shares: number;
}

export interface EquityPoint {
  date: string;
  portfolioValue: number;
  drawdownPercent: number;
  benchmarkValue: number;
}

export interface BacktestResult {
  id: string;
  userId: string;
  strategyName: string;
  config: BacktestConfig;
  totalReturnPercent: number;
  cagrPercent: number;
  maxDrawdownPercent: number;
  winRatePercent: number;
  totalTrades: number;
  sharpeRatio: number;
  profitFactor: number;
  equityCurve: EquityPoint[];
  trades: BacktestTrade[];
  createdAt: string;
}

export interface PortfolioPosition {
  id: string;
  userId: string;
  symbol: string;
  shares: number;
  avgCostBasis: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  sector: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface StockNewsItem {
  id: string;
  symbol: string;
  headline: string;
  source: string;
  timestamp: string;
  summary: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  url: string;
}

export interface SystemMetrics {
  activeUsers: number;
  apiRequestsTotal: number;
  activeWebSockets: number;
  redisLatencyMs: number;
  postgresLatencyMs: number;
  alertEvaluationsTotal: number;
  bullmqQueueStatus: 'HEALTHY' | 'DEGRADED' | 'PAUSED';
  uptimeSeconds: number;
}
