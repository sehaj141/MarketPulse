import { z } from 'zod';
import { db } from '../../database/db';
import { ScreenerDSL, Stock } from '../../types';

// Zod Schema for strict DSL Validation
export const ScreenerConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['>', '>=', '<', '<=', '==', '!=']),
  value: z.union([z.number(), z.string()])
});

export const ScreenerDSLSchema = z.object({
  logic: z.enum(['AND', 'OR']),
  conditions: z.array(ScreenerConditionSchema)
});

// Allowed Whitelisted Metric Fields for security
const ALLOWED_FIELDS = new Set([
  'revenueGrowth', 'peRatio', 'marketCap', 'currentPrice', 'rsi14',
  'sma20', 'sma50', 'sma200', 'profitMargin', 'roe', 'debtToEquity',
  'sector', 'exchange', 'priceChangePercent', 'price_gt_sma50', 'price_gt_sma200'
]);

export class ScreenerDslService {
  public static validateDSL(dsl: unknown): ScreenerDSL {
    const parsed = ScreenerDSLSchema.parse(dsl);
    for (const cond of parsed.conditions) {
      if (!ALLOWED_FIELDS.has(cond.field)) {
        throw new Error(`Field '${cond.field}' is not allowed in screening query DSL.`);
      }
    }
    return parsed;
  }

  public static executeScreen(dsl: ScreenerDSL): Stock[] {
    const validated = this.validateDSL(dsl);
    const allStocks = db.getAllStocks();

    return allStocks.filter(stock => {
      const technicals = db.getTechnicalIndicators(stock.symbol);

      const results = validated.conditions.map(cond => {
        let val: any;

        // Resolve metric field value
        if (cond.field === 'rsi14') val = technicals?.rsi14 ?? 50;
        else if (cond.field === 'sma20') val = technicals?.sma20 ?? stock.currentPrice;
        else if (cond.field === 'sma50') val = technicals?.sma50 ?? stock.currentPrice;
        else if (cond.field === 'sma200') val = technicals?.sma200 ?? stock.currentPrice;
        else if (cond.field === 'price_gt_sma50') val = stock.currentPrice > (technicals?.sma50 ?? 0) ? 1 : 0;
        else if (cond.field === 'price_gt_sma200') val = stock.currentPrice > (technicals?.sma200 ?? 0) ? 1 : 0;
        else val = (stock as any)[cond.field];

        return this.evaluateCondition(val, cond.operator, cond.value);
      });

      if (validated.logic === 'AND') {
        return results.every(r => r === true);
      } else {
        return results.some(r => r === true);
      }
    });
  }

  private static evaluateCondition(actualVal: any, operator: string, targetVal: any): boolean {
    if (actualVal === undefined || actualVal === null) return false;

    if (typeof targetVal === 'number' && typeof actualVal === 'number') {
      switch (operator) {
        case '>': return actualVal > targetVal;
        case '>=': return actualVal >= targetVal;
        case '<': return actualVal < targetVal;
        case '<=': return actualVal <= targetVal;
        case '==': return actualVal === targetVal;
        case '!=': return actualVal !== targetVal;
        default: return false;
      }
    }

    if (typeof targetVal === 'string' && typeof actualVal === 'string') {
      switch (operator) {
        case '==': return actualVal.toLowerCase() === targetVal.toLowerCase();
        case '!=': return actualVal.toLowerCase() !== targetVal.toLowerCase();
        default: return false;
      }
    }

    return false;
  }
}
