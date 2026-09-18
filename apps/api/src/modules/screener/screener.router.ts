import { Router, Request, Response } from 'express';
import { ScreenerDslService } from './screener-dsl.service';
import { db } from '../../database/db';
import { SavedScreen } from '../../types';

export const screenerRouter = Router();

// Run Screener DSL
screenerRouter.post('/run', (req: Request, res: Response) => {
  try {
    const dsl = req.body;
    const results = ScreenerDslService.executeScreen(dsl);
    return res.json({
      count: results.length,
      data: results
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Invalid screener DSL query structure.' });
  }
});

// Saved screens
screenerRouter.get('/saved', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_regular';
  const saved = db.getSavedScreens(userId);
  return res.json(saved);
});

screenerRouter.post('/saved', (req: Request, res: Response) => {
  const { userId, name, description, queryDsl, isPublic } = req.body;
  if (!name || !queryDsl) {
    return res.status(400).json({ error: 'Name and queryDsl are required to save screen.' });
  }

  const newScreen: SavedScreen = {
    id: `screen_${Date.now()}`,
    userId: userId || 'user_regular',
    name,
    description: description || '',
    queryDsl,
    isPublic: isPublic ?? true,
    createdAt: new Date().toISOString()
  };

  db.createSavedScreen(newScreen);
  return res.json(newScreen);
});

// CSV Export
screenerRouter.post('/export', (req: Request, res: Response) => {
  try {
    const dsl = req.body;
    const results = ScreenerDslService.executeScreen(dsl);

    const headers = 'Symbol,Company Name,Sector,Price,Change %,P/E,Rev Growth %,RSI\n';
    const rows = results.map(s => {
      const tech = db.getTechnicalIndicators(s.symbol);
      return `"${s.symbol}","${s.companyName}","${s.sector}",${s.currentPrice},${s.priceChangePercent},${s.peRatio},${s.revenueGrowth},${tech?.rsi14 ?? ''}`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=marketpulse_screen.csv');
    return res.send(headers + rows);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});
