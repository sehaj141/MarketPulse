'use client';

import React from 'react';
import Link from 'next/link';
import { FolderSearch, Filter, PieChart, Bookmark } from 'lucide-react';

export default function ResearchPage() {
  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <FolderSearch className="w-5 h-5 text-primary" />
            <span>SAVED RESEARCH HUB</span>
          </h1>
          <p className="text-xs text-muted">Central repository of saved screens, backtests, and research notes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
          <div className="flex items-center space-x-2 font-bold text-foreground">
            <Filter className="w-4 h-4 text-primary" />
            <span>Saved Screener DSL Queries</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-surface-elevated rounded border border-border">
              <div className="font-bold text-primary">Hyper-Growth Tech Leaders</div>
              <p className="text-muted text-[11px] mt-1">Tech stocks with &gt;20% Revenue Growth, RSI &gt; 55, and Price &gt; SMA 50</p>
            </div>
            <div className="p-3 bg-surface-elevated rounded border border-border">
              <div className="font-bold text-primary">High-ROE Quality Moats</div>
              <p className="text-muted text-[11px] mt-1">Low debt, high profit margin companies trading at reasonable P/E</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
          <div className="flex items-center space-x-2 font-bold text-foreground">
            <PieChart className="w-4 h-4 text-primary" />
            <span>Saved Backtesting Strategies</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-surface-elevated rounded border border-border">
              <div className="font-bold text-primary">AI Momentum Breakout Strategy</div>
              <p className="text-muted text-[11px] mt-1">Total Return: +34.8% | CAGR: +26.1% | Sharpe: 1.84</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
