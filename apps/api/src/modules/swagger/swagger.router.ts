import { Router, Request, Response } from 'express';

export const swaggerRouter = Router();

const SWAGGER_DOCS_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MarketPulse API Documentation (OpenAPI v3)</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; background: #0b0e14; color: #e2e8f0; font-family: monospace; }
    .swagger-ui { filter: invert(88%) hue-rotate(180deg); }
    .header-bar { padding: 16px 24px; background: #121824; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; }
    .header-title { font-size: 18px; font-weight: bold; color: #38bdf8; }
    .header-tag { font-size: 12px; background: #0369a1; color: #e0f2fe; padding: 4px 8px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="header-title">⚡ MARKETPULSE OpenAPI / Swagger v3 Specification</div>
    <div class="header-tag">Production Ready API v1.0</div>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    const spec = {
      openapi: "3.0.0",
      info: {
        title: "MarketPulse Financial Intelligence Platform API",
        version: "1.0.0",
        description: "RESTful endpoints for real-time market data, JSON Query DSL screener, quant backtesting engine, AI tool calling, and watchlists."
      },
      servers: [{ url: "http://localhost:4000/api" }],
      paths: {
        "/stocks": { get: { summary: "List paginated stocks", responses: { "200": { description: "Success" } } } },
        "/stocks/search": { get: { summary: "Global ticker and company search", responses: { "200": { description: "Success" } } } },
        "/stocks/overview": { get: { summary: "Market overview, gainers, losers, breadth", responses: { "200": { description: "Success" } } } },
        "/stocks/{symbol}": { get: { summary: "Stock detail with fundamentals and technicals", responses: { "200": { description: "Success" } } } },
        "/screens/run": { post: { summary: "Execute JSON Query DSL screening AST", responses: { "200": { description: "Success" } } } },
        "/ai/query": { post: { summary: "AI Terminal prompt tool call orchestrator", responses: { "200": { description: "Success" } } } },
        "/backtests": { post: { summary: "Run quantitative strategy backtest", responses: { "200": { description: "Success" } } } },
        "/watchlists": { get: { summary: "Get user watchlists", responses: { "200": { description: "Success" } } } },
        "/alerts": { get: { summary: "Get event-driven price alerts", responses: { "200": { description: "Success" } } } }
      }
    };
    window.onload = () => {
      SwaggerUIBundle({
        spec: spec,
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>
`;

swaggerRouter.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  return res.send(SWAGGER_DOCS_HTML);
});
