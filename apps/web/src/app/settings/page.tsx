'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Settings, Moon, Sun, User, Lock, Key } from 'lucide-react';

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>ACCOUNT & SYSTEM SETTINGS</span>
          </h1>
          <p className="text-xs text-muted">User profile, theme preferences, API credentials</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        
        {/* Profile Card */}
        <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
          <h2 className="font-bold text-sm text-foreground flex items-center space-x-2">
            <User className="w-4 h-4 text-primary" />
            <span>User Profile</span>
          </h2>
          <div className="text-xs space-y-2">
            <div>
              <span className="text-muted block">Full Name</span>
              <span className="font-bold text-foreground">{user?.name}</span>
            </div>
            <div>
              <span className="text-muted block">Email Address</span>
              <span className="font-bold text-foreground">{user?.email}</span>
            </div>
            <div>
              <span className="text-muted block">Role</span>
              <span className="font-bold text-primary">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
          <h2 className="font-bold text-sm text-foreground flex items-center space-x-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
            <span>Theme & Display</span>
          </h2>
          <div className="flex items-center justify-between text-xs">
            <span>Current Theme Mode: <strong className="uppercase text-primary">{theme}</strong></span>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-surface-elevated border border-border hover:border-primary text-foreground font-semibold rounded"
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
