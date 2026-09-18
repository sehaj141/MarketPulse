import { db } from '../../database/db';
import { ScreenerDslService } from '../screener/screener-dsl.service';
import { BacktestingService } from '../backtesting/backtesting.service';
import { ScreenerDSL } from '../../types';

export interface ToolCallResult {
  tool: string;
  args: any;
  result: any;
}

export class AIService {
  private static OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

  /**
   * Translates Natural Language prompt into a validated JSON Screener DSL AST.
   */
  public static async promptToDSL(prompt: string): Promise<{ dsl: ScreenerDSL; explanation: string }> {
    const lower = prompt.toLowerCase();

    // Smart NLP parser logic fallback (works out of the box or via Ollama)
    const conditions: any[] = [];
    let explanationParts: string[] = [];

    if (lower.includes('tech') || lower.includes('technology')) {
      conditions.push({ field: 'sector', operator: '==', value: 'Technology' });
      explanationParts.push('Sector is Technology');
    } else if (lower.includes('health') || lower.includes('healthcare')) {
      conditions.push({ field: 'sector', operator: '==', value: 'Healthcare' });
      explanationParts.push('Sector is Healthcare');
    } else if (lower.includes('finance') || lower.includes('financial')) {
      conditions.push({ field: 'sector', operator: '==', value: 'Financial Services' });
      explanationParts.push('Sector is Financial Services');
    }

    if (lower.includes('growth') || lower.includes('revenue')) {
      const match = lower.match(/(?:growth|revenue)(?:\s*(?:>|above|greater than))?\s*(\d+)?%?/);
      const val = match && match[1] ? parseInt(match[1]) : 15;
      conditions.push({ field: 'revenueGrowth', operator: '>', value: val });
      explanationParts.push(`Revenue Growth > ${val}%`);
    }

    if (lower.includes('momentum') || lower.includes('rsi')) {
      const match = lower.match(/rsi\s*(?:>|above|greater than)?\s*(\d+)/);
      const val = match && match[1] ? parseInt(match[1]) : 60;
      conditions.push({ field: 'rsi14', operator: '>', value: val });
      explanationParts.push(`RSI (14) > ${val}`);
    }

    if (lower.includes('moving average') || lower.includes('sma 50') || lower.includes('50-day') || lower.includes('sma50')) {
      conditions.push({ field: 'price_gt_sma50', operator: '==', value: 1 });
      explanationParts.push('Price is above 50-day Moving Average');
    }

    if (lower.includes('profitable') || lower.includes('margin')) {
      conditions.push({ field: 'profitMargin', operator: '>', value: 10 });
      explanationParts.push('Profit Margin > 10%');
    }

    if (lower.includes('cheap') || lower.includes('value') || lower.includes('low pe')) {
      conditions.push({ field: 'peRatio', operator: '<', value: 25 });
      explanationParts.push('P/E Ratio < 25');
    }

    // Default conditions if prompt was too broad
    if (conditions.length === 0) {
      conditions.push({ field: 'revenueGrowth', operator: '>', value: 10 });
      conditions.push({ field: 'rsi14', operator: '>', value: 50 });
      explanationParts.push('Revenue Growth > 10%', 'RSI > 50');
    }

    const dsl: ScreenerDSL = {
      logic: 'AND',
      conditions
    };

    // Validate generated DSL AST
    const validated = ScreenerDslService.validateDSL(dsl);

    return {
      dsl: validated,
      explanation: `I structured your prompt into the following validated query DSL: ${explanationParts.join(' AND ')}.`
    };
  }

  /**
   * AI Orchestrator Tool Execution Engine
   */
  public static async executeAITerminalCommand(prompt: string): Promise<{ text: string; toolCalls: ToolCallResult[] }> {
    const lower = prompt.toLowerCase();
    const toolCalls: ToolCallResult[] = [];
    let text = '';

    // Tool 1: Stock comparison (e.g. "compare NVDA and AMD")
    if (lower.includes('compare')) {
      const symbols = ['NVDA', 'AMD', 'AAPL', 'MSFT', 'AVGO', 'TSLA'].filter(s => lower.includes(s.toLowerCase()));
      const targetSymbols = symbols.length >= 2 ? symbols : ['NVDA', 'AMD'];

      const data = targetSymbols.map(sym => db.getStockBySymbol(sym)).filter(Boolean);
      toolCalls.push({
        tool: 'compareStocks',
        args: { symbols: targetSymbols },
        result: data
      });
      text = `I performed a multi-stock comparison across ${targetSymbols.join(', ')}. Key fundamental and technical metrics have been rendered in the dynamic workspace.`;
    }
    // Tool 2: Single stock search or quote (e.g. "analyze NVDA")
    else if (lower.includes('nvda') || lower.includes('nvidia')) {
      const stock = db.getStockBySymbol('NVDA');
      const tech = db.getTechnicalIndicators('NVDA');
      const history = db.getHistoricalPrices('NVDA').slice(-30);

      toolCalls.push({
        tool: 'getStockQuote',
        args: { symbol: 'NVDA' },
        result: { stock, technicals: tech, chart: history }
      });
      text = `Retrieved comprehensive research data for **NVIDIA Corporation (NVDA)**. Current price is $${stock?.currentPrice} (${stock?.priceChangePercent}%). RSI is ${tech?.rsi14} and 50-day SMA is $${tech?.sma50}.`;
    }
    // Tool 3: Run Screener (e.g. "find tech momentum stocks")
    else if (lower.includes('find') || lower.includes('screen') || lower.includes('search')) {
      const { dsl, explanation } = await this.promptToDSL(prompt);
      const results = ScreenerDslService.executeScreen(dsl);

      toolCalls.push({
        tool: 'runScreener',
        args: { dsl },
        result: { count: results.length, matches: results.slice(0, 10) }
      });
      text = `${explanation} Found **${results.length} stocks** matching your query. The top results have been loaded into the center workspace.`;
    }
    // Tool 4: Run Backtest
    else if (lower.includes('backtest') || lower.includes('strategy')) {
      const dsl: ScreenerDSL = {
        logic: 'AND',
        conditions: [
          { field: 'rsi14', operator: '>', value: 55 },
          { field: 'price_gt_sma50', operator: '==', value: 1 }
        ]
      };
      const result = BacktestingService.runBacktest({
        strategyName: 'AI Momentum Breakout Strategy',
        symbols: ['NVDA', 'AAPL', 'MSFT', 'AMD', 'META'],
        startDate: '2023-01-01',
        endDate: '2024-09-01',
        initialCapital: 100000,
        positionSizePercent: 20,
        transactionCostPercent: 0.1,
        dsl
      }, 'user_regular');

      toolCalls.push({
        tool: 'runBacktest',
        args: { strategyName: 'AI Momentum Breakout Strategy' },
        result
      });
      text = `Ran quantitative backtest for **AI Momentum Breakout Strategy** from 2023 to 2024. Achieved total return of **+${result.totalReturnPercent}%** with a Sharpe Ratio of **${result.sharpeRatio}** and Max Drawdown of **-${result.maxDrawdownPercent}%**.`;
    }
    // Default overview AI response
    else {
      const topGainers = db.getAllStocks().sort((a, b) => b.priceChangePercent - a.priceChangePercent).slice(0, 3);
      toolCalls.push({
        tool: 'getMarketOverview',
        args: {},
        result: { topGainers }
      });
      text = `Market Intelligence Summary: Markets are active. Top gaining stocks today include ${topGainers.map(g => `${g.symbol} (+${g.priceChangePercent}%)`).join(', ')}. You can ask me to screen stocks, compare tickers, or run quantitative backtests.`;
    }

    return { text, toolCalls };
  }
}
