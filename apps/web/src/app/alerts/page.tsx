'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Bell, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [symbol, setSymbol] = useState('NVDA');
  const [metric, setMetric] = useState('currentPrice');
  const [operator, setOperator] = useState('>');
  const [threshold, setThreshold] = useState(130);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await fetchApi<any[]>('/api/alerts?userId=user_regular');
      setAlerts(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAlert = await fetchApi<any>('/api/alerts', {
        method: 'POST',
        body: JSON.stringify({ symbol, metric, operator, threshold, userId: 'user_regular' })
      });
      setAlerts([...alerts, newAlert]);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    await fetchApi(`/api/alerts/${id}`, { method: 'DELETE' });
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>EVENT-DRIVEN ALERTS ENGINE</span>
          </h1>
          <p className="text-xs text-muted">Set price and indicator thresholds evaluated via Redis & BullMQ workers</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateAlert} className="p-4 bg-surface rounded-xl border border-border space-y-4">
        <h2 className="font-bold text-sm text-foreground uppercase">Create Event Alert Rule</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-muted block mb-1">Stock Ticker</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full bg-surface-elevated text-foreground px-3 py-2 rounded border border-border"
            />
          </div>
          <div>
            <label className="text-muted block mb-1">Metric</label>
            <select value={metric} onChange={(e) => setMetric(e.target.value)} className="w-full bg-surface-elevated text-foreground px-3 py-2 rounded border border-border">
              <option value="currentPrice">Price ($)</option>
              <option value="rsi14">RSI (14)</option>
              <option value="volume">Volume</option>
            </select>
          </div>
          <div>
            <label className="text-muted block mb-1">Condition</label>
            <select value={operator} onChange={(e) => setOperator(e.target.value)} className="w-full bg-surface-elevated text-foreground px-3 py-2 rounded border border-border">
              <option value=">">Greater Than (&gt;)</option>
              <option value="<">Less Than (&lt;)</option>
            </select>
          </div>
          <div>
            <label className="text-muted block mb-1">Threshold Target</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full bg-surface-elevated text-foreground px-3 py-2 rounded border border-border"
            />
          </div>
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-black font-bold text-xs rounded hover:bg-primary-hover">
          Create Alert Rule
        </button>
      </form>

      {/* Active Rules List */}
      <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
        <h3 className="font-bold text-sm uppercase">Active Alert Rules ({alerts.length})</h3>
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-surface-elevated rounded border border-border text-xs">
              <div>
                <span className="font-bold text-primary mr-2">{a.symbol}</span>
                <span className="text-foreground">{a.metric} {a.operator} ${a.threshold}</span>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-muted hover:text-danger">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
