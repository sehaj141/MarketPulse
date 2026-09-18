import { Router, Request, Response } from 'express';
import { BacktestingService } from './backtesting.service';
import { db } from '../../database/db';

export const backtestingRouter = Router();

backtestingRouter.post('/', (req: Request, res: Response) => {
  try {
    const config = req.body;
    if (!config.strategyName) {
      return res.status(400).json({ error: 'strategyName is required to run backtest.' });
    }

    const userId = (req.body.userId as string) || 'user_regular';
    const result = BacktestingService.runBacktest(config, userId);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Backtest execution failed.' });
  }
});

backtestingRouter.get('/:id', (req: Request, res: Response) => {
  const result = db.getBacktest(req.params.id);
  if (!result) {
    return res.status(404).json({ error: 'Backtest result not found.' });
  }
  return res.json(result);
});
