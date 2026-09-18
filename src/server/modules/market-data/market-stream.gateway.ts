import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { db } from '../../database/db';

export class MarketStreamGateway {
  private wss: WebSocketServer | null = null;
  private intervalTimer: NodeJS.Timeout | null = null;

  public init(server: HttpServer) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      // Send welcome handshake
      ws.send(JSON.stringify({
        type: 'SYSTEM_STATUS',
        payload: {
          marketStatus: 'OPEN',
          streamLabel: 'Simulated Market Stream',
          isLive: true,
          connectedAt: new Date().toISOString()
        }
      }));
    });

    this.startSimulationStream();
  }

  private startSimulationStream() {
    this.intervalTimer = setInterval(() => {
      const stocks = db.getAllStocks();
      if (stocks.length === 0) return;

      // Pick 3 random stocks per tick
      const updatedTicks: any[] = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * stocks.length);
        const s = stocks[randomIndex];

        const pct = (Math.random() - 0.49) * 0.4; // micro tick fluctuation
        const newPrice = Number((s.currentPrice * (1 + pct / 100)).toFixed(2));
        const newChangePct = Number((s.priceChangePercent + pct).toFixed(2));
        const newChange = Number((newPrice - (s.currentPrice - s.priceChange)).toFixed(2));

        db.updateStockPrice(s.symbol, newPrice, newChange, newChangePct);

        updatedTicks.push({
          symbol: s.symbol,
          currentPrice: newPrice,
          priceChange: newChange,
          priceChangePercent: newChangePct,
          timestamp: new Date().toISOString()
        });

        // Evaluate alert rules for this symbol
        this.evaluateAlertsForSymbol(s.symbol, newPrice);
      }

      // Broadcast ticks to WebSockets
      if (this.wss && updatedTicks.length > 0) {
        const payload = JSON.stringify({
          type: 'MARKET_TICK',
          label: 'Simulated Market Stream',
          payload: updatedTicks
        });

        this.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }
    }, 1500);
  }

  private evaluateAlertsForSymbol(symbol: string, currentPrice: number) {
    const activeAlerts = db.getAllActiveAlerts().filter(a => a.symbol === symbol);
    for (const alert of activeAlerts) {
      let triggered = false;
      if (alert.operator === '>' && currentPrice > alert.threshold) triggered = true;
      if (alert.operator === '<' && currentPrice < alert.threshold) triggered = true;
      if (alert.operator === '>=' && currentPrice >= alert.threshold) triggered = true;
      if (alert.operator === '<=' && currentPrice <= alert.threshold) triggered = true;

      if (triggered) {
        alert.triggeredCount += 1;
        alert.lastTriggeredAt = new Date().toISOString();

        db.addNotification(alert.userId, {
          id: `notif_${Date.now()}`,
          userId: alert.userId,
          title: `Alert Triggered: ${symbol}`,
          message: `${symbol} target rule triggered! Price reached $${currentPrice} (${alert.operator} $${alert.threshold})`,
          type: 'ALERT',
          read: false,
          createdAt: new Date().toISOString()
        });

        // Broadcast notification event over WS
        if (this.wss) {
          this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'ALERT_TRIGGERED',
                payload: {
                  symbol,
                  currentPrice,
                  alertRule: alert
                }
              }));
            }
          });
        }
      }
    }
  }
}

export const marketStreamGateway = new MarketStreamGateway();
