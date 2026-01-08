import React, { createContext, useContext, useState, useEffect } from 'react';
import echo from '../echo';
import { useToast } from '../hooks/use-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { apiGet } = await import('../api/request');
      const response = await apiGet('/messages');
      const messages = response.data.messages || [];
      setNotifications(messages);
      setUnreadCount(messages.filter(m => !m.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const channel = echo.private('admin-notifications');

    channel.listen('.NewContactMessage', (data) => {
      console.log('New contact message received:', data);
      
      const newNotification = {
        id: data.id || Date.now(),
        name: data.sender_name || 'New Visitor',
        email: data.sender_email || '',
        message: data.message || 'New message received',
        date: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
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

  const markAsRead = async (id) => {
    try {
      // In a real app, call API here
      // const { apiPost } = await import('../api/request');
      // await apiPost(`/messages/${id}/read`);
      
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      // In a real app, call API here
      // const { apiDelete } = await import('../api/request');
      // await apiDelete(`/messages/${id}`);
      
      const notificationToDelete = notifications.find(n => n.id === id);
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading,
      fetchNotifications,
      markAsRead, 
      deleteNotification,
      markAllAsRead
    }}>
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
