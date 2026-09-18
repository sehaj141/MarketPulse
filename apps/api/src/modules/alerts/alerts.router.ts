import { Router, Request, Response } from 'express';
import { db } from '../../database/db';
import { AlertRule } from '../../types';

export const alertsRouter = Router();

alertsRouter.get('/', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_regular';
  const list = db.getUserAlerts(userId);
  return res.json(list);
});

alertsRouter.post('/', (req: Request, res: Response) => {
  const { symbol, metric, operator, threshold, userId } = req.body;
  if (!symbol || !metric || !operator || threshold === undefined) {
    return res.status(400).json({ error: 'symbol, metric, operator, and threshold are required.' });
  }

  const newAlert: AlertRule = {
    id: `alert_${Date.now()}`,
    userId: userId || 'user_regular',
    symbol: symbol.toUpperCase(),
    metric,
    operator,
    threshold: Number(threshold),
    isActive: true,
    triggeredCount: 0,
    createdAt: new Date().toISOString()
  };

  db.createAlert(newAlert);
  return res.json(newAlert);
});

alertsRouter.patch('/:id/toggle', (req: Request, res: Response) => {
  const updated = db.toggleAlert(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Alert rule not found.' });
  }
  return res.json(updated);
});

alertsRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = db.deleteAlert(req.params.id);
  return res.json({ success: deleted });
});

alertsRouter.get('/notifications', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_regular';
  const list = db.getUserNotifications(userId);
  return res.json(list);
});

alertsRouter.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_regular';
  db.markNotificationAsRead(userId, req.params.id);
  return res.json({ success: true });
});
