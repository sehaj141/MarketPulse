'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { fetchApi } from '@/lib/api';
import { Bookmark, Plus, Trash2, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

export default function WatchlistsPage() {
  const ticks = useStore((state) => state.ticks);

  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [activeWlId, setActiveWlId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stocksData, setStocksData] = useState<any[]>([]);

  useEffect(() => {
    async function loadWatchlists() {
      try {
        const res = await fetchApi<any[]>('/api/watchlists?userId=user_regular');
        setWatchlists(res);
        if (res.length > 0) setActiveWlId(res[0].id);

        const allStocks = await fetchApi<any>('/api/stocks');
        setStocksData(allStocks.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadWatchlists();
  }, []);

  const activeWl = watchlists.find(w => w.id === activeWlId);
  const activeSymbols: string[] = activeWl?.symbols || [];

  const items = activeSymbols.map(sym => {
    const stock = stocksData.find(s => s.symbol === sym) || { symbol: sym, companyName: sym, currentPrice: 100, priceChangePercent: 0 };
    const tick = ticks[sym];
    return {
      ...stock,
      currentPrice: tick ? tick.currentPrice : stock.currentPrice,
      priceChangePercent: tick ? tick.priceChangePercent : stock.priceChangePercent
    };
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-primary" />
            <span>CUSTOM WATCHLISTS</span>
          </h1>
          <p className="text-xs text-muted">Organize and monitor stock streams in real-time</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-border pb-2 text-xs">
        {watchlists.map(w => (
          <button
            key={w.id}
            onClick={() => setActiveWlId(w.id)}
            className={`px-3 py-1.5 rounded-md font-semibold ${activeWlId === w.id ? 'bg-primary text-black' : 'bg-surface-elevated text-muted'}`}
          >
            {w.name}
          </button>
        ))}
      </div>

      <div className="p-4 bg-surface rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full table-dense text-left">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company Name</th>
                <th>Price</th>
                <th>Change %</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isPos = item.priceChangePercent >= 0;
                return (
                  <tr key={item.symbol} className="hover:bg-surface-elevated">
                    <td className="font-bold text-primary">{item.symbol}</td>
                    <td className="text-foreground">{item.companyName}</td>
                    <td className="font-bold">${item.currentPrice}</td>
                    <td className={isPos ? 'text-success' : 'text-danger'}>
                      {isPos ? '+' : ''}{item.priceChangePercent}%
                    </td>
                    <td>
                      <Link href={`/stocks/${item.symbol}`} className="text-primary hover:underline text-xs flex items-center space-x-1">
                        <span>Research</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
