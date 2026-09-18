import { create } from 'zustand';

export interface UserState {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface MarketTick {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  timestamp: string;
}

interface AppStore {
  // Auth
  user: UserState | null;
  token: string | null;
  setUser: (user: UserState | null, token: string | null) => void;
  logout: () => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Market Stream
  isStreamLive: boolean;
  streamLabel: string;
  ticks: Record<string, MarketTick>;
  setStreamStatus: (isLive: boolean, label: string) => void;
  updateTick: (tick: MarketTick) => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Notifications
  unreadNotificationCount: number;
  setUnreadCount: (count: number) => void;
}

export const useStore = create<AppStore>((set) => ({
  user: {
    id: 'user_regular',
    email: 'user@marketpulse.com',
    name: 'Alex Rivera',
    role: 'USER'
  },
  token: 'mock_jwt_token',
  setUser: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),

  theme: 'dark',
  toggleTheme: () => set((state) => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      if (next === 'light') document.documentElement.classList.add('light');
      else document.documentElement.classList.remove('light');
    }
    return { theme: next };
  }),

  isStreamLive: true,
  streamLabel: 'Simulated Market Stream',
  ticks: {},
  setStreamStatus: (isStreamLive, streamLabel) => set({ isStreamLive, streamLabel }),
  updateTick: (tick) => set((state) => ({
    ticks: { ...state.ticks, [tick.symbol]: tick }
  })),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),

  unreadNotificationCount: 1,
  setUnreadCount: (count) => set({ unreadNotificationCount: count })
}));
