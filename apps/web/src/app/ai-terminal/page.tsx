'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Bot, Send, Terminal, Wrench, CheckCircle, BarChart2, Filter, Search, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  toolCalls?: any[];
  timestamp: string;
}

export default function AITerminalPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'MarketPulse AI Terminal v1.0 connected. How can I assist your market research today? (Try typing: "Compare NVDA and AMD" or "Find high growth tech stocks")',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWorkspaceData, setActiveWorkspaceData] = useState<any | null>(null);

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: inputPrompt,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptToSubmit = inputPrompt;
    setInputPrompt('');
    setIsProcessing(true);

    try {
      const response = await fetchApi<any>('/api/ai/query', {
        method: 'POST',
        body: JSON.stringify({ prompt: promptToSubmit })
      });

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: response.text,
        toolCalls: response.toolCalls,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (response.toolCalls && response.toolCalls.length > 0) {
        setActiveWorkspaceData(response.toolCalls[0]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'ai',
          text: `Error processing query: ${err.message}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-primary" />
          <h1 className="font-bold text-base text-foreground">AI TERMINAL & TOOL ORCHESTRATOR WORKSPACE</h1>
        </div>
        <span className="text-xs text-success flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Ollama / Local LLM Active</span>
        </span>
      </div>

      {/* 3-Pane Workstation Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left Pane: Chat Conversation History (5 cols) */}
        <div className="lg:col-span-4 bg-surface rounded-xl border border-border flex flex-col justify-between overflow-hidden">
          <div className="p-3 border-b border-border text-xs text-muted font-bold flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span>CONVERSATION STREAM</span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-primary/10 border border-primary/30 text-foreground ml-4'
                    : 'bg-surface-elevated border border-border text-foreground mr-4'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-muted mb-1 font-bold">
                  <span>{m.sender === 'user' ? 'YOU' : 'AI ORCHESTRATOR'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="font-sans text-xs">{m.text}</p>
                {m.toolCalls && m.toolCalls.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/50 text-[10px] text-primary">
                    ⚡ Executed tool: {m.toolCalls[0].tool}()
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="p-3 bg-surface-elevated rounded-lg text-xs text-primary animate-pulse">
                Thinking & orchestrating backend tool call...
              </div>
            )}
          </div>

          <form onSubmit={handleSendPrompt} className="p-3 border-t border-border bg-surface-elevated flex gap-2">
            <input
              type="text"
              placeholder="Ask AI to screen, compare, or backtest..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-surface text-xs px-3 py-2 rounded border border-border focus:outline-none focus:border-primary text-foreground"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="p-2 bg-primary text-black rounded font-bold hover:bg-primary-hover disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Center Pane: Dynamic Interactive Workspace (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-border flex flex-col overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2 text-xs font-bold text-foreground">
            <span>DYNAMIC EXECUTION WORKSPACE</span>
            <span className="text-primary text-[10px]">TOOL OUTPUT</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {!activeWorkspaceData ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted">
                <Wrench className="w-10 h-10 text-border mb-3" />
                <p className="text-xs">No active tool output loaded. Ask the AI to compare tickers, screen stocks, or run a backtest.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-surface-elevated rounded border border-border">
                  <span className="text-[10px] text-muted block uppercase">Active Tool Execution</span>
                  <span className="text-sm font-bold text-primary">{activeWorkspaceData.tool}()</span>
                </div>

                {/* Render Tool Results Data */}
                {activeWorkspaceData.tool === 'compareStocks' && (
                  <div className="space-y-2">
                    <span className="font-bold text-foreground">Multi-Stock Performance Comparison</span>
                    <div className="overflow-x-auto">
                      <table className="w-full table-dense text-left">
                        <thead>
                          <tr>
                            <th>Symbol</th>
                            <th>Price</th>
                            <th>Rev Growth</th>
                            <th>P/E</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeWorkspaceData.result.map((s: any) => (
                            <tr key={s.symbol}>
                              <td className="font-bold text-primary">{s.symbol}</td>
                              <td>${s.currentPrice}</td>
                              <td className="text-success">+{s.revenueGrowth}%</td>
                              <td>{s.peRatio}x</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeWorkspaceData.tool === 'getStockQuote' && (
                  <div className="p-4 bg-surface-elevated rounded border border-border space-y-2">
                    <div className="flex justify-between font-bold text-foreground">
                      <span>{activeWorkspaceData.result.stock.companyName}</span>
                      <span className="text-primary">${activeWorkspaceData.result.stock.currentPrice}</span>
                    </div>
                    <p className="text-[11px] text-muted">
                      Sector: {activeWorkspaceData.result.stock.sector} | RSI: {activeWorkspaceData.result.technicals?.rsi14} | SMA 50: ${activeWorkspaceData.result.technicals?.sma50}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Tool Execution Schema & Actions (3 cols) */}
        <div className="lg:col-span-3 bg-surface rounded-xl border border-border p-3 flex flex-col space-y-3 font-mono text-xs">
          <div className="font-bold text-foreground border-b border-border pb-2">TOOL REGISTRY</div>
          <div className="space-y-2 text-[11px] text-muted">
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <span className="text-primary font-bold block">searchStocks()</span>
              <span>Ticker/company search</span>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <span className="text-primary font-bold block">runScreener()</span>
              <span>Executes AST Query DSL</span>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <span className="text-primary font-bold block">compareStocks()</span>
              <span>Multi-ticker comparison</span>
            </div>
            <div className="p-2 rounded bg-surface-elevated border border-border">
              <span className="text-primary font-bold block">runBacktest()</span>
              <span>Quant strategy engine</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
