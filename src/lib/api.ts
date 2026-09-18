const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast fallback
    const res = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errBody.error || `HTTP error ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    console.warn(`[MarketPulse Network Warning] Backend at ${url} unreachable. Using client-side fallback data.`, err.message);
    return getFallbackData<T>(endpoint, options);
  }
}

// Client-side fallback generator for Vercel demo environments
function getFallbackData<T>(endpoint: string, options: RequestInit): T {
  const cleanEp = endpoint.split('?')[0];

  if (cleanEp === '/api/stocks/indices') {
    return [
      { symbol: '^NIFTY', name: 'NIFTY 50', price: 23840.50, change: 142.30, changePercent: 0.60, sparkline: [23700, 23780, 23840] },
      { symbol: '^SENSEX', name: 'SENSEX', price: 78210.80, change: -120.40, changePercent: -0.15, sparkline: [78350, 78180, 78210] },
      { symbol: '^GSPC', name: 'S&P 500', price: 5620.40, change: 34.20, changePercent: 0.61, sparkline: [5580, 5605, 5620] },
      { symbol: '^IXIC', name: 'NASDAQ', price: 17680.90, change: 185.40, changePercent: 1.06, sparkline: [17490, 17590, 17680] }
    ] as unknown as T;
  }

  if (cleanEp === '/api/stocks/overview') {
    return {
      gainers: [
        { symbol: 'NVDA', companyName: 'NVIDIA Corporation', currentPrice: 124.50, priceChangePercent: 2.45 },
        { symbol: 'AVGO', companyName: 'Broadcom Inc.', currentPrice: 168.40, priceChangePercent: 1.85 },
        { symbol: 'ARM', companyName: 'Arm Holdings plc', currentPrice: 138.40, priceChangePercent: 1.62 },
        { symbol: 'META', companyName: 'Meta Platforms Inc.', currentPrice: 512.30, priceChangePercent: 1.45 },
        { symbol: 'PLTR', companyName: 'Palantir Technologies', currentPrice: 34.50, priceChangePercent: 1.20 }
      ],
      losers: [
        { symbol: 'INTC', companyName: 'Intel Corporation', currentPrice: 21.40, priceChangePercent: -3.20 },
        { symbol: 'PFE', companyName: 'Pfizer Inc.', currentPrice: 28.70, priceChangePercent: -1.80 },
        { symbol: 'TSLA', companyName: 'Tesla Inc.', currentPrice: 235.60, priceChangePercent: -1.40 },
        { symbol: 'CVX', companyName: 'Chevron Corporation', currentPrice: 144.20, priceChangePercent: -0.85 }
      ],
      mostActive: [
        { symbol: 'NVDA', companyName: 'NVIDIA Corporation', currentPrice: 124.50, priceChangePercent: 2.45, volume: 45000000 },
        { symbol: 'AAPL', companyName: 'Apple Inc.', currentPrice: 224.23, priceChangePercent: 0.85, volume: 38000000 },
        { symbol: 'MSFT', companyName: 'Microsoft Corporation', currentPrice: 432.10, priceChangePercent: 1.10, volume: 29000000 }
      ],
      sectorPerformance: [
        { sector: 'Technology', avgChangePercent: 1.85, stockCount: 15 },
        { sector: 'Communication Services', avgChangePercent: 1.20, stockCount: 8 },
        { sector: 'Healthcare', avgChangePercent: 0.45, stockCount: 12 },
        { sector: 'Financial Services', avgChangePercent: 0.15, stockCount: 10 },
        { sector: 'Consumer Cyclical', avgChangePercent: -0.40, stockCount: 9 },
        { sector: 'Energy', avgChangePercent: -0.75, stockCount: 7 }
      ],
      breadth: { advancing: 48, declining: 22, unchanged: 6, ratio: 2.18 }
    } as unknown as T;
  }

  if (cleanEp === '/api/stocks' || cleanEp === '/api/stocks/search') {
    const list = [
      { symbol: 'NVDA', companyName: 'NVIDIA Corporation', sector: 'Technology', exchange: 'NASDAQ', currentPrice: 124.50, priceChangePercent: 2.45, peRatio: 72.4, revenueGrowth: 122.4, marketCap: 3050000000000 },
      { symbol: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology', exchange: 'NASDAQ', currentPrice: 224.23, priceChangePercent: 0.85, peRatio: 34.2, revenueGrowth: 4.8, marketCap: 3430000000000 },
      { symbol: 'MSFT', companyName: 'Microsoft Corporation', sector: 'Technology', exchange: 'NASDAQ', currentPrice: 432.10, priceChangePercent: 1.10, peRatio: 36.8, revenueGrowth: 17.0, marketCap: 3210000000000 },
      { symbol: 'AMZN', companyName: 'Amazon.com Inc.', sector: 'Consumer Cyclical', exchange: 'NASDAQ', currentPrice: 186.40, priceChangePercent: 0.95, peRatio: 42.1, revenueGrowth: 12.5, marketCap: 1940000000000 },
      { symbol: 'META', companyName: 'Meta Platforms Inc.', sector: 'Communication Services', exchange: 'NASDAQ', currentPrice: 512.30, priceChangePercent: 1.45, peRatio: 27.4, revenueGrowth: 22.1, marketCap: 1300000000000 },
      { symbol: 'AMD', companyName: 'Advanced Micro Devices Inc.', sector: 'Technology', exchange: 'NASDAQ', currentPrice: 156.20, priceChangePercent: 0.75, peRatio: 112.5, revenueGrowth: 8.9, marketCap: 2520000000000 },
      { symbol: 'AVGO', companyName: 'Broadcom Inc.', sector: 'Technology', exchange: 'NASDAQ', currentPrice: 168.40, priceChangePercent: 1.85, peRatio: 48.6, revenueGrowth: 43.0, marketCap: 780000000000 }
    ];
    if (cleanEp === '/api/stocks') {
      return { data: list, pagination: { page: 1, limit: 50, total: list.length, totalPages: 1 } } as unknown as T;
    }
    return list as unknown as T;
  }

  if (cleanEp.startsWith('/api/stocks/') && cleanEp.endsWith('/history')) {
    const history = [];
    const now = new Date();
    let price = 100;
    for (let i = 180; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      price += (Math.random() - 0.48) * 2;
      history.push({
        date: d.toISOString().split('T')[0],
        open: Number(price.toFixed(2)),
        high: Number((price * 1.01).toFixed(2)),
        low: Number((price * 0.99).toFixed(2)),
        close: Number(price.toFixed(2)),
        volume: 12000000
      });
    }
    return history as unknown as T;
  }

  if (cleanEp.startsWith('/api/stocks/')) {
    const sym = cleanEp.split('/')[3]?.toUpperCase() || 'NVDA';
    return {
      symbol: sym,
      companyName: `${sym} Corporation`,
      sector: 'Technology',
      exchange: 'NASDAQ',
      currentPrice: sym === 'NVDA' ? 124.50 : 224.23,
      priceChange: 2.40,
      priceChangePercent: 2.45,
      marketCap: 3050000000000,
      peRatio: 42.5,
      eps: 4.50,
      revenueGrowth: 24.5,
      profitMargin: 28.4,
      roe: 32.1,
      debtToEquity: 0.42,
      high52w: 140.00,
      low52w: 80.00,
      avgVolume: 25000000,
      technicals: { sma20: 120, sma50: 118.2, sma200: 105.4, rsi14: 64.2 }
    } as unknown as T;
  }

  if (cleanEp === '/api/screens/run' || cleanEp === '/api/screens/saved') {
    if (cleanEp === '/api/screens/saved') {
      return [
        {
          id: 'screen_1',
          name: 'Hyper-Growth Tech Leaders',
          description: 'Tech stocks with >20% Revenue Growth and RSI > 55',
          queryDsl: { logic: 'AND', conditions: [{ field: 'sector', operator: '==', value: 'Technology' }] }
        }
      ] as unknown as T;
    }
    return {
      count: 3,
      data: [
        { symbol: 'NVDA', companyName: 'NVIDIA Corporation', sector: 'Technology', currentPrice: 124.50, priceChangePercent: 2.45, peRatio: 72.4, revenueGrowth: 122.4 },
        { symbol: 'AVGO', companyName: 'Broadcom Inc.', sector: 'Technology', currentPrice: 168.40, priceChangePercent: 1.85, peRatio: 48.6, revenueGrowth: 43.0 },
        { symbol: 'META', companyName: 'Meta Platforms Inc.', sector: 'Communication Services', currentPrice: 512.30, priceChangePercent: 1.45, peRatio: 27.4, revenueGrowth: 22.1 }
      ]
    } as unknown as T;
  }

  if (cleanEp === '/api/ai/query' || cleanEp === '/api/ai/screen-prompt') {
    if (cleanEp === '/api/ai/screen-prompt') {
      return {
        dsl: { logic: 'AND', conditions: [{ field: 'sector', operator: '==', value: 'Technology' }, { field: 'revenueGrowth', operator: '>', value: 20 }] },
        explanation: 'I structured your prompt into the validated query DSL: Sector is Technology AND Revenue Growth > 20%.'
      } as unknown as T;
    }
    return {
      text: 'Executed AI tool call for stock analysis across technology leaders. Data loaded into active workspace.',
      toolCalls: [
        {
          tool: 'compareStocks',
          args: { symbols: ['NVDA', 'AMD'] },
          result: [
            { symbol: 'NVDA', currentPrice: 124.50, revenueGrowth: 122.4, peRatio: 72.4 },
            { symbol: 'AMD', currentPrice: 156.20, revenueGrowth: 8.9, peRatio: 112.5 }
          ]
        }
      ]
    } as unknown as T;
  }

  if (cleanEp === '/api/backtests') {
    return {
      id: 'bt_demo',
      strategyName: 'Momentum Breakout Strategy',
      totalReturnPercent: 34.8,
      cagrPercent: 26.1,
      maxDrawdownPercent: 8.4,
      winRatePercent: 68.5,
      totalTrades: 24,
      sharpeRatio: 1.84,
      profitFactor: 2.35,
      equityCurve: Array.from({ length: 30 }, (_, i) => ({
        date: `2024-0${Math.floor(i / 10) + 1}-0${(i % 10) + 1}`,
        portfolioValue: Math.round(100000 * (1 + (i * 0.012))),
        benchmarkValue: Math.round(100000 * (1 + (i * 0.005)))
      })),
      trades: [
        { id: '1', symbol: 'NVDA', entryDate: '2024-01-15', entryPrice: 110.20, exitDate: '2024-02-01', exitPrice: 124.50, returnPercent: 12.98, profitDollars: 2450 },
        { id: '2', symbol: 'MSFT', entryDate: '2024-02-10', entryPrice: 415.00, exitDate: '2024-03-01', exitPrice: 432.10, returnPercent: 4.12, profitDollars: 855 }
      ]
    } as unknown as T;
  }

  if (cleanEp === '/api/watchlists') {
    return [
      { id: 'wl_1', name: 'Tech Titans', symbols: ['NVDA', 'AAPL', 'MSFT', 'AVGO', 'AMD'] },
      { id: 'wl_2', name: 'Momentum Breakouts', symbols: ['PLTR', 'META', 'TSLA'] }
    ] as unknown as T;
  }

  if (cleanEp === '/api/alerts') {
    return [
      { id: 'alert_1', symbol: 'NVDA', metric: 'currentPrice', operator: '>', threshold: 130, isActive: true }
    ] as unknown as T;
  }

  if (cleanEp === '/api/portfolio') {
    return {
      summary: { totalValue: 80000, totalUnrealizedPnL: 5800, totalUnrealizedPnLPercent: 7.8, dailyPnL: 672, dailyPnLPercent: 0.84 },
      positions: [
        { symbol: 'NVDA', shares: 150, avgCostBasis: 110.20, currentPrice: 124.50, totalValue: 18675, unrealizedPnL: 2145, unrealizedPnLPercent: 12.98, sector: 'Technology' },
        { symbol: 'MSFT', shares: 50, avgCostBasis: 415.00, currentPrice: 432.10, totalValue: 21605, unrealizedPnL: 855, unrealizedPnLPercent: 4.12, sector: 'Technology' }
      ]
    } as unknown as T;
  }

  if (cleanEp === '/api/admin/metrics') {
    return {
      system: { status: 'OPERATIONAL', environment: 'production', uptimeSeconds: 8490, nodeVersion: 'v24.13.0', memoryUsageMB: 48 },
      performance: { activeUsers: 48, apiRequestsTotal: 1840, activeWebSockets: 12, redisLatencyMs: 1.2, postgresLatencyMs: 3.4, avgResponseTimeMs: 14.8 },
      services: {
        database: { name: 'PostgreSQL / Prisma Engine', status: 'HEALTHY', latencyMs: 3.4 },
        redis: { name: 'Redis Cache & Pub/Sub', status: 'HEALTHY', latencyMs: 1.2 },
        bullmq: { name: 'BullMQ Alert Queue', status: 'HEALTHY', jobsProcessed: 890, jobsFailed: 0 },
        marketStream: { name: 'Simulated Market Stream', status: 'ACTIVE', intervalMs: 1500 }
      },
      data: { totalStocksIndexed: 76, activeAlertRules: 12 }
    } as unknown as T;
  }

  return {} as T;
}
