'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Filter, Plus, Trash2, Play, Download, Sparkles, Check, Bookmark, ArrowUpDown } from 'lucide-react';

interface Condition {
  id: string;
  field: string;
  operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
  value: any;
}

export default function ScreenerPage() {
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', field: 'revenueGrowth', operator: '>', value: 15 },
    { id: '2', field: 'rsi14', operator: '>', value: 55 },
    { id: '3', field: 'price_gt_sma50', operator: '==', value: 1 }
  ]);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGeneratedDsl, setAiGeneratedDsl] = useState<any | null>(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedScreens, setSavedScreens] = useState<any[]>([]);

  useEffect(() => {
    loadSavedScreens();
    runScreen();
  }, []);

  const loadSavedScreens = async () => {
    try {
      const saved = await fetchApi<any[]>('/api/screens/saved?userId=user_regular');
      setSavedScreens(saved);
    } catch (e) {
      console.error(e);
    }
  };

  const runScreen = async (customDsl?: any) => {
    setLoading(true);
    try {
      const dslToRun = customDsl || {
        logic,
        conditions: conditions.map(({ field, operator, value }) => ({ field, operator, value: Number(value) || value }))
      };

      const res = await fetchApi<any>('/api/screens/run', {
        method: 'POST',
        body: JSON.stringify(dslToRun)
      });

      setResults(res.data || []);
    } catch (err: any) {
      alert(`Screener error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAiConvert = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetchApi<any>('/api/ai/screen-prompt', {
        method: 'POST',
        body: JSON.stringify({ prompt: aiPrompt })
      });

      setAiGeneratedDsl(res.dsl);
      setAiExplanation(res.explanation);
    } catch (err: any) {
      alert(`AI Prompt parsing error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApproveAiDsl = () => {
    if (!aiGeneratedDsl) return;
    setLogic(aiGeneratedDsl.logic || 'AND');
    setConditions(aiGeneratedDsl.conditions.map((c: any, i: number) => ({
      id: `${Date.now()}_${i}`,
      field: c.field,
      operator: c.operator,
      value: c.value
    })));
    runScreen(aiGeneratedDsl);
    setAiGeneratedDsl(null);
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: `${Date.now()}`, field: 'peRatio', operator: '<', value: 30 }
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const handleExportCsv = async () => {
    const dslToRun = {
      logic,
      conditions: conditions.map(({ field, operator, value }) => ({ field, operator, value: Number(value) || value }))
    };
    try {
      const res = await fetch('http://localhost:4000/api/screens/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dslToRun)
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'marketpulse_screener_results.csv';
      a.click();
    } catch (e) {
      console.error('Failed to export CSV:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center space-x-2">
            <Filter className="w-6 h-6 text-primary" />
            <span>VISUAL STOCK SCREENER ENGINE</span>
          </h1>
          <p className="text-xs text-muted font-mono mt-0.5">
            Query market database using validated AST DSL criteria
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-primary text-foreground font-semibold flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => runScreen()}
            className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-black font-bold flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Screen</span>
          </button>
        </div>
      </div>

      {/* Natural Language AI Prompt Box */}
      <div className="p-4 bg-surface rounded-xl border border-primary/30 font-mono space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-primary">
          <Sparkles className="w-4 h-4" />
          <span>NATURAL-LANGUAGE AI SCREENER COMPILER</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., Find tech stocks with revenue growth > 20% and RSI > 60 above 50-day moving average"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 bg-surface-elevated text-xs px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-primary text-foreground"
          />
          <button
            onClick={handleAiConvert}
            disabled={isAiLoading}
            className="px-4 py-2 bg-primary text-black font-bold text-xs rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {isAiLoading ? 'Compiling...' : 'Generate DSL'}
          </button>
        </div>

        {/* Explicit User Approval Box for Generated AI DSL */}
        {aiGeneratedDsl && (
          <div className="p-3 bg-surface-elevated rounded-lg border border-success/40 space-y-2 text-xs">
            <div className="text-success font-bold flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>AI Generated Screener DSL AST (Approval Required)</span>
            </div>
            <p className="text-muted text-[11px]">{aiExplanation}</p>
            <pre className="text-[10px] bg-background p-2 rounded border border-border text-primary font-mono">
              {JSON.stringify(aiGeneratedDsl, null, 2)}
            </pre>
            <div className="flex space-x-2">
              <button
                onClick={handleApproveAiDsl}
                className="px-3 py-1 bg-success text-black font-bold rounded text-xs"
              >
                Approve & Execute Screen
              </button>
              <button
                onClick={() => setAiGeneratedDsl(null)}
                className="px-3 py-1 bg-surface border border-border text-muted rounded text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visual Query Builder */}
      <div className="p-4 bg-surface rounded-xl border border-border space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-muted font-bold">LOGIC:</span>
            <button
              onClick={() => setLogic('AND')}
              className={`px-3 py-1 rounded text-xs font-bold ${logic === 'AND' ? 'bg-primary text-black' : 'bg-surface-elevated text-muted'}`}
            >
              AND (Match All)
            </button>
            <button
              onClick={() => setLogic('OR')}
              className={`px-3 py-1 rounded text-xs font-bold ${logic === 'OR' ? 'bg-primary text-black' : 'bg-surface-elevated text-muted'}`}
            >
              OR (Match Any)
            </button>
          </div>

          <button
            onClick={addCondition}
            className="px-3 py-1 rounded bg-surface-elevated border border-border text-xs text-foreground font-semibold flex items-center space-x-1 hover:border-primary"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Condition</span>
          </button>
        </div>

        {/* Conditions List */}
        <div className="space-y-3">
          {conditions.map((cond) => (
            <div key={cond.id} className="flex flex-wrap items-center gap-3 p-2.5 bg-surface-elevated rounded-lg border border-border text-xs">
              
              {/* Metric Selector */}
              <select
                value={cond.field}
                onChange={(e) => setConditions(conditions.map(c => c.id === cond.id ? { ...c, field: e.target.value } : c))}
                className="bg-surface text-foreground px-2.5 py-1.5 rounded border border-border focus:outline-none"
              >
                <option value="revenueGrowth">Revenue Growth (%)</option>
                <option value="rsi14">RSI (14)</option>
                <option value="peRatio">P/E Ratio</option>
                <option value="marketCap">Market Cap (USD)</option>
                <option value="currentPrice">Current Price ($)</option>
                <option value="profitMargin">Profit Margin (%)</option>
                <option value="roe">ROE (%)</option>
                <option value="debtToEquity">Debt to Equity</option>
                <option value="sector">Sector</option>
                <option value="price_gt_sma50">Price &gt; 50-day SMA</option>
              </select>

              {/* Operator Selector */}
              <select
                value={cond.operator}
                onChange={(e) => setConditions(conditions.map(c => c.id === cond.id ? { ...c, operator: e.target.value as any } : c))}
                className="bg-surface text-foreground px-2 py-1.5 rounded border border-border focus:outline-none"
              >
                <option value=">">&gt;</option>
                <option value=">=">&gt;=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
                <option value="==">==</option>
              </select>

              {/* Value Input */}
              <input
                type="text"
                value={cond.value}
                onChange={(e) => setConditions(conditions.map(c => c.id === cond.id ? { ...c, value: e.target.value } : c))}
                className="bg-surface text-foreground px-2.5 py-1.5 rounded border border-border focus:outline-none w-32 font-mono"
              />

              <button
                onClick={() => removeCondition(cond.id)}
                className="p-1.5 text-muted hover:text-danger rounded ml-auto"
                title="Remove condition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

            </div>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="p-4 bg-surface rounded-xl border border-border space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-foreground">
            SCREEN RESULTS ({results.length} STOCKS MATCHED)
          </h2>
          <span className="text-xs text-muted">Showing page 1 of 1</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-dense text-left">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company Name</th>
                <th>Sector</th>
                <th>Price</th>
                <th>Change %</th>
                <th>P/E</th>
                <th>Rev Growth</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted">Executing AST query...</td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted">No stocks matched the screening conditions. Try adjusting your parameters.</td>
                </tr>
              ) : (
                results.map((stock) => {
                  const isPos = stock.priceChangePercent >= 0;
                  return (
                    <tr key={stock.symbol} className="hover:bg-surface-elevated transition-colors">
                      <td className="font-bold text-primary">{stock.symbol}</td>
                      <td className="text-foreground">{stock.companyName}</td>
                      <td className="text-muted">{stock.sector}</td>
                      <td className="font-bold">${stock.currentPrice}</td>
                      <td className={isPos ? 'text-success' : 'text-danger'}>
                        {isPos ? '+' : ''}{stock.priceChangePercent}%
                      </td>
                      <td>{stock.peRatio}x</td>
                      <td className="text-success">+{stock.revenueGrowth}%</td>
                      <td>
                        <Link
                          href={`/stocks/${stock.symbol}`}
                          className="px-2 py-1 bg-surface-elevated hover:bg-primary/20 text-primary text-[11px] rounded font-semibold"
                        >
                          Research →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
