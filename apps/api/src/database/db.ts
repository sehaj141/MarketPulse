import { createSeedDataset, SEED_USERS, SEED_WATCHLISTS, SEED_SAVED_SCREENS, SEED_ALERTS, SEED_PORTFOLIO, SEED_NEWS } from './seed-data';
import { Stock, HistoricalPrice, TechnicalIndicators, User, Watchlist, SavedScreen, AlertRule, BacktestResult, PortfolioPosition, AppNotification, StockNewsItem } from '../types';

class DatabaseService {
  private stocks: Map<string, Stock> = new Map();
  private historicalPrices: Map<string, HistoricalPrice[]> = new Map();
  private technicalIndicators: Map<string, TechnicalIndicators> = new Map();
  private users: Map<string, User> = new Map();
  private watchlists: Map<string, Watchlist> = new Map();
  private savedScreens: Map<string, SavedScreen> = new Map();
  private alerts: Map<string, AlertRule> = new Map();
  private notifications: Map<string, AppNotification[]> = new Map();
  private backtests: Map<string, BacktestResult> = new Map();
  private portfolioPositions: Map<string, PortfolioPosition[]> = new Map();
  private news: StockNewsItem[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    const { stocks, historicalMap, technicalsMap } = createSeedDataset();
    stocks.forEach(s => this.stocks.set(s.symbol, s));
    Object.entries(historicalMap).forEach(([sym, prices]) => this.historicalPrices.set(sym, prices));
    Object.entries(technicalsMap).forEach(([sym, tech]) => this.technicalIndicators.set(sym, tech));

    SEED_USERS.forEach(u => this.users.set(u.email, u));
    SEED_WATCHLISTS.forEach(w => this.watchlists.set(w.id, w));
    SEED_SAVED_SCREENS.forEach(s => this.savedScreens.set(s.id, s));
    SEED_ALERTS.forEach(a => this.alerts.set(a.id, a));

    this.portfolioPositions.set('user_regular', SEED_PORTFOLIO);
    this.notifications.set('user_regular', [
      {
        id: 'notif_1',
        userId: 'user_regular',
        title: 'NVDA Alert Triggered',
        message: 'NVIDIA Corporation crossed target price threshold of $130.00',
        type: 'ALERT',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'notif_2',
        userId: 'user_regular',
        title: 'Market Open Digest',
        message: 'Tech sector leading pre-market momentum with NIFTY 50 & NASDAQ up +0.8%',
        type: 'SYSTEM',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ]);

    this.news = SEED_NEWS;
  }

  // Stocks
  public getAllStocks(): Stock[] {
    return Array.from(this.stocks.values());
  }

  public getStockBySymbol(symbol: string): Stock | undefined {
    return this.stocks.get(symbol.toUpperCase());
  }

  public updateStockPrice(symbol: string, newPrice: number, change: number, changePercent: number): Stock | undefined {
    const s = this.stocks.get(symbol);
    if (s) {
      s.currentPrice = newPrice;
      s.priceChange = change;
      s.priceChangePercent = changePercent;
      s.updatedAt = new Date().toISOString();
      this.stocks.set(symbol, s);
    }
    return s;
  }

  public searchStocks(query: string): Stock[] {
    const q = query.trim().toLowerCase();
    if (!q) return Array.from(this.stocks.values()).slice(0, 10);

    return Array.from(this.stocks.values()).filter(s =>
      s.symbol.toLowerCase().includes(q) ||
      s.companyName.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    ).slice(0, 20);
  }

  // Historical Prices & Technicals
  public getHistoricalPrices(symbol: string): HistoricalPrice[] {
    return this.historicalPrices.get(symbol.toUpperCase()) || [];
  }

  public getTechnicalIndicators(symbol: string): TechnicalIndicators | undefined {
    return this.technicalIndicators.get(symbol.toUpperCase());
  }

  // Users
  public getUserByEmail(email: string): User | undefined {
    return this.users.get(email.toLowerCase());
  }

  public createUser(user: User): User {
    this.users.set(user.email.toLowerCase(), user);
    return user;
  }

  // Watchlists
  public getUserWatchlists(userId: string): Watchlist[] {
    return Array.from(this.watchlists.values()).filter(w => w.userId === userId);
  }

  public createWatchlist(wl: Watchlist): Watchlist {
    this.watchlists.set(wl.id, wl);
    return wl;
  }

  public updateWatchlist(id: string, symbols: string[]): Watchlist | undefined {
    const wl = this.watchlists.get(id);
    if (wl) {
      wl.symbols = symbols;
      this.watchlists.set(id, wl);
    }
    return wl;
  }

  public deleteWatchlist(id: string): boolean {
    return this.watchlists.delete(id);
  }

  // Saved Screens
  public getSavedScreens(userId: string): SavedScreen[] {
    return Array.from(this.savedScreens.values()).filter(s => s.userId === userId || s.isPublic);
  }

  public createSavedScreen(screen: SavedScreen): SavedScreen {
    this.savedScreens.set(screen.id, screen);
    return screen;
  }

  // Alerts
  public getUserAlerts(userId: string): AlertRule[] {
    return Array.from(this.alerts.values()).filter(a => a.userId === userId);
  }

  public getAllActiveAlerts(): AlertRule[] {
    return Array.from(this.alerts.values()).filter(a => a.isActive);
  }

  public createAlert(alert: AlertRule): AlertRule {
    this.alerts.set(alert.id, alert);
    return alert;
  }

  public toggleAlert(id: string): AlertRule | undefined {
    const a = this.alerts.get(id);
    if (a) {
      a.isActive = !a.isActive;
      this.alerts.set(id, a);
    }
    return a;
  }

  public deleteAlert(id: string): boolean {
    return this.alerts.delete(id);
  }

  // Notifications
  public getUserNotifications(userId: string): AppNotification[] {
    return this.notifications.get(userId) || [];
  }

  public addNotification(userId: string, notif: AppNotification) {
    const userNotifs = this.notifications.get(userId) || [];
    userNotifs.unshift(notif);
    this.notifications.set(userId, userNotifs);
  }

  public markNotificationAsRead(userId: string, id: string) {
    const list = this.notifications.get(userId) || [];
    const item = list.find(n => n.id === id);
    if (item) item.read = true;
  }

  // Backtests
  public saveBacktest(result: BacktestResult): BacktestResult {
    this.backtests.set(result.id, result);
    return result;
  }

  public getBacktest(id: string): BacktestResult | undefined {
    return this.backtests.get(id);
  }

  // Portfolio
  public getUserPortfolio(userId: string): PortfolioPosition[] {
    return this.portfolioPositions.get(userId) || [];
  }

  // News
  public getStockNews(symbol?: string): StockNewsItem[] {
    if (!symbol) return this.news;
    return this.news.filter(n => n.symbol.toUpperCase() === symbol.toUpperCase());
  }
}

export const db = new DatabaseService();
