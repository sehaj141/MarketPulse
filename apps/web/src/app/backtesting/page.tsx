'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Play, TrendingUp, ShieldAlert, Award, DollarSign, RefreshCw } from 'lucide-react';

export default function BacktestingPage() {
  const [strategyName, setStrategyName] = useState('Momentum Breakout Strategy');
  const [initialCapital, setInitialCapital] = useState(100000);
  const [positionSize, setPositionSize] = useState(20);
  const [feePercent, setFeePercent] = useState(0.1);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunBacktest = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>('/api/backtests', {
        method: 'POST',
        body: JSON.stringify({
          strategyName,
          symbols: ['NVDA', 'AAPL', 'MSFT', 'AMD', 'META'],
          startDate: '2023-01-01',
          endDate: '2024-09-01',
          initialCapital: Number(initialCapital),
          positionSizePercent: Number(positionSize),
          transactionCostPercent: Number(feePercent),
          dsl: {
            logic: 'AND',
            conditions: [{ field: 'rsi14', operator: '>', value: 55 }]
          }
        })
      });

      setResult(res);
    } catch (err: any) {
      alert(`Backtest failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center space-x-2">
            <PieChart className="w-6 h-6 text-primary" />
            <span>QUANTITATIVE BACKTESTING ENGINE</span>
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Simulate quantitative trading strategies over historical daily OHLCV bars
          </p>
        </div>

        <button
          onClick={handleRunBacktest}
          disabled={loading}
          className="px-5 py-2 bg-primary text-black font-bold text-xs rounded-lg hover:bg-primary-hover flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{loading ? 'Simulating Engine...' : 'Run Backtest'}</span>
        </button>
      </div>

      {/* Strategy Parameters Form */}
      <div className="p-4 bg-surface rounded-xl border border-border space-y-4">
        <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">Strategy Parameters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          
          <div>
            <label className="text-muted block mb-1">Strategy Name</label>
            <input
              type="text"
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              className="w-full bg-surface-elevated text-foreground px-3 py-2 rounded border border-border focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-muted block mb-1">Initial Capital ($)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full bg-surface-elevated text-foreground px-3 py-2 rounded border border-border focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-muted block mb-1">Position Size (% Capital)</label>
            <input
              type="number"
              value={positionSize}
              onChange={(e) => setPositionSize(Number(e.target.value))}
              className="w-full bg-surface-elevated text-foreground px-3 py-2 rounded border border-border focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-muted block mb-1">Transaction Cost (%)</label>
            <input
              type="number"
              step="0.05"
              value={feePercent}
              onChange={(e) => setFeePercent(Number(e.target.value))}
              className="w-full bg-surface-elevated text-foreground px-3 py-2 rounded border border-border focus:outline-none focus:border-primary"
            />
          </div>

        </div>
      </div>

      {/* Backtest Results Dashboard */}
      {result && (
        <div className="space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] text-muted block">TOTAL RETURN</span>
              <span className="text-base font-bold text-success mt-1 block">+{result.totalReturnPercent}%</span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] text-muted block">CAGR</span>
              <span className="text-base font-bold text-primary mt-1 block">+{result.cagrPercent}%</span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] text-muted block">MAX DRAWDOWN</span>
              <span className="text-base font-bold text-danger mt-1 block">-{result.maxDrawdownPercent}%</span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] text-muted block">WIN RATE</span>
              <span className="text-base font-bold text-foreground mt-1 block">{result.winRatePercent}%</span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] text-muted block">SHARPE RATIO</span>
              <span className="text-base font-bold text-amber-400 mt-1 block">{result.sharpeRatio}</span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <span className="text-[10px] text-muted block">PROFIT FACTOR</span>
              <span className="text-base font-bold text-foreground mt-1 block">{result.profitFactor}</span>
            </div>
          </div>

          {/* Equity Curve Chart */}
          <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-foreground">STRATEGY EQUITY CURVE VS BENCHMARK</span>
              <span className="text-muted">Initial: ${initialCapital.toLocaleString()}</span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.equityCurve}>
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} orientation="right" />
                  <Tooltip contentStyle={{ backgroundColor: '#121721', borderColor: '#232e42', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="portfolioValue" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} strokeWidth={2} name="Strategy Capital" />
                  <Area type="monotone" dataKey="benchmarkValue" stroke="#64748b" fill="#64748b" fillOpacity={0.1} strokeWidth={1.5} name="Benchmark" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trade Ledger Table */}
          <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Trade Execution History Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-dense text-left">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Entry Date</th>
                    <th>Entry Price</th>
                    <th>Exit Date</th>
                    <th>Exit Price</th>
                    <th>Return %</th>
                    <th>P/L ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades?.map((t: any) => {
                    const isWin = t.profitDollars >= 0;
                    return (
                      <tr key={t.id} className="hover:bg-surface-elevated">
                        <td className="font-bold text-primary">{t.symbol}</td>
                        <td className="text-muted">{t.entryDate}</td>
                        <td>${t.entryPrice}</td>
                        <td className="text-muted">{t.exitDate}</td>
                        <td>${t.exitPrice}</td>
                        <td className={isWin ? 'text-success' : 'text-danger'}>
                          {isWin ? '+' : ''}{t.returnPercent}%
                        </td>
                        <td className={`font-bold ${isWin ? 'text-success' : 'text-danger'}`}>
                          {isWin ? `+$${t.profitDollars}` : `-$${Math.abs(t.profitDollars)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
