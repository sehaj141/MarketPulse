import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: 'MarketPulse - Financial Intelligence & Stock Research Platform',
  description: 'Turn market data into decisions with Bloomberg-style information density, visual stock screener, AI terminal, and quantitative backtesting engine.',
  openGraph: {
    title: 'MarketPulse - Financial Intelligence',
    description: 'Turn market data into decisions.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
