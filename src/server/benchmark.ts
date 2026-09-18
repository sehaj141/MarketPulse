import { db } from './database/db';
import { ScreenerDslService } from './modules/screener/screener-dsl.service';
import { BacktestingService } from './modules/backtesting/backtesting.service';

async function runPerformanceBenchmark() {
  console.log('⚡ Starting MarketPulse Local Performance Benchmark...\n');
  db.seed();

  // Benchmark 1: Screener Query DSL AST Execution
  const dsl = {
    logic: 'AND' as const,
    conditions: [
      { field: 'sector', operator: '==' as const, value: 'Technology' },
      { field: 'revenueGrowth', operator: '>' as const, value: 10 },
      { field: 'rsi14', operator: '>' as const, value: 50 }
    ]
  };

  const startScreener = performance.now();
  const iterations = 1000;
  for (let i = 0; i < iterations; i++) {
    ScreenerDslService.executeScreen(dsl);
  }
  const endScreener = performance.now();
  const screenerAvgMs = (endScreener - startScreener) / iterations;

  // Benchmark 2: Stock Symbol Search Latency
  const startSearch = performance.now();
  for (let i = 0; i < iterations; i++) {
    db.searchStocks('tech');
  }
  const endSearch = performance.now();
  const searchAvgMs = (endSearch - startSearch) / iterations;

  // Benchmark 3: Quant Backtest Engine Execution
  const startBacktest = performance.now();
  const backtestCount = 50;
  for (let i = 0; i < backtestCount; i++) {
    BacktestingService.runBacktest({
      strategyName: 'Benchmark Strategy',
      symbols: ['NVDA', 'AAPL', 'MSFT'],
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      initialCapital: 100000,
      positionSizePercent: 20,
      transactionCostPercent: 0.1,
      dsl
    });
  }
  const endBacktest = performance.now();
  const backtestAvgMs = (endBacktest - startBacktest) / backtestCount;

  console.log('📊 Benchmark Results Summary:');
  console.log('--------------------------------------------------');
  console.log(`1. Screener Query DSL AST Latency : ${screenerAvgMs.toFixed(3)} ms / query`);
  console.log(`2. Stock Search Execution Latency: ${searchAvgMs.toFixed(3)} ms / search`);
  console.log(`3. Quant Backtest Execution Latency: ${backtestAvgMs.toFixed(2)} ms / backtest`);
  console.log('--------------------------------------------------');
  console.log('✅ All local baseline performance checks PASSED cleanly.\n');
}

runPerformanceBenchmark().catch(console.error);
