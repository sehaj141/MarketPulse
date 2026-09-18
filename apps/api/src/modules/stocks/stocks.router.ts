import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const stocksRouter = Router();

// List all stocks (paginated)
stocksRouter.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string || '1');
  const limit = parseInt(req.query.limit as string || '50');
  const sector = req.query.sector as string;

  let stocks = db.getAllStocks();

  if (sector) {
    stocks = stocks.filter(s => s.sector.toLowerCase() === sector.toLowerCase());
  }

  const total = stocks.length;
  const start = (page - 1) * limit;
  const paginated = stocks.slice(start, start + limit);

  return res.json({
    data: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Search stocks
stocksRouter.get('/search', (req: Request, res: Response) => {
  const q = (req.query.q as string || '').trim();
  const results = db.searchStocks(q);
  return res.json(results);
});

// Major Market Indices
stocksRouter.get('/indices', (req: Request, res: Response) => {
  const indices = [
    { symbol: '^NIFTY', name: 'NIFTY 50', price: 23840.50, change: 142.30, changePercent: 0.60, sparkline: [23700, 23720, 23690, 23780, 23840] },
    { symbol: '^SENSEX', name: 'SENSEX', price: 78210.80, change: -120.40, changePercent: -0.15, sparkline: [78350, 78310, 78180, 78250, 78210] },
    { symbol: '^GSPC', name: 'S&P 500', price: 5620.40, change: 34.20, changePercent: 0.61, sparkline: [5580, 5590, 5605, 5610, 5620] },
    { symbol: '^IXIC', name: 'NASDAQ', price: 17680.90, change: 185.40, changePercent: 1.06, sparkline: [17490, 17520, 17590, 17620, 17680] }
  ];
  return res.json(indices);
});

// Dashboard Overview (Gainers, Losers, Sector breakdown, Market Breadth)
stocksRouter.get('/overview', (req: Request, res: Response) => {
  const stocks = db.getAllStocks();

  const sortedByChange = [...stocks].sort((a, b) => b.priceChangePercent - a.priceChangePercent);
  const gainers = sortedByChange.slice(0, 5);
  const losers = sortedByChange.slice(-5).reverse();

  const sortedByVolume = [...stocks].sort((a, b) => b.volume - a.volume);
  const mostActive = sortedByVolume.slice(0, 5);

  // Sector performance aggregation
  const sectorMap: Record<string, { totalReturn: number; count: number }> = {};
  stocks.forEach(s => {
    if (!sectorMap[s.sector]) sectorMap[s.sector] = { totalReturn: 0, count: 0 };
    sectorMap[s.sector].totalReturn += s.priceChangePercent;
    sectorMap[s.sector].count += 1;
  });

  const sectorPerformance = Object.entries(sectorMap).map(([sector, data]) => ({
    sector,
    avgChangePercent: Number((data.totalReturn / data.count).toFixed(2)),
    stockCount: data.count
  })).sort((a, b) => b.avgChangePercent - a.avgChangePercent);

  // Market breadth
  const advancing = stocks.filter(s => s.priceChangePercent > 0).length;
  const declining = stocks.filter(s => s.priceChangePercent < 0).length;
  const unchanged = stocks.length - advancing - declining;

  return res.json({
    gainers,
    losers,
    mostActive,
    sectorPerformance,
    breadth: {
      advancing,
      declining,
      unchanged,
      ratio: Number((advancing / (declining || 1)).toFixed(2))
    }
  });
});

// Stock Comparison
stocksRouter.get('/compare', (req: Request, res: Response) => {
  const symbolsRaw = req.query.symbols as string;
  if (!symbolsRaw) {
    return res.status(400).json({ error: 'Query parameter "symbols" required (e.g. ?symbols=NVDA,AMD,AVGO)' });
  }

  const symbols = symbolsRaw.split(',').map(s => s.trim().toUpperCase());
  const comparison = symbols.map(sym => {
    const stock = db.getStockBySymbol(sym);
    const tech = db.getTechnicalIndicators(sym);
    return stock ? { ...stock, technicals: tech } : null;
  }).filter(Boolean);

  return res.json(comparison);
});

// Single Stock Detail
stocksRouter.get('/:symbol', (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = db.getStockBySymbol(symbol);
  if (!stock) {
    return res.status(404).json({ error: `Stock symbol "${symbol}" not found.` });
  }

  const technicals = db.getTechnicalIndicators(symbol);
  const news = db.getStockNews(symbol);

  return res.json({
    ...stock,
    technicals,
    news
  });
});

// Stock Historical OHLCV Data
stocksRouter.get('/:symbol/history', (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();
  const history = db.getHistoricalPrices(symbol);
  return res.json(history);
});
