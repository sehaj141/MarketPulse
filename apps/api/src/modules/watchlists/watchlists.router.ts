import { Router, Request, Response } from 'express';
import { db } from '../../database/db';
import { Watchlist } from '../../types';

export const watchlistsRouter = Router();

watchlistsRouter.get('/', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_regular';
  const list = db.getUserWatchlists(userId);
  return res.json(list);
});

watchlistsRouter.post('/', (req: Request, res: Response) => {
  const { name, symbols, userId } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Watchlist name is required.' });
  }

  const newWl: Watchlist = {
    id: `wl_${Date.now()}`,
    userId: userId || 'user_regular',
    name,
    isDefault: false,
    symbols: Array.isArray(symbols) ? symbols : [],
    createdAt: new Date().toISOString()
  };

  db.createWatchlist(newWl);
  return res.json(newWl);
});

watchlistsRouter.patch('/:id', (req: Request, res: Response) => {
  const { symbols } = req.body;
  if (!Array.isArray(symbols)) {
    return res.status(400).json({ error: 'Array of symbols is required.' });
  }

  const updated = db.updateWatchlist(req.params.id, symbols);
  if (!updated) {
    return res.status(404).json({ error: 'Watchlist not found.' });
  }
  return res.json(updated);
});

watchlistsRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = db.deleteWatchlist(req.params.id);
  return res.json({ success: deleted });
});
