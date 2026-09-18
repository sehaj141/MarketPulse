'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { fetchApi } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { Star, Bell, ArrowLeftRight, TrendingUp, Filter, Bot, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = ((params?.symbol as string) || 'NVDA').toUpperCase();

  const ticks = useStore((state) => state.ticks);
  const liveTick = ticks[symbol];

  const [stock, setStock] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'chart' | 'fundamentals' | 'technicals' | 'news' | 'ai'>('chart');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [indicators, setIndicators] = useState({ sma50: true, sma200: true, rsi: false });
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareData, setCompareData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStockData() {
      setLoading(true);
      try {
        const [stockRes, historyRes] = await Promise.all([
          fetchApi<any>(`/api/stocks/${symbol}`),
          fetchApi<any[]>(`/api/stocks/${symbol}/history`)
        ]);

        setStock(stockRes);
        setHistory(historyRes);
      } catch (err) {
        console.error(`Failed to load stock ${symbol}:`, err);
      } finally {
        setLoading(false);
      }
    }

    loadStockData();
  }, [symbol]);

  const handleCompareClick = async () => {
    setShowCompareModal(true);
    try {
      const data = await fetchApi<any[]>(`/api/stocks/compare?symbols=${symbol},AMD,AVGO`);
      setCompareData(data);
    } catch (e) {
      console.error('Failed to compare stocks:', e);
    }
  };

  if (loading || !stock) {
    return (
      <div className="space-y-6 animate-pulse font-mono">
        <div className="h-16 bg-surface-elevated rounded-xl" />
        <div className="h-96 bg-surface-elevated rounded-xl" />
      </div>
    );
  }

  const currentPrice = liveTick ? liveTick.currentPrice : stock.currentPrice;
  const priceChangePct = liveTick ? liveTick.priceChangePercent : stock.priceChangePercent;
  const isPos = priceChangePct >= 0;

  // Filter timeframe
  let displayedHistory = history;
  if (timeframe === '1M') displayedHistory = history.slice(-22);
  else if (timeframe === '3M') displayedHistory = history.slice(-65);
  else if (timeframe === '6M') displayedHistory = history.slice(-130);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="p-4 bg-surface rounded-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black text-foreground">{stock.symbol}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-surface-elevated text-muted border border-border">
              {stock.exchange} · {stock.sector}
            </span>
          </div>
          <h1 className="text-sm text-muted mt-0.5">{stock.companyName}</h1>
        </div>

        {/* Live Price Display & Quick Actions */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">${currentPrice}</div>
            <div className={`text-xs ${isPos ? 'text-success' : 'text-danger'}`}>
              {isPos ? '+' : ''}{priceChangePct}% (${stock.priceChange})
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/watchlists')}
              className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-primary text-xs font-semibold flex items-center space-x-1.5"
            >
              <Star className="w-3.5 h-3.5 text-warning" />
              <span>Watchlist</span>
            </button>
            <button
              onClick={() => router.push('/alerts')}
              className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-primary text-xs font-semibold flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-primary" />
              <span>Alert</span>
            </button>
            <button
              onClick={handleCompareClick}
              className="px-3 py-1.5 rounded-lg bg-primary text-black font-bold text-xs flex items-center space-x-1.5 hover:bg-primary-hover"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-border font-mono text-xs">
        {(['chart', 'fundamentals', 'technicals', 'news', 'ai'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 font-semibold capitalize transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Interactive Financial Chart Workstation */}
      {activeTab === 'chart' && (
        <div className="p-4 bg-surface rounded-xl border border-border space-y-4 font-mono">
          
          {/* Chart Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-muted">Type:</span>
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded text-xs ${chartType === 'area' ? 'bg-primary text-black font-bold' : 'bg-surface-elevated text-muted'}`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded text-xs ${chartType === 'bar' ? 'bg-primary text-black font-bold' : 'bg-surface-elevated text-muted'}`}
              >
                Volume Bar
              </button>
            </div>

            {/* Timeframe Selectors */}
            <div className="flex items-center space-x-1 text-xs">
              {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded text-xs ${timeframe === tf ? 'bg-surface-elevated border border-primary text-primary font-bold' : 'text-muted hover:text-foreground'}`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Technical Indicator Toggles */}
            <div className="flex items-center space-x-3 text-xs">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={indicators.sma50}
                  onChange={(e) => setIndicators({ ...indicators, sma50: e.target.checked })}
                  className="rounded bg-background border-border text-primary"
                />
                <span className="text-amber-400">SMA 50 (${stock.technicals?.sma50})</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={indicators.sma200}
                  onChange={(e) => setIndicators({ ...indicators, sma200: e.target.checked })}
                  className="rounded bg-background border-border text-primary"
                />
                <span className="text-indigo-400">SMA 200 (${stock.technicals?.sma200})</span>
              </label>
            </div>
          </div>

          {/* Recharts Financial Chart Container */}
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={displayedHistory}>
                  <defs>
                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 10 }} orientation="right" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#121721', borderColor: '#232e42', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="close" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" />
                  {indicators.sma50 && <ReferenceLine y={stock.technicals?.sma50} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'SMA50', fill: '#f59e0b', fontSize: 10 }} />}
                  {indicators.sma200 && <ReferenceLine y={stock.technicals?.sma200} stroke="#818cf8" strokeDasharray="3 3" label={{ value: 'SMA200', fill: '#818cf8', fontSize: 10 }} />}
                </AreaChart>
              ) : (
                <BarChart data={displayedHistory}>
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} orientation="right" />
                  <Tooltip contentStyle={{ backgroundColor: '#121721', borderColor: '#232e42', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar dataKey="volume" fill="#38bdf8" opacity={0.7} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        <div className="p-3 bg-surface rounded-lg border border-border">
          <span className="text-[10px] text-muted block">MARKET CAP</span>
          <span className="text-sm font-bold text-foreground mt-1 block">${(stock.marketCap / 1e9).toFixed(1)}B</span>
        </div>
        <div className="p-3 bg-surface rounded-lg border border-border">
          <span className="text-[10px] text-muted block">P/E RATIO</span>
          <span className="text-sm font-bold text-foreground mt-1 block">{stock.peRatio}x</span>
        </div>
        <div className="p-3 bg-surface rounded-lg border border-border">
          <span className="text-[10px] text-muted block">EPS</span>
          <span className="text-sm font-bold text-foreground mt-1 block">${stock.eps}</span>
        </div>
        <div className="p-3 bg-surface rounded-lg border border-border">
          <span className="text-[10px] text-muted block">REV GROWTH</span>
          <span className="text-sm font-bold text-success mt-1 block">+{stock.revenueGrowth}%</span>
        </div>
        <div className="p-3 bg-surface rounded-lg border border-border">
          <span className="text-[10px] text-muted block">RSI (14)</span>
          <span className="text-sm font-bold text-primary mt-1 block">{stock.technicals?.rsi14}</span>
        </div>
      </div>

      {/* Tab 2: Fundamentals & Ratios */}
      {activeTab === 'fundamentals' && (
        <div className="p-6 bg-surface rounded-xl border border-border space-y-4 font-mono">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Detailed Financial Metrics & Ratios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-4 bg-surface-elevated rounded border border-border">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">Profit Margin:</span>
                <span className="font-bold text-foreground">{stock.profitMargin}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">Return on Equity (ROE):</span>
                <span className="font-bold text-foreground">{stock.roe}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Debt-to-Equity Ratio:</span>
                <span className="font-bold text-foreground">{stock.debtToEquity}</span>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-surface-elevated rounded border border-border">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">52-Week High:</span>
                <span className="font-bold text-success">${stock.high52w}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted">52-Week Low:</span>
                <span className="font-bold text-danger">${stock.low52w}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Average Daily Volume:</span>
                <span className="font-bold text-foreground">{(stock.avgVolume / 1e6).toFixed(1)}M</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-surface border border-border rounded-xl p-6 space-y-4 font-mono shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground">Multi-Stock Comparison Workstation</h3>
              <button onClick={() => setShowCompareModal(false)} className="text-muted hover:text-foreground">✕</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-dense text-left">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>P/E</th>
                    <th>Rev Growth</th>
                    <th>Profit Margin</th>
                    <th>RSI (14)</th>
                  </tr>
                </thead>
                <tbody>
                  {compareData.map((item) => (
                    <tr key={item.symbol} className="hover:bg-surface-elevated">
                      <td className="font-bold text-primary">{item.symbol}</td>
                      <td>${item.currentPrice}</td>
                      <td>{item.peRatio}x</td>
                      <td className="text-success">+{item.revenueGrowth}%</td>
                      <td>{item.profitMargin}%</td>
                      <td>{item.technicals?.rsi14}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
