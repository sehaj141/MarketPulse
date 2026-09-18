import { Router, Request, Response } from 'express';
import { db } from '../../database/db';

export const portfolioRouter = Router();

portfolioRouter.get('/', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_regular';
  const positions = db.getUserPortfolio(userId);

  // Compute overall portfolio metrics
  let totalValue = 0;
  let totalUnrealizedPnL = 0;

  const enrichedPositions = positions.map(pos => {
    const stock = db.getStockBySymbol(pos.symbol);
    const currentPrice = stock ? stock.currentPrice : pos.currentPrice;
    const value = pos.shares * currentPrice;
    const cost = pos.shares * pos.avgCostBasis;
    const pnl = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

    totalValue += value;
    totalUnrealizedPnL += pnl;

    return {
      ...pos,
      currentPrice,
      totalValue: Number(value.toFixed(2)),
      unrealizedPnL: Number(pnl.toFixed(2)),
      unrealizedPnLPercent: Number(pnlPct.toFixed(2))
    };
  });

  // Sector distribution breakdown
  const sectorMap: Record<string, number> = {};
  enrichedPositions.forEach(p => {
    sectorMap[p.sector] = (sectorMap[p.sector] || 0) + p.totalValue;
  });

  const sectorAllocation = Object.entries(sectorMap).map(([sector, val]) => ({
    sector,
    value: Number(val.toFixed(2)),
    percentage: totalValue > 0 ? Number(((val / totalValue) * 100).toFixed(2)) : 0
  }));

  return res.json({
    summary: {
      totalValue: Number(totalValue.toFixed(2)),
      totalUnrealizedPnL: Number(totalUnrealizedPnL.toFixed(2)),
      totalUnrealizedPnLPercent: totalValue > 0 ? Number(((totalUnrealizedPnL / (totalValue - totalUnrealizedPnL)) * 100).toFixed(2)) : 0,
      dailyPnL: Number((totalValue * 0.0084).toFixed(2)),
      dailyPnLPercent: 0.84
    },
    positions: enrichedPositions,
    sectorAllocation
  });
});
