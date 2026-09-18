'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Globe, TrendingUp, BarChart2 } from 'lucide-react';

export default function MarketsPage() {
  const [overview, setOverview] = useState<any | null>(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await fetchApi<any>('/api/stocks/overview');
        setOverview(res);
      } catch (e) {
        console.error(e);
      }
    }
    loadOverview();
  }, []);

  if (!overview) return <div className="p-8 text-center font-mono text-muted">Loading sector heatmap...</div>;

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <Globe className="w-5 h-5 text-primary" />
            <span>MARKET OVERVIEW & SECTOR HEATMAP</span>
          </h1>
          <p className="text-xs text-muted">Sector allocation returns, market breadth metrics, high-volume activity</p>
        </div>
      </div>

      {/* Market Breadth Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">ADVANCING STOCKS</span>
          <span className="text-2xl font-bold text-success mt-1 block">{overview.breadth.advancing}</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">DECLINING STOCKS</span>
          <span className="text-2xl font-bold text-danger mt-1 block">{overview.breadth.declining}</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">UNCHANGED STOCKS</span>
          <span className="text-2xl font-bold text-foreground mt-1 block">{overview.breadth.unchanged}</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">A/D RATIO</span>
          <span className="text-2xl font-bold text-primary mt-1 block">{overview.breadth.ratio}x</span>
        </div>
      </div>

      {/* Sector Heatmap Grid */}
      <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
        <h2 className="font-bold text-sm uppercase">Sector Performance Heatmap</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overview.sectorPerformance.map((s: any) => {
            const isPos = s.avgChangePercent >= 0;
            return (
              <div
                key={s.sector}
                className={`p-4 rounded-xl border transition-all ${
                  isPos ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'
                }`}
              >
                <span className="font-bold text-sm block">{s.sector}</span>
                <span className="text-2xl font-black block mt-2">{isPos ? '+' : ''}{s.avgChangePercent}%</span>
                <span className="text-[10px] text-muted block mt-1">{s.stockCount} tracked equities</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
