import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { db } from './database/db';
import { authRouter } from './modules/auth/auth.router';
import { stocksRouter } from './modules/stocks/stocks.router';
import { screenerRouter } from './modules/screener/screener.router';
import { aiRouter } from './modules/ai/ai.router';
import { backtestingRouter } from './modules/backtesting/backtesting.router';
import { watchlistsRouter } from './modules/watchlists/watchlists.router';
import { alertsRouter } from './modules/alerts/alerts.router';
import { portfolioRouter } from './modules/portfolio/portfolio.router';
import { adminRouter, incrementApiRequestCount } from './modules/admin/admin.router';
import { healthRouter } from './modules/health/health.router';
import { swaggerRouter } from './modules/swagger/swagger.router';
import { marketStreamGateway } from './modules/market-data/market-stream.gateway';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logging & metric increment middleware
app.use((req, res, next) => {
  incrementApiRequestCount();
  next();
});

// Seed Database on startup
db.seed();

// API Routes
app.use('/health', healthRouter);
app.use('/api/docs', swaggerRouter);
app.use('/api/auth', authRouter);
app.use('/api/stocks', stocksRouter);
app.use('/api/screens', screenerRouter);
app.use('/api/ai', aiRouter);
app.use('/api/backtests', backtestingRouter);
app.use('/api/watchlists', watchlistsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/admin', adminRouter);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Create HTTP + WebSocket Server
const server = http.createServer(app);
marketStreamGateway.init(server);

server.listen(PORT, () => {
  console.log(`\n🚀 MarketPulse Financial Intelligence API running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Stream active on ws://localhost:${PORT}`);
  console.log(`📖 OpenAPI / Swagger Docs: http://localhost:${PORT}/api/docs`);
  console.log(`🩺 Health check endpoint: http://localhost:${PORT}/health\n`);
});
