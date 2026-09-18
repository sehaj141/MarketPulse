import { ScreenerDslService } from '../modules/screener/screener-dsl.service';
import { db } from '../database/db';

describe('Screener DSL Engine Unit Tests', () => {
  beforeAll(() => {
    db.seed();
  });

  test('Validates and executes AND logic correctly', () => {
    const dsl = {
      logic: 'AND' as const,
      conditions: [
        { field: 'sector', operator: '==' as const, value: 'Technology' },
        { field: 'revenueGrowth', operator: '>' as const, value: 20 }
      ]
    };

    const results = ScreenerDslService.executeScreen(dsl);
    expect(Array.isArray(results)).toBe(true);
    results.forEach(stock => {
      expect(stock.sector.toLowerCase()).toBe('technology');
      expect(stock.revenueGrowth).toBeGreaterThan(20);
    });
  });

  test('Rejects non-whitelisted fields for security', () => {
    const maliciousDsl = {
      logic: 'AND' as const,
      conditions: [
        { field: 'DROP TABLE stocks; --', operator: '==' as const, value: 'test' }
      ]
    };

    expect(() => ScreenerDslService.validateDSL(maliciousDsl)).toThrow();
  });
});
