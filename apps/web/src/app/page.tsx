'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Bot, BarChart2, Bell, Shield, Terminal, Zap, CheckCircle2, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      
      {/* Top Marketing Navigation Header */}
      <header className="h-16 border-b border-border/80 px-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center font-extrabold text-black text-sm">
            M
          </div>
          <span className="font-extrabold text-lg tracking-wider font-mono">
            MARKET<span className="text-primary">PULSE</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono text-muted">
          <a href="#features" className="hover:text-foreground transition-colors">CAPABILITIES</a>
          <a href="#screener" className="hover:text-foreground transition-colors">DSL SCREENER</a>
          <a href="#ai" className="hover:text-foreground transition-colors">AI TERMINAL</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">ARCHITECTURE</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-black font-semibold text-xs tracking-wide transition-colors flex items-center space-x-1.5"
          >
            <span>Explore MarketPulse</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-mono text-primary mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>PRODUCTION-GRADE SaaS FINANCIAL OS v1.0</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          MARKET INTELLIGENCE, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-500">
            WITHOUT THE NOISE.
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto font-light leading-relaxed">
          "Turn market data into decisions." Screen stocks with a validated query DSL, execute quantitative backtests, and converse with an AI terminal built for institutional-grade research.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-black font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
          >
            <span>Launch Research Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface border border-border hover:border-primary text-foreground font-semibold text-sm tracking-wide transition-all flex items-center justify-center space-x-2 font-mono"
          >
            <Terminal className="w-4 h-4 text-primary" />
            <span>OpenAPI Docs</span>
          </a>
        </div>

        {/* Live Interactive Application UI Preview Widget Mockup */}
        <div className="mt-14 relative rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden text-left font-mono">
          <div className="h-10 border-b border-border bg-surface-elevated px-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <span className="text-xs text-muted ml-2">marketpulse://dashboard/workstation</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>Simulated Market Stream</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Widget 1: Ticker Quote */}
            <div className="bg-surface-elevated p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between text-xs text-muted mb-2">
                <span className="font-bold text-foreground">NVDA · NVIDIA Corp</span>
                <span className="text-success">+2.45%</span>
              </div>
              <div className="text-2xl font-bold text-foreground">$124.50</div>
              <div className="text-[11px] text-muted mt-2">RSI: 64.2 | 50-day SMA: $118.20</div>
            </div>

            {/* Widget 2: Query DSL Preview */}
            <div className="bg-surface-elevated p-4 rounded-xl border border-border">
              <div className="text-xs text-muted mb-1 flex items-center justify-between">
                <span>SCREENER DSL AST</span>
                <span className="text-primary text-[10px]">VALIDATED</span>
              </div>
              <pre className="text-[11px] text-primary/90 overflow-x-auto">
{`{
  "logic": "AND",
  "conditions": [
    { "field": "revenueGrowth", "op": ">", "val": 20 },
    { "field": "rsi14", "op": ">", "val": 60 }
  ]
}`}
              </pre>
            </div>

            {/* Widget 3: Quant Backtest Equity Curve */}
            <div className="bg-surface-elevated p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between text-xs text-muted mb-2">
                <span>QUANT BACKTEST</span>
                <span className="text-success font-bold">+34.8% CAGR</span>
              </div>
              <div className="h-16 flex items-end space-x-1.5 pt-2">
                <div className="flex-1 bg-primary/30 h-4 rounded-t" />
                <div className="flex-1 bg-primary/40 h-7 rounded-t" />
                <div className="flex-1 bg-primary/60 h-10 rounded-t" />
                <div className="flex-1 bg-primary/80 h-12 rounded-t" />
                <div className="flex-1 bg-primary h-16 rounded-t" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Capabilities Section */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">ENGINEERED FOR DATA DENSITY</h2>
          <p className="text-muted text-sm mt-2">Everything you need for serious market analysis in one software suite.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-border hover:border-primary/50 transition-all">
            <Filter className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-foreground text-base">Visual Query DSL Screener</h3>
            <p className="text-xs text-muted mt-2 leading-relaxed">Build complex filters with AND/OR nested condition logic. Enforces strict AST schemas with zero raw SQL injection vector.</p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border hover:border-primary/50 transition-all">
            <Bot className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-foreground text-base">AI Terminal & Tool Caller</h3>
            <p className="text-xs text-muted mt-2 leading-relaxed">Converse with an AI Orchestrator that selects backend tools to screen stocks, compare metrics, and render interactive dynamic visualizations.</p>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border hover:border-primary/50 transition-all">
            <BarChart2 className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-foreground text-base">Quantitative Backtest Engine</h3>
            <p className="text-xs text-muted mt-2 leading-relaxed">Simulate strategies over historical daily OHLCV data with zero look-ahead bias, accounting for transaction costs and drawdown metrics.</p>
          </div>
        </div>
      </section>

      {/* Technical Architecture Overview */}
      <section id="architecture" className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <div className="p-8 rounded-2xl bg-surface border border-border">
          <div className="flex items-center space-x-3 mb-6">
            <Cpu className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold font-mono text-foreground">SYSTEM DESIGN & TECH STACK</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 bg-surface-elevated rounded border border-border">
              <span className="text-muted block">FRONTEND</span>
              <span className="text-foreground font-semibold">Next.js 14 App Router</span>
            </div>
            <div className="p-3 bg-surface-elevated rounded border border-border">
              <span className="text-muted block">BACKEND</span>
              <span className="text-foreground font-semibold">NestJS / Express</span>
            </div>
            <div className="p-3 bg-surface-elevated rounded border border-border">
              <span className="text-muted block">REAL-TIME</span>
              <span className="text-foreground font-semibold">Redis & WebSockets</span>
            </div>
            <div className="p-3 bg-surface-elevated rounded border border-border">
              <span className="text-muted block">JOBS QUEUE</span>
              <span className="text-foreground font-semibold">BullMQ Workers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center font-mono text-xs text-muted">
        <p>MarketPulse Financial Intelligence Platform © 2026</p>
        <p className="text-[11px] mt-1 text-muted/70">
          MarketPulse is an independent portfolio project and is not affiliated with any financial platform.
        </p>
      </footer>

    </div>
  );
}
