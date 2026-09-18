'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { fetchApi } from '@/lib/api';
import { TrendingUp, TrendingDown, Activity, Filter, ArrowUpRight, ArrowDownRight, Bot, Zap, Bookmark } from 'lucide-react';

export default function DashboardPage() {
  const user = useStore((state) => state.user);
  const ticks = useStore((state) => state.ticks);

  const [indices, setIndices] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [indicesRes, overviewRes, watchlistsRes] = await Promise.all([
          fetchApi<any[]>('/api/stocks/indices'),
          fetchApi<any>('/api/stocks/overview'),
          fetchApi<any[]>('/api/watchlists?userId=user_regular')
        ]);

        setIndices(indicesRes);
        setOverview(overviewRes);
        setWatchlists(watchlistsRes);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-mono">
        <div className="h-8 bg-surface-elevated rounded w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-surface-elevated rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-surface-elevated rounded-xl" />
          <div className="h-64 bg-surface-elevated rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground">
            Good morning, {user?.name || 'Researcher'}
          </h1>
          <p className="text-xs text-muted font-mono mt-0.5">
            Market Intelligence Workspace Overview
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-foreground font-semibold">● Market Open</span>
            <span className="text-muted text-[10px] ml-1">(Simulated Stream)</span>
          </div>
        </div>
      </div>

      {/* Major Market Indices Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {indices.map((idx) => {
          const isPos = idx.change >= 0;
          return (
            <div key={idx.symbol} className="p-3.5 bg-surface rounded-xl border border-border hover:border-primary/40 transition-all font-mono">
              <div className="flex justify-between items-center text-xs text-muted">
                <span>{idx.name}</span>
                <span className={isPos ? 'text-success' : 'text-danger'}>
                  {isPos ? '+' : ''}{idx.changePercent}%
                </span>
              </div>
              <div className="text-lg font-bold text-foreground mt-1">
                {idx.price.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted mt-1 flex items-center justify-between">
                <span>{isPos ? `+${idx.change}` : idx.change} pts</span>
                {isPos ? <ArrowUpRight className="w-3.5 h-3.5 text-success" /> : <ArrowDownRight className="w-3.5 h-3.5 text-danger" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Modular Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Top Gainers & Losers */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Top Gainers & Losers Tabbed Section */}
          <div className="p-4 bg-surface rounded-xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <h2 className="font-bold text-sm text-foreground uppercase tracking-wider font-mono">Top Market Movers</h2>
              </div>
              <Link href="/markets" className="text-xs text-primary hover:underline font-mono">View Heatmap →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Gainers List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-success font-semibold uppercase">Top Gainers</span>
                <div className="space-y-1.5">
                  {overview?.gainers?.map((s: any) => {
                    const tick = ticks[s.symbol];
                    const price = tick ? tick.currentPrice : s.currentPrice;
                    const changePct = tick ? tick.priceChangePercent : s.priceChangePercent;
                    return (
                      <Link
                        key={s.symbol}
                        href={`/stocks/${s.symbol}`}
                        className="flex items-center justify-between p-2 rounded bg-surface-elevated hover:bg-primary/10 transition-colors font-mono text-xs"
                      >
                        <div>
                          <span className="font-bold text-foreground block">{s.symbol}</span>
                          <span className="text-[10px] text-muted truncate max-w-[120px] block">{s.companyName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-foreground block">${price}</span>
                          <span className="text-success text-[11px]">+{changePct}%</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Losers List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-danger font-semibold uppercase">Top Losers</span>
                <div className="space-y-1.5">
                  {overview?.losers?.map((s: any) => {
                    const tick = ticks[s.symbol];
                    const price = tick ? tick.currentPrice : s.currentPrice;
                    const changePct = tick ? tick.priceChangePercent : s.priceChangePercent;
                    return (
                      <Link
                        key={s.symbol}
                        href={`/stocks/${s.symbol}`}
                        className="flex items-center justify-between p-2 rounded bg-surface-elevated hover:bg-danger/10 transition-colors font-mono text-xs"
                      >
                        <div>
                          <span className="font-bold text-foreground block">{s.symbol}</span>
                          <span className="text-[10px] text-muted truncate max-w-[120px] block">{s.companyName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-foreground block">${price}</span>
                          <span className="text-danger text-[11px]">{changePct}%</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Sector Performance Grid */}
          <div className="p-4 bg-surface rounded-xl border border-border font-mono">
            <h2 className="font-bold text-sm text-foreground uppercase tracking-wider mb-3">Sector Performance Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {overview?.sectorPerformance?.slice(0, 6).map((sec: any) => {
                const isPos = sec.avgChangePercent >= 0;
                return (
                  <div key={sec.sector} className="p-2.5 rounded bg-surface-elevated border border-border">
                    <span className="text-[11px] text-muted truncate block">{sec.sector}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted">{sec.stockCount} stocks</span>
                      <span className={`text-xs font-bold ${isPos ? 'text-success' : 'text-danger'}`}>
                        {isPos ? '+' : ''}{sec.avgChangePercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Column 2: AI Intelligence Digest & Watchlist Summary */}
        <div className="space-y-6">

          {/* AI Market Summary Card */}
          <div className="p-4 bg-surface rounded-xl border border-border space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-primary border-b border-border pb-2">
              <div className="flex items-center space-x-2 font-bold">
                <Bot className="w-4 h-4" />
                <span>AI MARKET BRIEF</span>
              </div>
              <span className="text-[10px] text-muted">GENERATED NOW</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-sans">
              "Technology and Semiconductor sectors continue to show strong relative momentum with high relative volume. RSI overlays suggest NVDA and AVGO remain above key 50-day moving averages."
            </p>
            <Link
              href="/ai-terminal"
              className="w-full block py-2 text-center rounded bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors"
            >
              Open AI Terminal Workspace →
            </Link>
          </div>

          {/* Watchlist Quick Summary Widget */}
          <div className="p-4 bg-surface rounded-xl border border-border space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
                <Bookmark className="w-4 h-4 text-primary" />
                <span>TECH TITANS WATCHLIST</span>
              </div>
              <Link href="/watchlists" className="text-[10px] text-primary hover:underline">Manage</Link>
            </div>

            <div className="space-y-1.5">
              {['NVDA', 'AAPL', 'MSFT', 'AVGO', 'AMD'].map((sym) => {
                const tick = ticks[sym];
                const price = tick ? tick.currentPrice : (sym === 'NVDA' ? 124.50 : 224.23);
                const pct = tick ? tick.priceChangePercent : 1.85;
                const isPos = pct >= 0;

                return (
                  <Link
                    key={sym}
                    href={`/stocks/${sym}`}
                    className="flex items-center justify-between p-2 rounded bg-surface-elevated hover:bg-primary/10 transition-colors text-xs"
                  >
                    <span className="font-bold text-foreground">{sym}</span>
                    <div className="text-right">
                      <span className="text-foreground block">${price}</span>
                      <span className={`text-[10px] ${isPos ? 'text-success' : 'text-danger'}`}>
                        {isPos ? '+' : ''}{pct}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
