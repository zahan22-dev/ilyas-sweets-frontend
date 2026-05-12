'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:3001';

export interface OrderNotification {
  id: string; // client-generated unique id
  orderId: number;
  customerName: string;
  totalAmount: number;
  fulfillmentType: string;
  paymentMethod: string;
  itemCount: number;
  createdAt: string;
  read: boolean;
}

const STORAGE_KEY = 'admin_notifications';
const MAX_NOTIFICATIONS = 50;

function loadFromStorage(): OrderNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(notifications: OrderNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Singleton socket ref — prevents duplicate connections across rerenders.
 * The socket is created once per browser session.
 */
let socketSingleton: Socket | null = null;

function getSocket(): Socket {
  if (!socketSingleton) {
    socketSingleton = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socketSingleton;
}

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const listenerAttached = useRef(false);

  // Initialize browser notification permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const requestBrowserPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      return permission;
    }
    return 'denied';
  }, []);

  // Load persisted notifications from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    setNotifications(stored);
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null;

    if (!token) return; // Only connect when authenticated

    const socket = getSocket();

    // Connect and authenticate
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit('join-admin', { token });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewOrder = (payload: Omit<OrderNotification, 'id' | 'read'>) => {
      const notification: OrderNotification = {
        ...payload,
        id: `${payload.orderId}-${Date.now()}`,
        read: false,
      };

      setNotifications((prev) => {
        const updated = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
        saveToStorage(updated);
        return updated;
      });

      // Fire Browser Notification if permitted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const notif = new Notification('New Order Received! 🛒', {
            body: `${payload.customerName} placed an order for Rs. ${payload.totalAmount}`,
            icon: '/favicon.ico', // fallback icon
          });

          notif.onclick = () => {
            window.focus();
            // The router.push to /admin/orders will be handled by the click on the layout,
            // or the admin is already there. If we had the Next router here we could push.
          };
        } catch (e) {
          console.warn('Browser notification failed:', e);
        }
      }
    };

    // Attach listeners only once — avoid duplicate handlers on rerender
    if (!listenerAttached.current) {
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('new_order', handleNewOrder);
      listenerAttached.current = true;

      // If already connected, join immediately
      if (socket.connected) {
        setIsConnected(true);
        socket.emit('join-admin', { token });
      }
    }

    return () => {
      // Cleanup only listeners — do NOT disconnect the singleton socket
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_order', handleNewOrder);
      listenerAttached.current = false;
    };
  }, []); // Empty deps — intentional singleton behaviour

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveToStorage([]);
  }, []);

  /**
   * Disconnect and reset singleton — call on admin logout.
   */
  const disconnect = useCallback(() => {
    if (socketSingleton) {
      socketSingleton.disconnect();
      socketSingleton = null;
    }
    setNotifications([]);
    setIsConnected(false);
    listenerAttached.current = false;
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    browserPermission,
    requestBrowserPermission,
    markAllRead,
    clearAll,
    disconnect,
  };
}
