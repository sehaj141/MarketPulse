'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Shield, Cpu, Activity, Database, Server, Terminal, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [metrics, setMetrics] = useState<any | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetchApi<any>('/api/admin/metrics');
        setMetrics(res);
      } catch (e) {
        console.error(e);
      }
    }
    loadMetrics();
    const timer = setInterval(loadMetrics, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!metrics) return <div className="p-8 text-center font-mono text-muted">Fetching admin observability metrics...</div>;

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>ADMIN OBSERVABILITY & HEALTH PANEL</span>
          </h1>
          <p className="text-xs text-muted">System metrics, request latency, worker queue status, database telemetry</p>
        </div>

        <a
          href="http://localhost:4000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded bg-primary text-black font-bold text-xs flex items-center space-x-1.5"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Swagger API Docs</span>
        </a>
      </div>

      {/* Infrastructure Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">ACTIVE USERS</span>
          <span className="text-2xl font-bold text-foreground mt-1 block">{metrics.performance.activeUsers}</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">API REQUESTS</span>
          <span className="text-2xl font-bold text-primary mt-1 block">{metrics.performance.apiRequestsTotal}</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">WEBSOCKET CONNS</span>
          <span className="text-2xl font-bold text-success mt-1 block">{metrics.performance.activeWebSockets}</span>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-border">
          <span className="text-xs text-muted block">AVG API LATENCY</span>
          <span className="text-2xl font-bold text-foreground mt-1 block">{metrics.performance.avgResponseTimeMs} ms</span>
        </div>
      </div>

      {/* Services Health Status Table */}
      <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
        <h2 className="font-bold text-sm uppercase">Distributed Infrastructure Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 bg-surface-elevated rounded-lg border border-border space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">{metrics.services.database.name}</span>
              <span className="text-success font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{metrics.services.database.status}</span>
              </span>
            </div>
            <p className="text-muted text-[11px]">Latency: {metrics.services.database.latencyMs} ms | Indexed Equities: {metrics.data.totalStocksIndexed}</p>
          </div>

          <div className="p-4 bg-surface-elevated rounded-lg border border-border space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">{metrics.services.redis.name}</span>
              <span className="text-success font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{metrics.services.redis.status}</span>
              </span>
            </div>
            <p className="text-muted text-[11px]">Latency: {metrics.services.redis.latencyMs} ms | Pub/Sub Channels: Active</p>
          </div>

          <div className="p-4 bg-surface-elevated rounded-lg border border-border space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">{metrics.services.bullmq.name}</span>
              <span className="text-success font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{metrics.services.bullmq.status}</span>
              </span>
            </div>
            <p className="text-muted text-[11px]">Jobs Processed: {metrics.services.bullmq.jobsProcessed} | Failed: {metrics.services.bullmq.jobsFailed}</p>
          </div>

          <div className="p-4 bg-surface-elevated rounded-lg border border-border space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">{metrics.services.marketStream.name}</span>
              <span className="text-success font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{metrics.services.marketStream.status}</span>
              </span>
            </div>
            <p className="text-muted text-[11px]">Interval: {metrics.services.marketStream.intervalMs} ms | Broadcasting Ticks over WebSocket</p>
          </div>

        </div>
      </div>
    </div>
  );
}
