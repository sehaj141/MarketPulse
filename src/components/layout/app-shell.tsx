'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useMarketStream } from '@/hooks/useMarketStream';
import { CommandPalette } from './command-palette';
import {
  Activity,
  LayoutDashboard,
  Globe,
  Filter,
  BarChart3,
  Bookmark,
  Bell,
  Bot,
  PieChart,
  FolderSearch,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  Zap
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const user = useStore((state) => state.user);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const setCommandPaletteOpen = useStore((state) => state.setCommandPaletteOpen);
  const isStreamLive = useStore((state) => state.isStreamLive);
  const streamLabel = useStore((state) => state.streamLabel);

  // Initialize WebSocket market stream ticks listener
  useMarketStream();

  // If on public marketing landing page (/), render without sidebar shell
  if (pathname === '/') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Markets', path: '/markets', icon: Globe },
    { label: 'Screener', path: '/screener', icon: Filter },
    { label: 'Charts & Detail', path: '/stocks/NVDA', icon: BarChart3 },
    { label: 'Watchlists', path: '/watchlists', icon: Bookmark },
    { label: 'Alerts', path: '/alerts', icon: Bell },
    { label: 'AI Terminal', path: '/ai-terminal', icon: Bot },
    { label: 'Backtesting', path: '/backtesting', icon: PieChart },
    { label: 'Portfolio', path: '/portfolio', icon: Activity },
    { label: 'Saved Research', path: '/research', icon: FolderSearch },
    { label: 'Admin Panel', path: '/admin', icon: Shield },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stocks/${searchQuery.trim().toUpperCase()}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-black">
      <CommandPalette />

      {/* Persistent Header */}
      <header className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between sticky top-0 z-30">
        
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-muted hover:text-foreground hover:bg-surface-elevated rounded-md transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center font-bold text-black text-sm">
              M
            </div>
            <span className="font-extrabold text-base tracking-wider text-foreground font-mono">
              MARKET<span className="text-primary">PULSE</span>
            </span>
          </Link>
        </div>

        {/* Global Search & Command Palette Trigger */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
            <input
              type="text"
              placeholder="Search ticker, company or press Cmd+K..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-elevated text-xs font-mono pl-9 pr-16 py-2 rounded-md border border-border focus:outline-none focus:border-primary transition-colors placeholder:text-muted"
            />
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="absolute right-2 top-1.5 px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono text-muted hover:text-foreground"
            >
              ⌘K
            </button>
          </form>
        </div>

        {/* Live Stream Status, Notifications, Theme, User Profile */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* Live Market Stream Status Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-elevated border border-border font-mono text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isStreamLive ? 'bg-success animate-pulse' : 'bg-danger'}`} />
            <span className="text-muted font-medium">{streamLabel}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-md transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-md transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </button>

            {/* Notifications Dropdown Drawer */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
                  <span className="font-semibold text-xs text-foreground">Notifications</span>
                  <span className="text-[10px] text-primary font-mono">1 New Alert</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2 bg-surface-elevated rounded border border-border/50 text-xs">
                    <div className="flex items-center justify-between font-mono text-success text-[11px] mb-1">
                      <span>⚡ NVDA Price Breakout</span>
                      <span>10m ago</span>
                    </div>
                    <p className="text-muted text-[11px]">Target price $130.00 crossed. Current simulated tick: $131.40.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile User Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-border">
            <div className="w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-bold text-xs text-primary">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <span className="hidden lg:inline font-medium text-muted">{user?.name}</span>
          </div>

        </div>
      </header>

      {/* Main Body with Persistent Sidebar & Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside
          className={`border-r border-border bg-surface transition-all duration-200 flex flex-col justify-between ${
            collapsed ? 'w-16' : 'w-56'
          }`}
        >
          <nav className="p-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs transition-colors group ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                      : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted group-hover:text-foreground'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-border bg-surface-elevated/50 font-mono text-[10px] text-muted text-center">
            {!collapsed ? (
              <div>
                <p className="text-foreground font-semibold">MARKETPULSE v1.0</p>
                <p className="text-[9px] mt-0.5">SaaS Financial OS</p>
              </div>
            ) : (
              <Zap className="w-4 h-4 mx-auto text-primary" />
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>

      {/* Footer Disclaimer */}
      <footer className="py-2.5 px-4 border-t border-border bg-surface text-center font-mono text-[11px] text-muted">
        MarketPulse is an independent portfolio project and is not affiliated with any financial platform. Simulated market data for demonstration only.
      </footer>
    </div>
  );
}
