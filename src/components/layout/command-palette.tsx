'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Search, Filter, Bookmark, Bell, Bot, BarChart2, Shield, Moon, Sun, ArrowRight, X } from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const isOpen = useStore((state) => state.isCommandPaletteOpen);
  const setOpen = useStore((state) => state.setCommandPaletteOpen);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const theme = useStore((state) => state.theme);

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: 'stock_nvda', label: 'Search Ticker: NVDA (NVIDIA Corp)', icon: Search, action: () => { router.push('/stocks/NVDA'); setOpen(false); } },
    { id: 'stock_aapl', label: 'Search Ticker: AAPL (Apple Inc)', icon: Search, action: () => { router.push('/stocks/AAPL'); setOpen(false); } },
    { id: 'screener', label: 'Open Visual Stock Screener', icon: Filter, action: () => { router.push('/screener'); setOpen(false); } },
    { id: 'ai_terminal', label: 'Launch AI Terminal', icon: Bot, action: () => { router.push('/ai-terminal'); setOpen(false); } },
    { id: 'backtesting', label: 'Run Quantitative Backtest', icon: BarChart2, action: () => { router.push('/backtesting'); setOpen(false); } },
    { id: 'watchlists', label: 'Open Tech Titans Watchlist', icon: Bookmark, action: () => { router.push('/watchlists'); setOpen(false); } },
    { id: 'alerts', label: 'Manage Price & Technical Alerts', icon: Bell, action: () => { router.push('/alerts'); setOpen(false); } },
    { id: 'theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`, icon: theme === 'dark' ? Sun : Moon, action: () => { toggleTheme(); setOpen(false); } },
    { id: 'admin', label: 'Open Admin Observability Panel', icon: Shield, action: () => { router.push('/admin'); setOpen(false); } },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-surface-elevated">
          <Search className="w-5 h-5 text-muted mr-3" />
          <input
            type="text"
            placeholder="Type a command or search stocks... (e.g. NVDA, Screener, Backtest)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-foreground placeholder-muted focus:outline-none text-sm font-mono"
            autoFocus
          />
          <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Options List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted">No commands found matching "{query}"</div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left group"
              >
                <div className="flex items-center space-x-3">
                  <cmd.icon className="w-4 h-4 text-muted group-hover:text-primary" />
                  <span className="font-medium">{cmd.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-border bg-surface-elevated/50 flex justify-between items-center text-xs text-muted font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border border-border">ESC</kbd> to close</span>
          <span>MarketPulse Intelligence OS</span>
        </div>

      </div>
    </div>
  );
}
