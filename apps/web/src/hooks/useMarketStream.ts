import { useEffect } from 'react';
import { useStore, MarketTick } from '../store/useStore';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';

export function useMarketStream() {
  const updateTick = useStore((state) => state.updateTick);
  const setStreamStatus = useStore((state) => state.setStreamStatus);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    function connect() {
      try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          setStreamStatus(true, 'Simulated Market Stream');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'MARKET_TICK' && Array.isArray(data.payload)) {
              data.payload.forEach((tick: MarketTick) => {
                updateTick(tick);
              });
            }
          } catch (e) {
            console.error('Failed to parse WS tick payload:', e);
          }
        };

        ws.onclose = () => {
          setStreamStatus(false, 'Stream Reconnecting...');
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          if (ws) ws.close();
        };
      } catch (e) {
        console.error('WebSocket connection initialization error:', e);
      }
    }

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [updateTick, setStreamStatus]);
}
