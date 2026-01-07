import React, { createContext, useContext, useState, useEffect } from 'react';
import echo from '../echo';
import { useToast } from '../hooks/use-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const channel = echo.private('admin-notifications');

    channel.listen('.NewContactMessage', (data) => {
      console.log('New contact message received:', data);
      setUnreadCount((prev) => prev + 1);
      
      toast({
        title: "New Message",
        description: `New message from ${data.sender_name || 'a visitor'}`,
      });
    });

    return () => {
      echo.leave('admin-notifications');
    };
  }, [toast]);

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, resetUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
