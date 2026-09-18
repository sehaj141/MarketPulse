'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { PieChart, Activity, TrendingUp, DollarSign } from 'lucide-react';

export default function PortfolioPage() {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetchApi<any>('/api/portfolio?userId=user_regular');
        setData(res);
      } catch (e) {
        console.error(e);
      }
    }
    loadPortfolio();
  }, []);

  if (!data) return <div className="p-8 text-center font-mono text-muted">Loading portfolio positions...</div>;

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>PORTFOLIO & RISK ANALYTICS</span>
          </h1>
          <p className="text-xs text-muted">Demo position tracking, P&L calculations, sector exposure metrics</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">TOTAL VALUE</span>
          <span className="text-xl font-bold text-foreground mt-1 block">${data.summary.totalValue.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">UNREALIZED P&L</span>
          <span className="text-xl font-bold text-success mt-1 block">+${data.summary.totalUnrealizedPnL.toLocaleString()} (+{data.summary.totalUnrealizedPnLPercent}%)</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">DAILY P&L</span>
          <span className="text-xl font-bold text-success mt-1 block">+${data.summary.dailyPnL}</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">POSITIONS</span>
          <span className="text-xl font-bold text-foreground mt-1 block">{data.positions.length} Stocks</span>
        </div>
      </div>

      {/* Positions Table */}
      <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
        <h2 className="font-bold text-sm uppercase">Open Positions Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-dense text-left">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Shares</th>
                <th>Avg Cost</th>
                <th>Current Price</th>
                <th>Total Value</th>
                <th>Unrealized P&L</th>
              </tr>
            </thead>
            <tbody>
              {data.positions.map((p: any) => (
                <tr key={p.symbol} className="hover:bg-surface-elevated">
                  <td className="font-bold text-primary">{p.symbol}</td>
                  <td>{p.shares}</td>
                  <td>${p.avgCostBasis}</td>
                  <td>${p.currentPrice}</td>
                  <td>${p.totalValue.toLocaleString()}</td>
                  <td className="text-success font-bold">+${p.unrealizedPnL} (+{p.unrealizedPnLPercent}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
