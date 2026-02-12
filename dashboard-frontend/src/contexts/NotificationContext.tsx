import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Toast } from '../components/notifications/Toast';
import type { ToastType } from '../components/notifications/Toast';

interface Notification {
  id: string;
  message: string;
  type: ToastType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: ToastType) => void;
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  autoDismissDelay?: number; // milliseconds
}

export function NotificationProvider({ children, autoDismissDelay = 5000 }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const notification: Notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);

    // Auto-dismiss after delay
    if (autoDismissDelay > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, autoDismissDelay);
    }
  }, [autoDismissDelay]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, notifications }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Toast
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
            onDismiss={dismissNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

